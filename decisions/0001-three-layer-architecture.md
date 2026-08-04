# ADR 0001: Three-layer architecture — foundation, web, app

**Status:** Accepted
**Date:** 2026-08-04

## Context

The company runs a corporate site (thefullremotecompany.com) and will ship
multiple products across finance, real estate, and adjacent categories. A
single design system stretched to cover both would compromise one to serve
the other — a button sized right for a marketing hero (56px, generous
motion) is wrong in a transaction list rendered 200 times down a scroll
(44px, instant). Conversely, N separate product systems (one per app) would
mean rebuilding a transaction list, a date picker, and a currency input for
every product — a cost a portfolio company can't absorb.

## Decision

Build one shared foundation and two expressions over it:

- `@tfrc/foundation` — token contract, color ramps, spacing base, reset.
  Nothing user-facing ships from this package directly.
- `@tfrc/web` — the corporate layer. Persuades a stranger once. Desktop-
  first, expressive, generous motion.
- `@tfrc/app` — the product layer. Serves a returning user for years.
  Mobile-first, restrained, near-zero novelty tolerance. **Products theme
  over this layer; they do not fork it.**

Token *names* are identical across web and app (the API). Token *values*
diverge freely and mostly do (~30% shared) — that divergence is the
mechanism that lets one visual language serve two jobs with different
physics without compromising either.

## Consequences

- An engineer moving between the corporate repo and a product repo writes
  the same component markup and gets a different, correct result in each.
- Adding a second and third product (real estate, etc.) costs a theme file,
  not a new system.
- The corporate site cannot borrow a product component wholesale (a
  transaction row has no meaning on a marketing page) and shouldn't try.
- This forecloses "just quickly reuse the app's button style on the
  homepage" as a legitimate shortcut — see rule 3 in `AGENTS.md`. That
  friction is intentional.
- Governance overhead is real: every structural change now needs to
  respect a boundary that a single monolithic system wouldn't have. We
  accept this cost because the alternative (one system, quietly
  compromised) is worse and harder to detect until it's expensive to fix.

## Alternatives considered

- **One unified system.** Rejected — a component that serves both jobs
  ends up with nine props and no opinion, which is the observable symptom
  of this going wrong (see the corporate-vs-app comparison table in
  `ARCHITECTURE.md`).
- **A separate system per product.** Rejected — makes the *first* product
  faster to ship and every subsequent one slower, which is the wrong
  trade for a company whose stated plan is multiple products.
- **Foundation owns semantic tokens too, not just ramps.** Considered and
  rejected in favor of each package defining its own semantic layer against
  shared ramps — see `decisions/0004-token-contract-not-shared-values.md`.
