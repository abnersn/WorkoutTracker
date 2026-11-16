# Deploying Workout Tracker

How to take this repo from "runs on my machine" to a staging and a production
environment, each on a URL that stays the same between deploys.

## What ends up where

| Piece                            | Runs on            | Fixed URL                                        |
| -------------------------------- | ------------------ | ------------------------------------------------ |
| Shell + 5 remotes                | Zephyr Cloud       | One Zephyr **environment** URL per environment   |
| Gateway (GraphQL)                | Cloud Run, public  | `https://gateway[-staging]-….run.app`            |
| `users-svc`, `workouts-svc`      | Cloud Run, private | Internal only; the gateway looks them up         |
| `users` and `workouts` databases | MongoDB Atlas      | Connection strings, kept in Secret Manager       |
| Pipeline (`.github/workflows/`)  | GitHub Actions     | `staging-*` tag → staging, `v*` tag → production |

Every Zephyr build gets a new per-version URL
(`…-66-shell-workouttracker-…-ze.zephyrcloud.app`). That one changes on every
deploy. The fixed address is the **environment URL** you create in step 7; it
always serves the newest build of that environment.

## Where things stand today

Checked on 2026-11-16:

- **Zephyr:** the account exists, the six apps exist
  (`shell.workouttracker.abnersn` and the remotes), and the `ZEPHYR_CI_TOKEN`
  repository secret is set. No tags or environments yet, so there is no fixed
  URL.
- **GitHub:** no repository variables, and no `staging` or `production`
  environments. The `Verify` workflow is failing on `main`, and `deploy.yml`
  runs it first, so no tag can deploy until the fixes in step 1 are pushed.
- **GCP and Atlas:** nothing set up. The current `deploy.yml` (with the Cloud
  Run job) has never run; earlier tags only deployed the front end.

## The order, and why

1. **Commit the repo fixes** so the pipeline can pass at all.
2. **MongoDB Atlas**, because the services refuse to boot without a database.
3. **GCP**, because the secrets, images and services live there.
4. **GitHub variables**, which point the pipeline at what steps 2 and 3 made.
5. **First staging deploy.** The pipeline itself goes services → gateway →
   front ends, so a new UI never calls an old gateway.
6. **Zephyr tag and environment**, which need a build from step 5 to point at.
   This produces the fixed front-end URL.
7. **CORS**, because the gateway only answers origins it knows, and the origin
   is the URL from step 6.
8. **Production**, repeating 5 to 7 once staging works.

Staging goes first on purpose: every mistake in the setup shows up there.

## Tools to install

| Tool                 | Needed for                   | Status on this machine                                                |
| -------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `git`, Node 22+, npm | Tagging, local checks        | Installed                                                             |
| `gh` (GitHub CLI)    | Variables and environments   | Installed and signed in as `abnersn`                                  |
| `gcloud`             | All GCP setup                | **Missing.** Install: <https://cloud.google.com/sdk/docs/install#rpm> |
| `openssl`            | Generating secrets           | Ships with Fedora                                                     |
| `mongosh`            | Optional: testing Atlas URIs | Optional                                                              |

Docker is not needed for deploying. CI builds the images.

After installing `gcloud`:

```sh
gcloud auth login
```

## Step 1: Commit the repo fixes

Three small changes make the repo deployable. They are in the working tree and
need to reach `main` before any tag is pushed:

- `client/ui/.storybook/main.ts`: the lint error and type error that were
  failing `Verify`.
- `.github/workflows/deploy.yml`: the front-end build now gets
  `ZE_ENV=staging` or `ZE_ENV=production`. Without it, a staging build and
  a production build look the same to Zephyr, and step 6 has nothing to tell
  them apart by.
- `eslint.config.mjs`: ignores `storybook-static`, so a local Storybook
  build no longer breaks `nx lint`.

Check, commit, push, and wait for `Verify` to go green:

```sh
npm run format:check
npx nx run-many -t lint typecheck test

git add -A
git commit -m "Make the repo deployable"
git push
gh run watch
```

## Step 2: MongoDB Atlas

Sign up at <https://www.mongodb.com/cloud/atlas/register> (Google or GitHub
sign-in works). The free M0 tier is enough.

Atlas allows one free cluster per project, so create **two projects**:
`workout-tracker-staging` and `workout-tracker-production`. Do the following in
each.

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

Build the two connection strings per environment. The database name in the
path matters; the services use it as their database.

```text
mongodb+srv://users-svc:<password>@<host>/users?retryWrites=true&w=majority
mongodb+srv://workouts-svc:<password>@<host>/workouts?retryWrites=true&w=majority
```

You now have four strings (two environments × two services). Keep them in a
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
export REPO=abnersn/WorkoutTracker
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

Six secrets, three per environment. The names are fixed by `deploy.yml`.

| Secret                       | Value                                 | Read by       |
| ---------------------------- | ------------------------------------- | ------------- |
| `jwt-secret-<env>`           | Random, 32+ characters                | `wt-gateway`  |
| `users-mongodb-uri-<env>`    | The `users-svc` string from step 2    | `wt-services` |
| `workouts-mongodb-uri-<env>` | The `workouts-svc` string from step 2 | `wt-services` |

`<env>` is `staging` or `production`. Run this block once per environment,
pasting that environment's Atlas strings. `read -s` keeps them out of your
shell history, and `printf '%s'` avoids a trailing newline, which would break
the connection string.

```sh
ENV=staging   # then again with ENV=production

openssl rand -hex 32 | tr -d '\n' |
  gcloud secrets create "jwt-secret-$ENV" --data-file=-

read -rs "USERS_URI?users-svc URI for $ENV: "; echo
printf '%s' "$USERS_URI" |
  gcloud secrets create "users-mongodb-uri-$ENV" --data-file=-

read -rs "WORKOUTS_URI?workouts-svc URI for $ENV: "; echo
printf '%s' "$WORKOUTS_URI" |
  gcloud secrets create "workouts-mongodb-uri-$ENV" --data-file=-

gcloud secrets add-iam-policy-binding "jwt-secret-$ENV" \
  --member="serviceAccount:$GATEWAY_SA" --role=roles/secretmanager.secretAccessor
for s in users workouts; do
  gcloud secrets add-iam-policy-binding "$s-mongodb-uri-$ENV" \
    --member="serviceAccount:$SERVICES_SA" --role=roles/secretmanager.secretAccessor
done

unset USERS_URI WORKOUTS_URI
```

(`read "VAR?prompt"` is zsh syntax. In bash, use `read -rsp "prompt" VAR`.)

Staging and production get different JWT secrets, so a staging token is
worthless against production.

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

## Step 4: GitHub variables and environments

Nothing here is secret, so these are **variables**, not secrets. Same terminal
session as step 3, so the exports are still set.

```sh
gh variable set GCP_PROJECT_ID   --body "$PROJECT_ID"
gh variable set GCP_REGION       --body "$REGION"
gh variable set GCP_WIF_PROVIDER --body "$WIF_PROVIDER"
gh variable set GCP_DEPLOY_SA    --body "$DEPLOY_SA"
gh variable set GCP_GATEWAY_SA   --body "$GATEWAY_SA"
gh variable set GCP_SERVICES_SA  --body "$SERVICES_SA"

gh api -X PUT "repos/$REPO/environments/staging"
gh api -X PUT "repos/$REPO/environments/production"

# Placeholders. The real origins don't exist until step 7.
gh variable set CORS_ORIGINS --env staging    --body "http://localhost:8100"
gh variable set CORS_ORIGINS --env production --body "http://localhost:8100"
```

`CORS_ORIGINS` can't be empty: the gateway refuses to start without at least
one origin.

Where every setting lives, for reference:

| Setting                                              | Kind                | Where                                |
| ---------------------------------------------------- | ------------------- | ------------------------------------ |
| `ZEPHYR_CI_TOKEN`                                    | Secret              | GitHub repository secret (done)      |
| `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`   | Variable            | GitHub repository variables          |
| `GCP_DEPLOY_SA`, `GCP_GATEWAY_SA`, `GCP_SERVICES_SA` | Variable            | GitHub repository variables          |
| `CORS_ORIGINS`                                       | Variable            | GitHub environments, one value each  |
| `jwt-secret-<env>`, `*-mongodb-uri-<env>`            | Secret              | GCP Secret Manager                   |
| `GATEWAY_URL`, gRPC URLs, `APP_ENV`                  | Set by the pipeline | Nowhere; `deploy.yml` works them out |

`ZEPHYR_CI_TOKEN` must stay a _repository_ secret. The `client` job doesn't
run in a GitHub environment, so it can't see environment secrets. If the token
ever needs replacing: Zephyr dashboard → **Settings → Tokens → CI Tokens**,
then `gh secret set ZEPHYR_CI_TOKEN`.

## Step 5: First staging deploy

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

The front end is uploaded but not usable yet: it has no fixed URL (step 6) and
the gateway doesn't accept its origin (step 7).

If the run fails, see [Troubleshooting](#troubleshooting).

## Step 6: Zephyr tag and environment

This is what creates the fixed front-end URL. Only the **shell** needs it. The
shell is the one app the browser opens, and each shell build already pins the
exact remote versions that were deployed alongside it.

Sign in at <https://app.zephyr-cloud.io> with the GitHub account that pushes
the tags (it must be linked under **Git Providers**, which it already is), and
open the `shell` application in the `workouttracker` project.

1. **DevOps → Tags → New Tag.** Name it `staging`. **Add Condition** →
   **Environment** is `staging`. Save. The tag now follows the newest shell
   build made with `ZE_ENV=staging`, which `deploy.yml` sets.
2. **DevOps → Environments** → create an environment named `staging`, based on
   the **tag** `staging` (not on a fixed version).
3. Copy the environment's URL. It looks like
   `https://staging-shell-workouttracker-abnersn-<hash>-ze.zephyrcloud.app`.

Because the environment follows a tag, each later `staging-*` deploy shows up
at the same URL with no further clicks. An environment based on a fixed
version would not update by itself.

## Step 7: Point CORS at the fixed URL

The value is a bare origin: no path, no trailing slash. Staging also keeps
`localhost:8100` so `npm run dev:staging` works.

```sh
STAGING_URL=https://staging-shell-…-ze.zephyrcloud.app   # from step 6

gh variable set CORS_ORIGINS --env staging --body "$STAGING_URL,http://localhost:8100"
```

The gateway reads this when it is deployed, so deploy again:

```sh
git tag staging-1.1.1
git push origin staging-1.1.1
gh run watch
```

Open the staging URL, create an account, build a workout. Staging is done.

## Step 8: Production

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
  Rotating a JWT secret signs everyone out.

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
  each remote (`@*` in `client/shell/package.json`), so two different commits
  deploying side by side could mix remotes.
- **Not verified here:** the Zephyr dashboard labels in step 6 follow the
  current docs (<https://docs.zephyr-cloud.io/features/tags-environments>) and
  may be worded slightly differently on screen. If the dashboard won't create
  an environment for a tag that has no builds yet, that is why step 6 comes
  after step 5.
