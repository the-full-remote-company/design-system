# Tasks: [FEATURE NAME]

**Input:** `specs/[###-feature-name]/plan.md` (required); this feature's
`spec.md` for acceptance scenarios.

Tasks are ordered contract-first: the contract check for a new token or
boundary rule is written and confirmed to fail before the implementation
that makes it pass, per Article III. Independent tasks are marked `[P]`
and may be done in either order or in parallel; unmarked tasks depend on
the one before them.

## Phase 1 — Contract

- [ ] **T001** Add any new required token names to
      `packages/foundation/CONTRACT.md`
- [ ] **T002 [P]** Confirm `node scripts/check-contract.js` FAILS against
      the current (not-yet-updated) `tokens.css` — this proves the check
      actually exercises the new requirement before you satisfy it

## Phase 2 — Foundation (if touched)

- [ ] **T003** Add/edit raw ramp values in
      `packages/foundation/src/palettes/[palette].css`
- [ ] **T004 [P]** Update `STATE.md` if this claims a new hue or palette

## Phase 3 — Package implementation

- [ ] **T005** Add the token(s) to the relevant package's `tokens.css`
- [ ] **T006** Confirm `node scripts/check-contract.js` now PASSES
- [ ] **T007** Implement the component/theme change in `components.css`
      (or the relevant theme file), referencing only contract tokens
- [ ] **T008 [P]** Confirm `node scripts/lint-boundaries.js` still passes

## Phase 4 — Verification against spec.md

- [ ] **T009** Walk each acceptance scenario in `spec.md` manually or via
      the docs app; confirm each one holds
- [ ] **T010** Contrast-check any new text/background pairing against
      the floor in `CONTRACT.md` (≥4.5:1)

## Phase 5 — Close out

- [ ] **T011** Update `CHANGELOG.md`
- [ ] **T012** Update `STATE.md` if anything it describes changed
- [ ] **T013 [P]** Open an ADR in `decisions/` if this changed the
      contract, the package boundary, or added a reserved token —
      per `AGENTS.md` rule 7

## Parallel execution notes

Tasks marked `[P]` touch different files from their neighbors and can be
done out of order or simultaneously by different contributors. Tasks
without `[P]` must happen in the listed sequence — most importantly,
never skip straight to Phase 3 without Phase 1's failing check, or the
"contract-first" guarantee this template exists to enforce is void.
