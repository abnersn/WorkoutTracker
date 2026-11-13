# Workout Tracker: 3-Day Build Plan

A portfolio rebuild of the 2021 WorkoutTracker SPA: an Nx monorepo with Module Federation front ends on Zephyr, a NestJS GraphQL gateway, two NestJS gRPC services, and MongoDB.

**Auth:** email + password. The users service stores and checks passwords; the gateway issues a JWT. No roles: every query is scoped to its owner.

**Language:** English only, no i18n.

## Architecture

### The system

The browser talks only to the gateway, which keeps no data of its own. It calls the users and workouts services over gRPC, and each service owns its own database on one Atlas cluster.

```mermaid
flowchart LR
  web["<b>Front end</b><br/>shell + 5 remotes<br/><i>Zephyr Cloud</i>"]
  gateway["<b>Gateway</b><br/>NestJS · GraphQL · JWT<br/>no database<br/><i>Cloud Run, public</i>"]
  users["<b>Users service</b><br/>NestJS · gRPC<br/><i>Cloud Run, private</i>"]
  svc["<b>Workouts service</b><br/>NestJS · gRPC<br/><i>Cloud Run, private</i>"]
  usersDb[("<b>users</b><br/><i>Atlas</i>")]
  workoutsDb[("<b>workouts · logs<br/>sessions</b><br/><i>Atlas</i>")]

  web -->|"GraphQL + WebSocket"| gateway
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

### The front end

The shell is the only app the browser loads directly; it pulls in each remote at runtime. Dashed borders mark the train-together bonus.

```mermaid
flowchart TB
  shell["<b>shell</b><br/>layout · routes · sign-in guard"]
  shell --> auth["<b>auth</b><br/>sign up · sign in"]
  shell --> workouts["<b>workouts</b><br/>build and run workouts"]
  shell --> history["<b>history</b><br/>past workouts"]
  shell --> pairing["<b>pairing</b><br/>QR code links two people"]
  shell --> together["<b>train-together</b><br/>shared live screen"]

  classDef host fill:#b8cdfb,stroke:#1f449e,stroke-width:3px,color:#0b2263
  classDef front fill:#dbe7ff,stroke:#2f5fd0,stroke-width:1.5px,color:#0b2263
  classDef bonus fill:#dbe7ff,stroke:#2f5fd0,stroke-width:1.5px,stroke-dasharray:6 4,color:#0b2263
  class shell host
  class auth,workouts,history front
  class pairing,together bonus
```

### Delivery

One pipeline tests every change, then ships each part to where it runs.

```mermaid
flowchart LR
  ci["<b>GitHub Actions</b><br/>test, then deploy"]
  ci -->|front ends| zephyr["<b>Zephyr Cloud</b>"]
  ci -->|"gateway + 2 services"| run["<b>Cloud Run</b>"]
  ci -->|Storybook| pages["<b>GitHub Pages</b>"]

  classDef front fill:#dbe7ff,stroke:#2f5fd0,stroke-width:1.5px,color:#0b2263
  classDef back fill:#ffe9cf,stroke:#d9730d,stroke-width:1.5px,color:#4d2600
  classDef tool fill:#e9edf2,stroke:#5b6b7f,stroke-width:1.5px,color:#1f2a37
  class ci tool
  class zephyr,pages front
  class run back
```

## Workspace

> [!NOTE] Boundary rules
> - Two top-level folders, `client/` and `server/`. They never import each other, and nothing is shared between them.
> - A library lives on the side that imports it. A value both sides need, such as an input limit, goes in that side's own `limits` library; the server's copy is the one enforced.
> - Every project is tagged `scope:client` or `scope:server` (matching its folder) and `type:app` or `type:lib`. `@nx/enforce-module-boundaries` turns the rules into lint errors.

### Projects

Each line reads: folder (kind): what it holds. Projects with end-to-end tests say so.

- `client/`: React front end
	- `shell/` (host): layout, routes and the sign-in guard; loads every remote. *Unit and e2e tests.*
	- `auth/` (remote): sign-up and sign-in screens
	- `workouts/` (remote): workout list, editor and solo training
	- `history/` (remote): completed workouts
	- `pairing/` (remote): shows your QR code and scans a partner's to link two trainings
	- `train-together/` (remote): the shared training screen, with each exercise as it's completed
	- `ui/` (lib): component library, documented in Storybook
		- `src/primitives/`: Button, Input, Card, Dialog, Badge
		- `src/workout/`: ExerciseCard, SetRow, RestTimer, RpeScale, PartnerProgress
		- `src/theme.css`: the Tailwind theme every remote imports
	- `hooks/` (lib): `useTimer`, `useNotification`
	- `auth-state/` (lib): token storage, `AuthProvider`, `useAuth`; loaded once and shared by every remote
	- `api/` (lib): Apollo Client, the auth link and generated GraphQL hooks
	- `workout-repository/` (lib): `WorkoutRepository`, with IndexedDB and GraphQL adapters
	- `types/` (lib): `Workout`, `Exercise`, `Set`, `WorkoutLog`, `ExerciseType`
	- `reducer/` (lib): the workout state machine: actions and set stages
	- `utils/` (lib): `formatDuration`, `totalVolume`, `restRemaining`
	- `limits/` (lib, project `client-limits`): form hints for sets, reps and weights
- `server/`: NestJS back end
	- `gateway/` (app): GraphQL, JWT, guards and DataLoaders; no database. *Unit and e2e tests.*
		- `src/`: one folder per feature: `auth/`, `users/`, `workouts/`, `sessions/`, `graphql/`
	- `users-svc/` (app): the `users` collection and argon2 hashing; gRPC `CreateUser`, `VerifyCredentials`, `GetUsers`. *Unit and e2e tests.*
	- `workouts-svc/` (app): workouts, logs and train-together sessions, with change streams. *Unit and e2e tests.*
	- `proto/` (lib): the `.proto` files (`workouts`, `sessions`, `users`), buf config, generated code and loader options
	- `limits/` (lib, project `server-limits`): the input limits the server enforces
- `tools/`: Docker and deploy scripts
- `nx.json`, `package.json`, `tsconfig.base.json`

### Inside a project

- `<project>/`
	- `src/`: the code. A library exports only `src/index.ts`.
	- `tests/`: `*.spec.ts` files, mirroring `src/`
		- `unit/` and `e2e/`: used instead, when the project has both kinds
	- `stories/` and `.storybook/`: `ui` only. Stories mirror `src/`.

### Conventions

- File names in kebab-case.
- Nest code: one feature module per folder, such as `users/users.module.ts`, `users.service.ts`, `users.resolver.ts`.
- Remotes: `src/screens/` and `src/components/`. A component used by more than one remote moves to `ui`.
- Libraries are imported through `@workout-tracker/<name>`. Nx project names must be unique, so the two `limits` folders are the projects `client-limits` and `server-limits`. Remotes are never imported, only loaded by the shell.
- Generators run with `--e2eTestRunner=none`. Each project's test config points at `tests/`, and projects with e2e tests get a separate `e2e` target with its config in `tests/e2e/`.

## Day 1: The Front End on Nx (Still IndexedDB)

- [ ] **Workspace**
	- [ ] Create it with `create-nx-workspace`, pinned to Node 24
	- [ ] Add the plugins: `@nx/react`, `@nx/nest`, `@nx/js`, `@nx/module-federation`, `@nx/storybook`
	- [ ] Connect Nx Cloud (Hobby plan) for remote caching
	- [ ] Add the tags and the boundary rule
- [ ] **`client/types`**, **`client/reducer`**, **`client/utils`**, **`client/limits`**
	- [ ] Port the types, the reducer and its actions, and the time utilities, with tests in `tests/`
	- [ ] Stop saving runtime fields (`stage`, `activeSetId`) in workout templates
	- [ ] Remove `serializeWorkout`'s DOM reads by moving `SetDisplay`'s reps and weight into reducer state
- [ ] **`client/ui`** with Storybook
	- [ ] Port Container, Button, DecoratedBlock, RPEScale and SetDisplay to Tailwind 4, with a story each in `stories/`
	- [ ] Load `theme.css` in `.storybook/preview.ts`, and add `@storybook/addon-a11y`
- [ ] **`client/hooks`**: `useTimer`, `useNotification`
- [ ] **`client/workout-repository`**: the `WorkoutRepository` interface and its IndexedDB adapter
- [ ] **Module Federation**
	- [ ] `shell` host, plus the `workouts` and `history` remotes (Rspack)
	- [ ] React 19 and React Router 7
	- [ ] Share react, react-router, `@apollo/client` and `auth-state` as singletons
- [ ] Fix the old issues:
	- [ ] Switch to `createRoot`
	- [ ] Stop passing an async function to `useEffect`
	- [ ] Correct the `tabuler-nums` typo
- [ ] **Zephyr**: add `withZephyr()` to each Rspack config and deploy

**Done when:** the app runs from its Zephyr URL, still storing data in IndexedDB, and `nx storybook ui` shows every component.

## Day 2: Back End, Sign-In and Deploy

- [ ] **`server/proto`**
	- [ ] `workouts.proto` and `users.proto` (packages `workouts.v1` and `users.v1`)
	- [ ] `buf.yaml` and `buf.gen.yaml` with the ts-proto options `nestJs=true`, `addGrpcMetadata=true`, `stringEnums=true` and `useDate=false`
	- [ ] A cached `codegen` target, with `dependsOn: ["^codegen"]` in the projects that use it
	- [ ] One set of proto-loader options shared by every server and client
- [ ] **`server/limits`**
- [ ] **`server/users-svc`**
	- [ ] Nest gRPC microservice with its own database
	- [ ] `users` collection with a unique, lowercased email
	- [ ] `CreateUser` and `VerifyCredentials` with argon2id; one error for any failed check
	- [ ] `GetUsers`, a batch lookup by ID
	- [ ] Unit tests in `tests/unit/`, e2e tests over gRPC in `tests/e2e/`
- [ ] **`server/workouts-svc`**
	- [ ] Nest gRPC microservice with its own database
	- [ ] Mongoose schemas typed from the generated code, plus a `toProto` mapper
	- [ ] Every query filtered by `ownerId`, returning NOT_FOUND for other users' data
	- [ ] Create, read, update and delete for workouts, plus logs
	- [ ] `GetLastRuns` aggregation
	- [ ] Unit and e2e tests
- [ ] **`server/gateway`**
	- [ ] Configuration validated with zod; no database connection
	- [ ] `signUp` and `signIn` call users-svc, then issue a 7-day JWT; `me` reads it
	- [ ] Global guard, `@Public()`, `@CurrentUser()`
	- [ ] Rate limiting with `@nestjs/throttler`
	- [ ] Code-first GraphQL types, resolvers and `toGql` mappers
	- [ ] DataLoader for `lastRunAt`
	- [ ] Map gRPC errors to GraphQL errors
	- [ ] Unit and e2e tests
- [ ] **Front end**
	- [ ] `client/api`: Apollo Client, the auth link and generated hooks
	- [ ] `client/auth-state`: `AuthProvider` and `useAuth`
	- [ ] `auth` remote: sign-up and sign-in screens
	- [ ] Shell redirects signed-out users to sign-in
	- [ ] GraphQL adapter for `WorkoutRepository`
- [ ] **Local setup**: Docker Compose running MongoDB as a single-node replica set
- [ ] **Deploy**
	- [ ] MongoDB Atlas free cluster, one database per service
	- [ ] Secrets in Secret Manager
	- [ ] Dockerfiles
	- [ ] `gateway` on Cloud Run, public
	- [ ] `users-svc` and `workouts-svc` on Cloud Run with `--use-http2`, private
	- [ ] `roles/run.invoker` for the gateway, and a Google ID token on each of its gRPC calls
	- [ ] CORS restricted to the Zephyr origin

**Done when:** you can sign up on the deployed app and your workouts persist in Atlas.

## Day 3 Morning: Quality

- [ ] **Tests**
	- [ ] Gateway e2e against `MongoMemoryReplSet`: sign up, create and list workouts, and confirm a second user can't see them
	- [ ] Shell e2e with Playwright: sign up, build a workout, run it
- [ ] **CI on pull requests**: `nx affected -t lint test e2e build`, plus `buf lint`, `buf breaking` and a check that generated code is up to date
- [ ] **CI on main**
	- [ ] Deploy tier by tier (services, then gateway, then front ends), using Workload Identity Federation instead of stored keys
	- [ ] Publish Storybook to GitHub Pages
- [ ] **README**: these diagrams, how to run locally, and the tradeoffs chosen

## Day 3 Afternoon: Train Together (Bonus)

- [ ] **`sessions.proto`**: `StartSession`, `JoinSession`, `ReportProgress`, and `WatchSession` as a server stream
- [ ] **Session schema**: join code, participants, and `expiresAt` with a TTL index
- [ ] **workouts-svc**: change stream → Observable that sends the current snapshot first and closes the stream when the client disconnects
- [ ] **Gateway**
	- [ ] `sessionUpdated` subscription bridged from the gRPC stream, authenticated through graphql-ws `connectionParams`
	- [ ] Partner display names from users-svc's `GetUsers`, batched with a DataLoader
- [ ] **`pairing` remote**: show a QR code with the join link (`qrcode`), scan a partner's with the camera (`@zxing/browser`)
- [ ] **`train-together` remote**: each completed exercise for both partners, and a shared rest timer based on `resting_until`
- [ ] **Shell e2e**: two Playwright browser contexts pair and train together
- [ ] Deploy, then demo with two accounts on two devices

## Cut (Unless Time Is Left Over)

- PWA offline support
- Data import
- GitHub sign-in
- Email verification, password reset and refresh tokens
