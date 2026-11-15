# Workout Tracker

A workout app where you build routines, run them set by set with a rest timer and RPE, and look back at what you did. It's a rebuild of a 2021 single-page app, and the point of the rebuild is the architecture: a **micro-frontend** UI talking to a **backend-for-frontend (BFF)** gateway, with small gRPC services behind it.

**Stack:** Nx monorepo · React 19 · Module Federation (Rspack) on Zephyr Cloud · NestJS GraphQL gateway · NestJS gRPC services · MongoDB Atlas · Cloud Run

## What you get

- Sign up and sign in with email and password.
- Build a workout from exercises and sets, and save it as a template.
- Run a workout live, with a rest timer and an RPE scale per exercise.
- Browse finished workouts in your history.
- Your data is yours: every query is scoped to the signed-in user.

## The big idea

The front end is split into **independent apps** (a shell and five remotes) that are stitched together in the browser at runtime. The browser talks to **one backend**, a GraphQL gateway shaped around what the screens need. The gateway holds no data. It calls two small gRPC services, and each service owns its own database.

So each layer has one job:

| Layer         | Job                                                               |
| ------------- | ----------------------------------------------------------------- |
| Shell         | Layout, routing, the sign-in guard. Loads the remotes.            |
| Remotes       | One screen or feature each, with its own build and deploy target. |
| Gateway (BFF) | One GraphQL endpoint for the UI. Auth, validation, error mapping. |
| Services      | Domain logic and storage (users, workouts). Private, gRPC only.   |

## Architecture

### The system

The browser only ever sees the gateway. The services are private and only accept calls from the gateway's service account.

```mermaid
flowchart LR
  web["<b>Front end</b><br/>shell + 5 remotes<br/><i>Zephyr Cloud</i>"]
  gateway["<b>Gateway</b><br/>NestJS · GraphQL · JWT<br/>no database<br/><i>Cloud Run, public</i>"]
  users["<b>Users service</b><br/>NestJS · gRPC<br/><i>Cloud Run, private</i>"]
  svc["<b>Workouts service</b><br/>NestJS · gRPC<br/><i>Cloud Run, private</i>"]
  usersDb[("<b>users</b><br/><i>Atlas</i>")]
  workoutsDb[("<b>workouts · logs</b><br/><i>Atlas</i>")]

  web -->|GraphQL| gateway
  gateway -->|gRPC| users
  gateway -->|gRPC| svc
  users --> usersDb
  svc --> workoutsDb

  classDef front fill:#dbe7ff,stroke:#2f5fd0,stroke-width:1.5px,color:#0b2263
  classDef back fill:#ffe9cf,stroke:#d9730d,stroke-width:1.5px,color:#4d2600
  classDef data fill:#d6f2de,stroke:#2d8a4e,stroke-width:1.5px,color:#0b3d1e
  class web front
  class gateway,users,svc back
  class usersDb,workoutsDb data
```

**Why a BFF gateway?** The UI asks for exactly the data a screen needs in one round trip, and never learns that two services exist. Passwords, JWTs, rate limits and error translation live in one place. Swapping or splitting a service later doesn't touch the front end.

**Why gRPC between the gateway and services?** A typed contract (`.proto` files, checked with `buf`) that both sides generate code from. Breaking it fails CI rather than production.

**Why a database per service?** `users-svc` and `workouts-svc` each get their own database (`users`, `workouts`) and their own connection string, and neither can read the other's data. Each can change its schema, or move to a different cluster or store, by changing one setting. Locally both databases sit on the same MongoDB container, and nothing in the repo forces them onto separate clusters. The cost is that there are no cross-service joins, so anything that needs both sides is assembled in the gateway.

### The front end

The shell is the only app the browser loads directly. It pulls in each remote at runtime through Module Federation. Remotes never load each other. When two remotes need the same screen, such as `workout-new` and `workout-view` (read-only), they render it from the shared `ui` library.

```mermaid
flowchart TB
  shell["<b>shell</b><br/>layout · routes · sign-in guard"]
  shell --> auth["<b>auth</b><br/>sign up · sign in"]
  shell --> list["<b>workout-list</b><br/>saved workouts"]
  shell --> new["<b>workout-new</b><br/>build and run a workout"]
  shell --> view["<b>workout-view</b><br/>a finished workout"]
  shell --> history["<b>workout-history</b><br/>past workouts"]

  classDef host fill:#b8cdfb,stroke:#1f449e,stroke-width:3px,color:#0b2263
  classDef front fill:#dbe7ff,stroke:#2f5fd0,stroke-width:1.5px,color:#0b2263
  class shell host
  class auth,list,new,view,history front
```

**Why micro-frontends?** Each remote has its own build, dev server and Zephyr deploy target, and most have their own Storybook. A remote can be built, served and deployed without touching the others, and in a bigger team each would belong to a different squad. React, React Router, Apollo Client and the auth state are shared singletons, so the pieces behave like one app. (The current pipeline deploys the shell and every remote together on each tag, which keeps versions in step for a one-person project.)

### Delivery

One pipeline tests every change, then ships each part to where it runs.

```mermaid
flowchart LR
  ci["<b>GitHub Actions</b><br/>verify, then deploy"]
  ci -->|"1. services"| run["<b>Cloud Run</b>"]
  run -->|"2. gateway"| run
  ci -->|"3. front ends"| zephyr["<b>Zephyr Cloud</b>"]

  classDef front fill:#dbe7ff,stroke:#2f5fd0,stroke-width:1.5px,color:#0b2263
  classDef back fill:#ffe9cf,stroke:#d9730d,stroke-width:1.5px,color:#4d2600
  classDef tool fill:#e9edf2,stroke:#5b6b7f,stroke-width:1.5px,color:#1f2a37
  class ci tool
  class zephyr front
  class run back
```

Pushing a `staging-*` tag deploys staging, and a `v*` tag deploys production. The order matters: services first, then the gateway, then the front ends, so a new UI never calls an old gateway.

## Scalability

- **Stateless backends.** Sessions are JWTs and all data lives in MongoDB, so Cloud Run can add or remove instances freely. One caveat: the sign-in rate limiter counts in memory, so its limit applies per gateway instance. A shared store such as Redis would fix that if it ever mattered.
- **Scale each piece alone.** If workouts get hot, scale `workouts-svc` and leave `users-svc` alone. Each service has its own database and connection string, so splitting them onto separate clusters later is a config change.
- **Batched reads.** The gateway uses a DataLoader for each workout's `lastRunAt`. A list of 50 workouts costs one `GetLastRuns` gRPC call (batches of up to 100), not 50.
- **Independently deployable front ends.** Every remote has its own build and Zephyr deploy target, so a team could ship its remote without waiting on the others.
- **Builds that keep up with the repo.** Nx caches task results, and `nx affected` can limit work to what a change touches (CI currently runs everything). Module boundary rules (`scope:client`, `scope:server`, `type:app`, `type:lib`) are lint errors, so the structure doesn't rot.

## Reliability

- **Private services.** On Cloud Run, the services accept only the gateway's service account (`roles/run.invoker`), and the gateway signs each call with a Google ID token.
- **Deadlines on every gRPC call**, so a slow service fails fast instead of hanging the request.
- **Fail at boot, not at 2 a.m.** Every server validates its environment with zod and refuses to start if anything is missing. Staging never falls back to development values.
- **Typed errors end to end.** gRPC errors are mapped to GraphQL errors in one filter. A failed sign-in gives the same error for a wrong email or a wrong password, and unknown emails still run a decoy hash so response times match.
- **Safe auth basics.** Passwords are hashed with argon2, and sign-in and sign-up are limited to 5 attempts a minute per caller. Every workout query is filtered by owner, so asking for someone else's workout returns "not found". (Sign-up does say when an email is taken.)
- **Contracts checked in CI.** `verify.yml` runs format, lint, type-check, unit tests, builds, `buf lint`, and confirms the generated proto and GraphQL code match their sources.
- **Secrets stay out of the repo.** Deployed values live in Secret Manager. CI authenticates to GCP with Workload Identity Federation instead of stored keys.

## Component library

**Browse it live: https://abnersn.github.io/WorkoutTracker/** (rebuilt from `main` on every push).

The shared UI lives in `client/ui`. It holds the building blocks every remote uses, so a button looks and behaves the same on every screen no matter which micro-frontend renders it.

- **Primitives:** `Button`, `Card`, `Badge`, `Dialog`, `Container`, `TextLabel`, `SectionHeading`, `EmptyMessage`, `AddItemForm`, `Skeleton`, plus the `tone` and `motion` helpers.
- **The workout screen:** `Workout` and its exercise, set, stepper and RPE pieces. Both `workout-new` and `workout-view` render it, which is why a remote never needs to load another remote.
- **One theme:** `src/theme.css` is the Tailwind 4 theme that every remote imports.
- **Narrow exports:** a library exposes only what's in its `src/index.ts`. Of the workout screen, only `Workout` is public.

Every component has a story next to it (`button.tsx`, `button.stories.tsx`), and the `a11y` addon checks each one for accessibility problems. Remotes get their own Storybook for the views they own, such as the saved-workout card or the history list. The `workout-new` and `workout-view` stories run against a mock Apollo client from `client/api`, so you can work on those screens without starting the backend.

The published site has one Storybook per project:

| Storybook         | What's in it                             |
| ----------------- | ---------------------------------------- |
| `ui`              | primitives and the shared workout screen |
| `workout-new`     | building and running a workout           |
| `workout-view`    | a finished workout, read-only            |
| `workout-list`    | saved workouts                           |
| `workout-history` | past workouts                            |

To run one locally, use `npx nx storybook ui` (or any project above). `.github/workflows/storybook.yml` builds all five and publishes them to GitHub Pages. It only runs for `main`.

## Run it locally

### What you need

| Requirement         | Version | Why                                                                                |
| ------------------- | ------- | ---------------------------------------------------------------------------------- |
| Node.js             | 22+     | CI and the Docker images use 26                                                    |
| npm                 | 10+     | Ships with Node                                                                    |
| Docker with Compose | recent  | Runs MongoDB as a single-node replica set                                          |
| Free ports          |         | 8100 to 8105 (front ends), 3000 (gateway), 27017 (MongoDB), 50051 and 50052 (gRPC) |

No cloud account is needed to run locally. Zephyr is only switched on for the `deploy` target.

### Steps

```sh
# 1. Install
npm install

# 2. Give the gateway a JWT secret (32+ characters; this file is gitignored)
echo "JWT_SECRET=$(openssl rand -hex 32)" > server/gateway/.env.development.local

# 3. Start MongoDB in Docker, then every app in the workspace
npm run dev
```

Then open **http://localhost:8100**, create an account, and build a workout.

### Handy commands

```sh
npx nx serve shell                 # just the shell on :8100
npx nx serve workout-view          # one remote (also starts the shell)
npx nx storybook ui                # component docs; also works for each remote
npx nx run-many -t lint typecheck test   # what CI runs
npx nx graph                       # see how the projects depend on each other
```

Debuggers listen on 9229 (gateway), 9230 (users-svc) and 9231 (workouts-svc). The VS Code and Zed configs in the repo already point at them.

### Environments

There are three: `development`, `staging` and `production`. The Nx configuration name picks one, and `npm run dev:staging` runs local processes against staging's database. Env files come in layers:

| File                               | Committed | Holds                                                 |
| ---------------------------------- | --------- | ----------------------------------------------------- |
| `.env.<config>` (root)             | yes       | `APP_ENV`                                             |
| `server/<app>/.env.<config>`       | yes       | per-environment values, such as the dev `MONGODB_URI` |
| `server/<app>/.env.serve`          | yes       | local ports, gRPC addresses and `CORS_ORIGINS`        |
| `server/<app>/.env.<config>.local` | no        | secrets: `JWT_SECRET`, a hosted `MONGODB_URI`         |

## Tour of the repo

Two top-level folders, `client/` and `server/`. They never import each other. Anything both sides need, like an input limit, gets its own copy on each side, and the server's copy is the one that's enforced.

```text
client/
  shell/            host app: layout, routes, sign-in guard (:8100)
  auth/             remote: sign up and sign in (:8105)
  workout-list/     remote: saved workouts (:8104)
  workout-new/      remote: build, run and save a workout (:8103)
  workout-view/     remote: a finished workout, read-only (:8101)
  workout-history/  remote: completed workouts (:8102)
  ui/               component library with Storybook, plus the shared Workout screen
  hooks/            useTimer, useNotification, and data hooks that hide GraphQL
  api/              Apollo Client, generated GraphQL types, mountApp
  auth-state/       token storage and AuthProvider, shared by every remote
  reducer/          the workout state machine
  types/            Workout, Exercise, Set, WorkoutLog
  utils/            time and date formatting, small helpers

server/
  gateway/          GraphQL BFF: auth, guards, DataLoaders, error mapping
  users-svc/        users collection, argon2 hashing, gRPC
  workouts-svc/     workouts and logs, gRPC
  proto/            .proto contracts, buf config, generated code
  helpers/          env validation, error helpers shared by the servers

tools/
  docker/           one Dockerfile that runs any of the three servers
  nx/               a local Nx plugin that adds a typecheck target
.github/workflows/  verify.yml (every PR) and deploy.yml (tags)
```

Good places to start poking around:

- `client/shell/rspack.config.ts` and `client/shell/src/mf.ts` for how remotes are wired in.
- `client/reducer/src/lib/reducer.ts` for the workout state machine.
- `server/proto/protos/` for the contracts between the gateway and services.
- `server/gateway/src/workouts/` for a resolver, a gRPC client and a DataLoader side by side.
- `.github/workflows/deploy.yml` for the tier-by-tier deploy.

Libraries are imported as `@workout-tracker/<name>`. Remotes are never imported, only loaded by the shell at runtime.

## Deploying your own copy

You'll need a GCP project, a MongoDB Atlas cluster and a Zephyr Cloud account. One-time setup for `deploy.yml`:

- An Artifact Registry Docker repository named `workout-tracker` in `GCP_REGION`.
- Three service accounts: a deployer (Cloud Run Admin, Artifact Registry Writer, and Service Account User on the other two), the gateway's runtime account, and the services' runtime account. Both runtime accounts need Secret Manager Secret Accessor.
- Secret Manager secrets per environment (`staging`, `production`): `jwt-secret-<env>`, `users-mongodb-uri-<env>` and `workouts-mongodb-uri-<env>`.
- Repository variables: `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`, `GCP_GATEWAY_SA`, `GCP_SERVICES_SA`.
- GitHub environments `staging` and `production`, each with a `CORS_ORIGINS` variable listing that environment's Zephyr URL (plus `http://localhost:8100` for staging).
- A `ZEPHYR_CI_TOKEN` repository secret.

The front-end job builds the shell with `GATEWAY_URL` set to the gateway it just deployed, and the shell's `deploy` target refuses to build without it.

## Limits and what's next

- Tests are unit tests today. End-to-end tests (gateway against an in-memory MongoDB, Playwright for the UI) are still on the list.
- A "train together" mode (QR pairing and a shared live screen over GraphQL subscriptions) is designed but not built.
- Left out on purpose: offline support, data import, GitHub sign-in, email verification, password reset and refresh tokens.
- English only, no i18n.

## License

MIT
