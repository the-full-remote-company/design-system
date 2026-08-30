# Architecture

See `decisions/0001-three-layer-architecture.md` for the full reasoning and
the comparison table this summarizes. This file is the durable reference;
the ADR is the record of how we got here.

## Read this first: these are two dialects, not two projects

`@tfrc/marketing` and `@tfrc/product` are **two expressions of one visual
language**. They are not "the website" and "the app".

This needs saying explicitly because the previous names — `@tfrc/web` and
`@tfrc/app` — were twice read as naming two *projects*, which is a
reasonable reading of those words and the reason they were renamed
(`decisions/0008.md`). The distinction they encode is one of *communicative
intent*, not delivery platform:

- **`@tfrc/marketing`** persuades a stranger, once. Desktop-first,
  expressive, generous motion, 56px buttons.
- **`@tfrc/product`** serves a returning user, for years. Mobile-first,
  restrained, near-zero novelty tolerance, 44px touch floor.

The corporate site is an "app" in every ordinary sense; the finance product
is delivered on the "web". Both old names described the wrong axis.

**Neither package is a product.** Products — the corporate website, the
personal finance app — live in their own repositories and install these as
published, versioned dependencies (`decisions/0007.md`). Nothing in
`packages/` is a thing a customer opens.

## The shape

```
                    ┌─────────────────────────┐
                    │    @tfrc/foundation     │
                    │                         │
                    │  token contract         │
                    │  color ramps            │
                    │  spacing base (4px)     │
                    │  reset + a11y floor     │
                    │  bin/tfrc-verify        │
                    └───────────┬─────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
       ┌─────────▼──────────┐       ┌──────────▼──────────┐
       │  @tfrc/marketing   │       │   @tfrc/product     │
       │  persuade once     │       │  serve for years    │
       │  expressive        │       │  restrained         │
       │  desktop-first     │       │  mobile-first       │
        │  ~14 components    │       │  ~23 components     │
       └─────────┬──────────┘       └──────────┬──────────┘
                 │                             │
                 │                  ┌──────────▼──────────┐
                 │                  │  themes/finance.css │
                 │                  │  (more to follow)   │
                 │                  └──────────┬──────────┘
                 │                             │
   ═══════════ registry boundary ══════════════════════════════
                 │                             │
       ┌─────────▼──────────┐       ┌──────────▼──────────┐
       │  website repo      │       │  finance app repo   │
       │  (separate)        │       │  (separate)         │
       └────────────────────┘       └─────────────────────┘
```

Everything below the registry boundary is somebody else's repository. That
line is what makes Article VI a dependency-graph fact rather than a
filesystem convention: a repo that installs `@tfrc/product` has no path by
which to reach `@tfrc/marketing`.

**One product system, not one per product.** Finance is a *theme* over
`@tfrc/product`, not its own system. A future real-estate product themes
over the same layer. This is the whole point of the architecture — without
it, every product rebuilds a transaction list, a date picker, and a currency
input from scratch. A new product line is a theme file, never a fourth
package (Article VII).

## What's shared, roughly

| Layer | Shared between marketing and product |
|---|---|
| Token names | 100% |
| Token values | ~30% |
| Color ramps | 100% |
| Semantic color mapping | ~60% |
| Spacing base unit | 100% |
| Type scale | ~20% |
| Icon set | 100% (not yet built — see `STATE.md`) |
| Accessibility floor | 100%, product layer stricter (44px touch minimum) |
| Layout components (hero, CTA band) | 0% — marketing only |
| Data components (transaction row, tab bar) | 0% — product only |

If a future change pushes shared code past roughly half, treat that as a
signal the product layer has been compromised to resemble the marketing
site, not as progress toward unification.

## Native clients: honestly unsolved

The finance product is intended to gain a native client eventually. There
is **no path for it today**, and nothing here is built in anticipation of
one: `@tfrc/product` ships CSS, and a native runtime cannot consume CSS.

Extracting tokens to a platform-neutral source (JSON, Style Dictionary) now
would mean guessing twice — the runtime is unchosen and the product does
not exist — and would introduce exactly the token-abstraction layer
Article VIII forbids. When a native client actually starts, it gets its own
spec and, if it needs a neutral token source, its own ADR amending
Article VIII. See `decisions/0007.md`.

## Governance

Three dependency-free scripts, all run in CI:

| Script | Enforces | Runs where |
|---|---|---|
| `scripts/check-contract.js` | every dialect defines every contract token | this repo |
| `scripts/lint-boundaries.js` | the two dialects never import each other | this repo |
| `packages/foundation/bin/tfrc-verify.js` | one dialect, pinned version, no raw values, reserved colors respected | **a consumer's repo**, via `npx tfrc-verify` |

The third exists because the first two cannot see a consumer's source, and
Article II requires that a mechanically-checkable rule actually be checked
somewhere. `scripts/test-verify-consumer.js` proves it fails when it should.

The rules these enforce are in `AGENTS.md` (for maintainers) and
`CONSUMING.md` (for consumers). Read `AGENTS.md` before making structural
changes.
