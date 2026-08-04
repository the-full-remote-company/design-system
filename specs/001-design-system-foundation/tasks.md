# Tasks: Design System Foundation

**Input:** `specs/001-design-system-foundation/plan.md`

*(Retrofit note: these tasks are recorded as already complete — this is
v1's actual build sequence, reconstructed as a worked example of the
task template's shape, not a forward-looking list.)*

## Phase 1 — Contract

- [x] **T001** Wrote `packages/foundation/CONTRACT.md` — the full set of
      required semantic tokens
- [x] **T002** Wrote `scripts/check-contract.js` against an empty/partial
      `tokens.css` first, confirmed it correctly reported missing tokens

## Phase 2 — Foundation

- [x] **T003** Wrote `packages/foundation/src/palettes/meridian.css` with
      the neutral/brand/support ramps and reserved gain/loss values
- [x] **T004** Wrote the three alternate palettes (Lilac, Meadow,
      Daylight) as designed-but-unwired references, per `decisions/0003.md`
- [x] **T005** Recorded the active palette and reserved hues in `STATE.md`

## Phase 3 — Package implementation

- [x] **T006** Wrote `packages/web/src/tokens.css` (corporate scale) and
      `packages/app/src/tokens.css` (product scale), each satisfying the
      full contract independently, per `decisions/0004.md`
- [x] **T007** Confirmed `node scripts/check-contract.js` passes for both
- [x] **T008** Wrote `components.css` for each package, referencing only
      contract tokens
- [x] **T009** Confirmed `node scripts/lint-boundaries.js` passes for both
      — caught and fixed a false-positive match on an explanatory comment
      before this passed cleanly (see `CHANGELOG.md`)

## Phase 4 — Verification against spec.md

- [x] **T010** Walked all four acceptance scenarios manually against the
      built packages — held for all four
- [x] **T011** Confirmed text/surface contrast pairings meet 4.5:1 per
      `CONTRACT.md`'s stated floor (manual check — automation deferred,
      see `STATE.md`'s known gaps)

## Phase 5 — Close out

- [x] **T012** Wrote `CHANGELOG.md`'s 1.0.0 entry
- [x] **T013** Wrote `STATE.md` reflecting the shipped state
- [x] **T014** Wrote `decisions/0001.md` through `0005.md` covering every
      structural decision made along the way
