# Changelog

All notable changes to this repo. Each package also carries its own
version in `package.json` and in `STATE.md`; this file is the human-
readable narrative across all of them.

## 1.1.0 — 2026-08-04

Adopted GitHub Spec Kit's Spec-Driven Development conventions on top of
the v1.0.0 packages. No package code changed — this is governance and
process, not a functional release.

- **Added** `.specify/memory/constitution.md` — nine articles, adapted
  for a design-system domain, supreme over `AGENTS.md`/`CONTRIBUTING.md`.
- **Added** `.specify/templates/{spec,plan,tasks,checklist}-template.md`
  for all future feature work.
- **Added** `specs/001-design-system-foundation/` — v1 retrofitted into
  spec/plan/tasks/checklist form, serving as both historical record and
  worked example.
- **Added** `decisions/0006-adopting-spec-driven-development.md`,
  documenting the adoption and its honest adaptations (no CLI access;
  nine articles translated for a CSS/token domain rather than a backend).
- **Updated** `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `STATE.md` to
  reference and defer to the constitution.

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
