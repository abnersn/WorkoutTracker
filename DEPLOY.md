# Deploying Workout Tracker

How to take this repo from "runs on my machine" to a staging and a production
environment, each on a URL that stays the same between deploys.

This guide starts from nothing: no cloud accounts, no tokens, no settings in
GitHub. Skip a step only if you are sure it is already done.

## What ends up where

| Piece                            | Runs on            | Fixed URL                                        |
| -------------------------------- | ------------------ | ------------------------------------------------ |
| Shell + 5 remotes                | Zephyr Cloud       | One Zephyr **environment** URL per environment   |
| Gateway (GraphQL)                | Cloud Run, public  | `https://gateway[-staging]-….run.app`            |
| `users-svc`, `workouts-svc`      | Cloud Run, private | Internal only; the gateway looks them up         |
| `users` and `workouts` databases | MongoDB Atlas      | One cluster, shared by staging and production    |
| Pipeline (`.github/workflows/`)  | GitHub Actions     | `staging-*` tag → staging, `v*` tag → production |

Every Zephyr build gets a new per-version URL, with a build number and a hash
in it. That one changes on every deploy. The fixed address is the
**environment URL** you create in step 7; it always serves the newest build of
that environment.

## The order, and why

1. **Check the repo**, because `deploy.yml` runs every check first and stops
   if one fails.
2. **MongoDB Atlas**, because the services refuse to boot without a database.
3. **GCP**, because the secrets, images and services live there.
4. **Zephyr account, application ID and CI token**, so the pipeline is allowed
   to upload the front ends and you know where they will show up.
5. **GitHub variables and secrets**, which point the pipeline at what steps 2
   to 4 made.
6. **First staging deploy.** The pipeline itself goes services → gateway →
   front ends, so a new UI never calls an old gateway.
7. **Zephyr tag and environment**, which need a build from step 6 to point at.
   This produces the fixed front-end URL.
8. **CORS**, because the gateway only answers origins it knows, and the origin
   is the URL from step 7.
9. **Production**, repeating 6 to 8 once staging works.

Staging goes first on purpose: every mistake in the setup shows up there.

## Tools to install

| Tool              | Needed for                   | Install                                       |
| ----------------- | ---------------------------- | --------------------------------------------- |
| `git`             | Tagging                      | <https://git-scm.com/downloads>               |
| Node 22+ and npm  | Local checks                 | <https://nodejs.org>                          |
| `gh` (GitHub CLI) | Variables, secrets, runs     | <https://cli.github.com>                      |
| `gcloud`          | All GCP setup                | <https://cloud.google.com/sdk/docs/install>   |
| `openssl`         | Generating secrets           | Ships with most Linux distributions and macOS |
| `mongosh`         | Optional: testing Atlas URIs | <https://www.mongodb.com/docs/mongodb-shell/> |

Docker is not needed for deploying. CI builds the images.

Sign both CLIs in, and install the repo's dependencies:

```sh
gh auth login
gcloud auth login
npm install
```

The repo must be on GitHub, with you as an admin (you will create variables,
secrets and environments). Check which repo the commands will act on:

```sh
gh repo view --json nameWithOwner --jq .nameWithOwner
```

## Step 1: Check the repo

`deploy.yml` starts with the `Verify` workflow, so a tag deploys nothing
unless these pass. Run them on the commit you plan to deploy:

```sh
npm run format:check
npx nx run-many -t lint typecheck test
npx nx run-many -t build
```

Fix anything that fails, push to `main`, and confirm the `Verify` run on
GitHub is green:

```sh
gh run list --workflow Verify --limit 1
```

## Step 2: MongoDB Atlas

Sign up at <https://www.mongodb.com/cloud/atlas/register> (Google or GitHub
sign-in works). The free M0 tier is enough.

**Staging and production share one database.** There is one Atlas project, one
cluster, and one `users` and one `workouts` database, and both environments
connect to them. What that means in practice:

- An account created on staging exists on production, and the other way
  round. Workouts and history are the same on both.
- Staging is for trying new **code**, not for throwaway **data**. Anything a
  staging build writes, changes or deletes is real.
- A staging build that changes how documents are stored changes them for
  production too, while production still runs the old code. Keep data changes
  backwards compatible, or ship them to both environments together.
- `npm run dev:staging` on your machine also talks to this database.

Create **one project**, `workout-tracker`, and do the following in it.

1. **Create a cluster.** Tier **M0 (Free)**, provider **Google Cloud**, and the
   region closest to the Cloud Run region you will use in step 3 (Iowa for
   `us-central1`).
2. **Database Access → Add New Database User**, twice. Password
   authentication, with a password from `openssl rand -hex 24` (hex needs no
   URL escaping). Under "Specific Privileges":

   | User           | Privilege                          |
   | -------------- | ---------------------------------- |
   | `users-svc`    | `readWrite` on database `users`    |
   | `workouts-svc` | `readWrite` on database `workouts` |

   This is what keeps each service out of the other's data.

3. **Network Access → Add IP Address → Allow access from anywhere**
   (`0.0.0.0/0`). Cloud Run has no fixed outgoing IP, so an allow-list can't
   work without paid networking. The database users and passwords are the
   protection.
4. **Connect → Drivers** and copy the host (`cluster0.xxxxx.mongodb.net`).

Build the two connection strings. The database name in the
path matters; the services use it as their database.

```text
mongodb+srv://users-svc:<password>@<host>/users?retryWrites=true&w=majority
mongodb+srv://workouts-svc:<password>@<host>/workouts?retryWrites=true&w=majority
```

You now have two strings, one per service, used by both environments. Keep them in a
password manager; step 3 puts them in Secret Manager. They never go in the
repo or in GitHub.

## Step 3: Google Cloud

Sign up at <https://console.cloud.google.com> and create a **billing account**
(a card is required; this app fits in the free tier at hobby traffic, since
Cloud Run scales to zero).

Run everything below in one terminal session. Pick your own project ID; it
must be globally unique.

```sh
export PROJECT_ID=workout-tracker-CHANGEME
export REGION=us-central1
export REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
```

### 3a. Project, billing, APIs

```sh
gcloud projects create "$PROJECT_ID"
gcloud config set project "$PROJECT_ID"

gcloud billing accounts list
gcloud billing projects link "$PROJECT_ID" --billing-account=XXXXXX-XXXXXX-XXXXXX

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com

export PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
```

### 3b. Image registry

The name `workout-tracker` is hard-coded in `deploy.yml`.

```sh
gcloud artifacts repositories create workout-tracker \
  --repository-format=docker --location="$REGION"
```

### 3c. Service accounts

Three accounts: one the pipeline deploys as, and one each for the gateway and
the services to run as.

```sh
gcloud iam service-accounts create wt-deployer --display-name="GitHub Actions deployer"
gcloud iam service-accounts create wt-gateway  --display-name="Gateway runtime"
gcloud iam service-accounts create wt-services --display-name="gRPC services runtime"

export DEPLOY_SA="wt-deployer@$PROJECT_ID.iam.gserviceaccount.com"
export GATEWAY_SA="wt-gateway@$PROJECT_ID.iam.gserviceaccount.com"
export SERVICES_SA="wt-services@$PROJECT_ID.iam.gserviceaccount.com"

# The deployer pushes images and manages Cloud Run services...
for role in roles/run.admin roles/artifactregistry.writer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$DEPLOY_SA" --role="$role" --condition=None
done

# ...and may attach the two runtime accounts to them.
for sa in "$GATEWAY_SA" "$SERVICES_SA"; do
  gcloud iam service-accounts add-iam-policy-binding "$sa" \
    --member="serviceAccount:$DEPLOY_SA" --role=roles/iam.serviceAccountUser
done
```

### 3d. Secrets

Six secrets, three per environment. The names are fixed by `deploy.yml`,
which looks up `<name>-staging` or `<name>-production`, so both sets must
exist even though the database strings in them are identical.

| Secret                       | Value                                 | Read by       |
| ---------------------------- | ------------------------------------- | ------------- |
| `jwt-secret-<env>`           | Random, 32+ characters, one per env   | `wt-gateway`  |
| `users-mongodb-uri-<env>`    | The `users-svc` string from step 2    | `wt-services` |
| `workouts-mongodb-uri-<env>` | The `workouts-svc` string from step 2 | `wt-services` |

Run this block once. It asks for the two Atlas strings and stores each under
both environments. `read -s` keeps them out of your shell history, and
`printf '%s'` avoids a trailing newline, which would break the connection
string.

```sh
read -rs "USERS_URI?users-svc URI: "; echo
read -rs "WORKOUTS_URI?workouts-svc URI: "; echo

for ENV in staging production; do
  openssl rand -hex 32 | tr -d '\n' |
    gcloud secrets create "jwt-secret-$ENV" --data-file=-
  printf '%s' "$USERS_URI" |
    gcloud secrets create "users-mongodb-uri-$ENV" --data-file=-
  printf '%s' "$WORKOUTS_URI" |
    gcloud secrets create "workouts-mongodb-uri-$ENV" --data-file=-

  gcloud secrets add-iam-policy-binding "jwt-secret-$ENV" \
    --member="serviceAccount:$GATEWAY_SA" --role=roles/secretmanager.secretAccessor
  for s in users workouts; do
    gcloud secrets add-iam-policy-binding "$s-mongodb-uri-$ENV" \
      --member="serviceAccount:$SERVICES_SA" --role=roles/secretmanager.secretAccessor
  done
done

unset USERS_URI WORKOUTS_URI
```

(`read "VAR?prompt"` is zsh syntax. In bash, use `read -rsp "prompt" VAR`.)

Staging and production still get different JWT secrets. The accounts are the
same, but a token issued by one gateway is refused by the other, so you sign
in separately on each URL.

### 3e. Let GitHub Actions sign in without a key

Workload Identity Federation: GitHub proves which repo a job runs in, and GCP
lets only this repo act as the deployer. No key file exists anywhere.

```sh
gcloud iam workload-identity-pools create github \
  --location=global --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc github \
  --location=global --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='$REPO'"

gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$REPO"

export WIF_PROVIDER="projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github"
```

The repository name in the condition is case-sensitive. If the repo is ever
renamed or moved, both the condition and the binding must be updated.

## Step 4: Zephyr account, application ID and CI token

### 4a. Sign up

Create an account at <https://app.zephyr-cloud.io>, signing in **with the
GitHub account that will push the release tags**. Zephyr matches the person
who triggered a CI run to a Zephyr user through that link. If you signed up
another way, connect GitHub afterwards on the **Git Providers** page.

### 4b. Know your application IDs

You don't create applications in Zephyr. The first upload creates them, and
Zephyr works out each one's ID from the repo:

```text
<app name>.<repository>.<owner>          all lowercase
```

| Part         | Comes from                                      | In this repo            |
| ------------ | ----------------------------------------------- | ----------------------- |
| `app name`   | `name` in the app's own `package.json`          | `shell`, `auth`, …      |
| `repository` | The repository name in `git remote origin`      | e.g. `workouttracker`   |
| `owner`      | The user or organization in `git remote origin` | your GitHub user or org |

Print the six IDs this checkout will produce:

```sh
REPO_ID=$(gh repo view --json nameWithOwner --jq '.nameWithOwner | ascii_downcase | split("/") | "\(.[1]).\(.[0])"')
for app in shell auth workout-list workout-new workout-view workout-history; do
  echo "$(node -p "require('./client/apps/$app/package.json').name").$REPO_ID"
done
```

Write down the shell's ID (`shell.<repository>.<owner>`). It is the
application you open in step 7, and it is part of every front-end URL.

Things that follow from this:

- **Renaming or moving the repository, or changing a `name` in a
  `package.json`, changes the ID.** Zephyr then treats it as a brand-new
  application with new URLs, and the tags and environments from step 7 have
  to be made again.
- **A fork deploys under the fork owner's ID**, never over yours.
- The shell finds its remotes by app name: the `zephyr:dependencies` block in
  `client/apps/shell/package.json` lists `workout-view`, `workout-list` and the
  rest, and Zephyr looks them up in the same repository and owner. Rename a
  remote and that block must change with it.
- The build needs a git remote and at least one commit. A checkout without
  `origin` can't be given an ID.

### 4c. Create the CI token

In the Zephyr dashboard: **Settings → Tokens → CI Tokens**, generate a token,
and copy it straight away. It is shown once. Step 5 stores it in GitHub; don't
put it anywhere else.

## Step 5: GitHub variables, secrets and environments

Everything here except the Zephyr token is a **variable**, not a secret. Same terminal
session as step 3, so the exports are still set.

```sh
# Prompts for the token from step 4c, so it never lands in shell history.
gh secret set ZEPHYR_CI_TOKEN

gh variable set GCP_PROJECT_ID   --body "$PROJECT_ID"
gh variable set GCP_REGION       --body "$REGION"
gh variable set GCP_WIF_PROVIDER --body "$WIF_PROVIDER"
gh variable set GCP_DEPLOY_SA    --body "$DEPLOY_SA"
gh variable set GCP_GATEWAY_SA   --body "$GATEWAY_SA"
gh variable set GCP_SERVICES_SA  --body "$SERVICES_SA"

gh api -X PUT "repos/$REPO/environments/staging"
gh api -X PUT "repos/$REPO/environments/production"

# Placeholders. The real origins don't exist until step 8.
gh variable set CORS_ORIGINS --env staging    --body "http://localhost:8100"
gh variable set CORS_ORIGINS --env production --body "http://localhost:8100"
```

`CORS_ORIGINS` can't be empty: the gateway refuses to start without at least
one origin.

Where every setting lives, for reference:

| Setting                                              | Kind                | Where                                |
| ---------------------------------------------------- | ------------------- | ------------------------------------ |
| `ZEPHYR_CI_TOKEN`                                    | Secret              | GitHub repository secret             |
| `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`   | Variable            | GitHub repository variables          |
| `GCP_DEPLOY_SA`, `GCP_GATEWAY_SA`, `GCP_SERVICES_SA` | Variable            | GitHub repository variables          |
| `CORS_ORIGINS`                                       | Variable            | GitHub environments, one value each  |
| `jwt-secret-<env>`, `*-mongodb-uri-<env>`            | Secret              | GCP Secret Manager                   |
| `GATEWAY_URL`, gRPC URLs, `APP_ENV`                  | Set by the pipeline | Nowhere; `deploy.yml` works them out |

`ZEPHYR_CI_TOKEN` must stay a _repository_ secret. The `client` job doesn't
run in a GitHub environment, so it can't see environment secrets. If the token
ever needs replacing, repeat step 4c and run `gh secret set ZEPHYR_CI_TOKEN`
again.

## Step 6: First staging deploy

```sh
git checkout main && git pull
git tag staging-1.1.0
git push origin staging-1.1.0
gh run watch
```

The run does, in order: verify → build and push three images → deploy
`users-svc-staging` and `workouts-svc-staging` → deploy `gateway-staging` →
build and upload the six front ends to Zephyr.

When it finishes:

```sh
# The gateway's fixed URL
gcloud run services describe gateway-staging --region "$REGION" --format='value(status.url)'

# It should answer {"data":{"__typename":"Query"}}
curl -s -X POST "$(gcloud run services describe gateway-staging --region "$REGION" --format='value(status.url)')/graphql" \
  -H 'content-type: application/json' -d '{"query":"{__typename}"}'
```

The front end is uploaded but not usable yet: it has no fixed URL (step 7) and
the gateway doesn't accept its origin (step 8).

If the run fails, see [Troubleshooting](#troubleshooting).

## Step 7: Zephyr tag and environment

This is what creates the fixed front-end URL. Only the **shell** needs it. The
shell is the one app the browser opens, and each shell build already pins the
exact remote versions that were deployed alongside it.

In the Zephyr dashboard (<https://app.zephyr-cloud.io>), open the application
whose ID is the shell's from step 4b. It only appears after the first upload,
which step 6 just did.

1. **DevOps → Tags → New Tag.** Name it `staging`. **Add Condition** →
   **Environment** is `staging`. Save. The tag now follows the newest shell
   build made with `ZE_ENV=staging`, which `deploy.yml` sets.
2. **DevOps → Environments** → create an environment named `staging`, based on
   the **tag** `staging` (not on a fixed version).
3. Copy the environment's URL. It looks like
   `https://staging-shell-<repository>-<owner>-<hash>-ze.zephyrcloud.app`.

Because the environment follows a tag, each later `staging-*` deploy shows up
at the same URL with no further clicks. An environment based on a fixed
version would not update by itself.

## Step 8: Point CORS at the fixed URL

The value is a bare origin: no path, no trailing slash. Staging also keeps
`localhost:8100` so `npm run dev:staging` works.

```sh
STAGING_URL=https://staging-shell-…-ze.zephyrcloud.app   # from step 7

gh variable set CORS_ORIGINS --env staging --body "$STAGING_URL,http://localhost:8100"
```

The gateway reads this when it is deployed, so deploy again:

```sh
git tag staging-1.1.1
git push origin staging-1.1.1
gh run watch
```

Open the staging URL, create an account, build a workout. Staging is done.

## Step 9: Production

Same three moves, with `production` in place of `staging`.

1. Deploy:

   ```sh
   git tag v1.1.0
   git push origin v1.1.0
   gh run watch
   ```

2. In Zephyr, on the `shell` app: a tag `production` with the condition
   **Environment** is `production`, then an environment `production` based on
   that tag. Copy its URL.
3. Set the origin (production only, no localhost) and deploy again:

   ```sh
   gh variable set CORS_ORIGINS --env production --body "https://production-shell-…-ze.zephyrcloud.app"
   git tag v1.1.1
   git push origin v1.1.1
   ```

Optional but sensible: in GitHub, **Settings → Environments → production**,
add yourself as a required reviewer, so a `v*` tag waits for a click before it
touches production.

## The fixed URLs

Fill these in once and they don't change.

| Environment | Front end (Zephyr environment)              | Gateway (Cloud Run)                 |
| ----------- | ------------------------------------------- | ----------------------------------- |
| Staging     | `https://staging-shell-…zephyrcloud.app`    | `https://gateway-staging-….run.app` |
| Production  | `https://production-shell-…zephyrcloud.app` | `https://gateway-….run.app`         |

## Day to day

```sh
git tag staging-1.2.0 && git push origin staging-1.2.0   # ship main to staging
git tag v1.2.0        && git push origin v1.2.0          # ship main to production
```

- Tag the commit you tested on staging, not whatever `main` has become since.
- Deploys to the same environment queue up; they don't cancel each other.
- **Roll back the front end:** in Zephyr, point the environment at an older
  shell version. Switch it back to the tag afterwards, or it stops updating.
- **Roll back a server:**
  `gcloud run services update-traffic gateway --region "$REGION" --to-revisions=<revision>=100`,
  with the revision name from `gcloud run revisions list --service gateway`.
- **Rotate a secret:**
  `printf '%s' "$NEW" | gcloud secrets versions add jwt-secret-production --data-file=-`,
  then deploy. Services read `latest` only when a new revision starts.
  Rotating a JWT secret signs everyone out. A new database password goes in
  both the `-staging` and `-production` secret, and both environments need a
  deploy.
- **Give staging its own data later:** create a second Atlas project and
  cluster with the same two users, put its strings in the two `-staging`
  secrets with `gcloud secrets versions add`, and push a `staging-*` tag.
  Nothing in the code or the workflow changes.

## Troubleshooting

| Symptom                                                    | Cause and fix                                                                                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verify` job fails                                         | Run the checks from step 1 locally.                                                                                                                             |
| `google-github-actions/auth` fails                         | A `GCP_*` variable is missing, or the repo name in step 3e doesn't match exactly.                                                                               |
| `Permission 'iam.serviceaccounts.actAs' denied`            | The `serviceAccountUser` bindings in step 3c.                                                                                                                   |
| `docker push` denied                                       | The registry isn't named `workout-tracker`, or isn't in `GCP_REGION`.                                                                                           |
| A service revision fails to start                          | `gcloud run services logs read <name> --region "$REGION"`. The servers print exactly which variable is invalid. Usually a secret that is missing or unreadable. |
| `users-svc` or `workouts-svc` times out at startup         | Atlas network access (step 2.3), or a wrong password in the URI.                                                                                                |
| Browser console: "blocked by CORS policy"                  | `CORS_ORIGINS` doesn't match the page's origin exactly, or the gateway wasn't redeployed after changing it.                                                     |
| Shell build: `GATEWAY_URL must be set to deploy the shell` | The `server` job produced no URL; look at its "Deploy the gateway" step.                                                                                        |
| Zephyr: `ZE_CI_TOKEN could not be exchanged`               | The token was revoked, or the GitHub user who pushed the tag isn't linked in Zephyr's Git Providers.                                                            |
| The environment URL still shows the old build              | The environment is based on a version, not the tag, or `ZE_ENV` isn't reaching the build.                                                                       |
| First request after a quiet spell takes several seconds    | Cloud Run cold start, three services deep. `--min-instances 1` fixes it, at a monthly cost.                                                                     |

## Things worth knowing

- **Costs.** Atlas M0 and Zephyr's free plan cost nothing; check Zephyr's
  current limits at <https://zephyr-cloud.io/pricing>. On GCP, Cloud Run and
  Secret Manager stay inside the free tier at this scale. Artifact Registry
  gives 0.5 GB free, and every deploy pushes three new images, so add a
  cleanup policy (Console → Artifact Registry → `workout-tracker` → Cleanup
  policies → keep the 5 most recent versions).
- **Deploy staging and production from the same commit one after the other,
  not at once from different commits.** The shell picks up the newest build of
  each remote (`@*` in `client/apps/shell/package.json`), so two different commits
  deploying side by side could mix remotes.
- **Not verified here:** the Zephyr dashboard labels in step 7 follow the
  current docs (<https://docs.zephyr-cloud.io/features/tags-environments>) and
  may be worded slightly differently on screen. If the dashboard won't create
  an environment for a tag that has no builds yet, that is why step 7 comes
  after step 6.
