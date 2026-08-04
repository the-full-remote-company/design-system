# Architecture

See `decisions/0001-three-layer-architecture.md` for the full reasoning and
the comparison table this summarizes. This file is the durable reference;
the ADR is the record of how we got here.

## The shape

```
                    ┌─────────────────────────┐
                    │   @tfrc/foundation      │
                    │                         │
                    │  token contract         │
                    │  color ramps            │
                    │  spacing base (4px)     │
                    │  reset + a11y floor     │
                    └───────────┬─────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
       ┌─────────▼─────────┐        ┌──────────▼──────────┐
       │   @tfrc/web       │        │   @tfrc/app         │
       │  corporate site   │        │  product UI kit     │
       │  expressive       │        │  restrained          │
       │  desktop-first    │        │  mobile-first        │
       │  ~14 components   │        │  ~40 components      │
       └───────────────────┘        └──────────┬───────────┘
                                                │
                                     ┌──────────▼──────────┐
                                     │  themes/finance.css │
                                     │  (more to follow)   │
                                     └──────────────────────┘
```

**One product system, not one per product.** Finance is a *theme* over
`@tfrc/app`, not its own system. A future real-estate product themes over
the same layer. This is the whole point of the architecture — without it,
every product rebuilds a transaction list, a date picker, and a currency
input from scratch.

## What's shared, roughly

| Layer | Shared between web and app |
|---|---|
| Token names | 100% |
| Token values | ~30% |
| Color ramps | 100% |
| Semantic color mapping | ~60% |
| Spacing base unit | 100% |
| Type scale | ~20% |
| Icon set | 100% (not yet built — see `STATE.md`) |
| Accessibility floor | 100%, app layer stricter (44px touch minimum) |
| Layout components (hero, CTA band) | 0% — web only |
| Data components (transaction row, tab bar) | 0% — app only |

If a future change pushes shared code past roughly half, treat that as a
signal the product layer has been compromised to resemble the marketing
site, not as progress toward unification.

## Governance

The mechanism that keeps this from rotting is in `AGENTS.md`, enforced in
part by `scripts/lint-boundaries.js` and `scripts/check-contract.js`. Read
that file before making structural changes.
