# ADR 0004: Foundation ships ramps and a contract, not shared semantic values

**Status:** Accepted
**Date:** 2026-08-04

## Context

Some semantic tokens (e.g. `--color-accent`, `--color-focus`) happen to
resolve to the same value in both `@tfrc/web` and `@tfrc/app` today — the
architecture table estimates ~60% overlap. It would be tempting to define
those tokens once in `@tfrc/foundation` and have both packages inherit the
values directly, saving duplication.

## Decision

`@tfrc/foundation` exports only: raw color ramps (`--ramp-neutral-*`,
`--ramp-brand-*`, `--ramp-support-*`), the reserved gain/loss raw values,
the 4px spacing scale, shared easing curve *shapes* (not durations), and a
reset. It does **not** export semantic tokens like `--color-accent` or
`--color-surface`. Each of `@tfrc/web` and `@tfrc/app` defines its own
complete semantic layer in its own `tokens.css`, referencing the shared
ramps, even where the resulting value is identical to the other package's.

The **contract** — the list of semantic token names every package's
`tokens.css` must define — lives in `packages/foundation/CONTRACT.md` as
documentation and is checked by `scripts/check-contract.js`, but the
values themselves are never centrally owned.

## Consequences

- A small amount of literal duplication exists today (a handful of
  identical `oklch()` values copy-pasted into two `tokens.css` files).
- In exchange: each package's token file is fully self-contained and
  readable without cross-referencing another package, and a change to one
  package's semantic mapping can never silently ripple into the other by
  accident. Given rule 3 in `AGENTS.md` (web and app never import from each
  other), this consistency between "how tokens are defined" and "how
  imports work" was judged worth the duplication.
- If the overlap between web's and app's semantic values grows over time,
  that's a signal worth watching, not an automatic trigger to centralize —
  see `AGENTS.md` rule 4. Centralize a *value* only once it's clear it's
  not a coincidence.

## Alternatives considered

- **Foundation owns shared semantic tokens directly.** Rejected — this
  quietly reintroduces a soft coupling between web and app precisely where
  ADR 0001 wanted a hard boundary, and makes each package's token file
  unreadable in isolation (a value would live in a different package's
  file, for no reason discoverable from the file itself).
