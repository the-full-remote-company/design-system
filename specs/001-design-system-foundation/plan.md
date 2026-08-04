# Implementation Plan: Design System Foundation

**Input:** `specs/001-design-system-foundation/spec.md`
**Prerequisite:** N/A for this retrofit — see the note in spec.md.

## Technical Context

- **Package(s) touched:** all three — this is the founding plan that
  created `@tfrc/foundation`, `@tfrc/web`, and `@tfrc/app`.
- **New tokens required:** the entire semantic contract (see
  `packages/foundation/CONTRACT.md`) and the Meridian raw ramps.
- **New reserved-hue considerations:** established the reserved bands
  themselves — `--color-gain` (hue ~150) and `--color-loss` (hue ~25) —
  per `decisions/0002.md`.

## Constitution Check *(Phase -1)*

*(Note: the constitution itself was ratified alongside this retrofit,
after v1 shipped — see `decisions/0006.md`. These boxes are checked
against what v1 actually built, confirming it happens to satisfy the
constitution that was later written to describe it, not the reverse.)*

#### Simplicity Gate (Article VII)
- [x] Stays within 3 top-level packages — exactly 3: foundation, web, app
- [x] No speculative tokens added ahead of need — Lilac/Meadow/Daylight
      exist as designed alternates (see `decisions/0003.md`) but are not
      wired into any shipped package, so they cost nothing at runtime

#### Anti-Abstraction Gate (Article VIII)
- [x] Uses Tailwind v4 `@theme` / native custom properties directly, no
      abstraction framework on top
- [x] One semantic token per concept — enforced by
      `packages/foundation/CONTRACT.md`

#### Contract Gate (Article III / IV)
- [x] `scripts/check-contract.js` passes against both packages' `tokens.css`
- [x] No raw color literals in `components.css` in either package

#### Boundary Gate (Article VI)
- [x] `scripts/lint-boundaries.js` passes — confirmed clean after fixing
      a false positive (see `CHANGELOG.md`'s "Fixed" entry) before tagging

#### Reserved Hue Gate (Article V)
- [x] `@tfrc/web`'s `tokens.css` does not define or reference
      `--color-gain` / `--color-loss` — mechanically checked
- [x] Product hues (capital, estate, lending, insight, legal, market) all
      checked against the reserved bands per `decisions/0005.md`

## Project Structure

```
packages/foundation/   ← ramps, contract, reset, spacing
packages/web/           ← corporate layer
packages/app/            ← product layer + themes/finance.css
```

**Structure Decision:** three packages under `packages/`, per Article VII.

## Complexity Tracking

None — all gates passed as designed; no justified exceptions needed for v1.

## Phase 0 — Research

Palette research (Lilac, Meadow, Meridian comparison) happened
conversationally before this plan existed; the outcome is recorded in
`decisions/0003.md` rather than re-derived here.

## Phase 1 — Design Artifacts

- **Token additions:** the full contract in
  `packages/foundation/CONTRACT.md`, satisfied by both `tokens.css` files.
- **Component contracts:** button, field, badge/pill, card, alert (web);
  button, field, pill, amount, row, balance, segmented, tabs (app) — see
  each package's `components.css`.

## Ready for `/speckit.tasks`

- [x] All Constitution Check boxes checked
- [x] Phase 1 artifacts shipped and verified — see `tasks.md`
