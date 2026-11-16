# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a lifter logging sets mid-workout, typically on a phone in the gym, glancing at the screen between sets. They also build and edit workout templates ahead of time at lower urgency. Secondary audience (confirmed as context, not the design target): portfolio reviewers evaluating the project's engineering.

## Product Purpose

Workout Tracker lets a signed-in user build workouts (exercises and sets), run them set by set with a rest timer and RPE, and review completed workouts in history. It is a portfolio rebuild of a 2021 SPA; success is a real, usable gym tool backed by a clean, deployed architecture.

## Positioning

Undecided as a product claim. The user named the architecture as the differentiator (Nx monorepo, Module Federation front ends on Zephyr, NestJS GraphQL gateway, gRPC services, MongoDB). The optional "train together" bonus (QR pairing, shared live screen) is planned but not confirmed as the headline.

## Operating Context

- Nx monorepo: `client/` (React, shell host plus remotes: auth, workouts, history, pairing, train-together) and `server/` (gateway, users-svc, workouts-svc), each split into `apps/` and `libs/`.
- Component library in `client/libs/ui` documented in Storybook; styling via Tailwind 4 theme at `client/libs/ui/src/theme.css`.
- Data starts in IndexedDB (Day 1) and moves to GraphQL/Atlas behind a `WorkoutRepository` interface.
- Auth is email + password with JWT; no roles, every query scoped to its owner.

## Capabilities and Constraints

- English only, no i18n.
- Planned UI components: Button, Input, Card, Dialog, Badge, ExerciseCard, SetRow, RestTimer, RpeScale, PartnerProgress.
- Domain terms: Workout, Exercise, Set, WorkoutLog, set stages, RPE.
- Out of scope unless time remains: PWA offline, data import, GitHub sign-in, email verification, password reset, refresh tokens.
- Source of truth for scope: `README.md`.

## Brand Commitments

None. No existing name styling, logo, or voice commitments.

## Evidence on Hand

The 2021 SPA is the incumbent being ported (components: Container, Button, DecoratedBlock, RPEScale, SetDisplay). No testimonials, user metrics, or brand assets exist; do not fabricate them.

## Product Principles

- Designed for use mid-set: glanceable, one-handed, forgiving of sweaty, hurried input.
- Logging speed beats configurability while a workout is running.
- Building and reviewing workouts can be denser and calmer than running them.
- The interface should be credible as a shipped product, not a demo shell.

## Accessibility & Inclusion

Target WCAG AA; the Storybook a11y addon is planned for the component library.
