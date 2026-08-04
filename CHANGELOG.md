# Changelog

All notable changes to this repo. Each package also carries its own
version in `package.json` and in `STATE.md`; this file is the human-
readable narrative across all of them.

## 1.0.0 — 2026-08-04

Initial release.

- **Added** `@tfrc/foundation` 1.0.0 — color ramps (Meridian, active),
  three documented alternates (Lilac, Meadow, Daylight — see
  `decisions/0003.md`), 4px spacing scale, reset, token contract.
- **Added** `@tfrc/web` 1.0.0 — corporate layer. Button, card, stat strip,
  CTA band. Desktop-first, expressive scale.
- **Added** `@tfrc/app` 1.0.0 — product layer. Button, field, pill, amount,
  transaction row, balance card, segmented control, tab bar. Mobile-first,
  44px touch floor, reserved gain/loss tokens.
- **Added** `packages/app/src/themes/finance.css` — the first product
  theme, themed over `@tfrc/app` rather than forked from it.
- **Added** governance: `AGENTS.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`,
  `STATE.md`, five ADRs in `decisions/`.
- **Added** `scripts/lint-boundaries.js` and `scripts/check-contract.js` —
  dependency-free, run and passing as of this release.
- **Fixed** (pre-tag) a false positive in `lint-boundaries.js`: the script
  originally flagged any *mention* of `--color-gain` / `--color-loss`,
  including in explanatory comments. Narrowed to match only definitions
  and `var()` usages before the first release, so comments can keep
  explaining the rule without tripping it.

### Known gaps, deliberately deferred to v1.1
See `STATE.md`'s `known_gaps_for_v1.1` block — icon set, a live docs app
wired to these packages, real build tooling, automated contrast checking,
and a real-estate theme are all out of scope for this release, not
forgotten.
