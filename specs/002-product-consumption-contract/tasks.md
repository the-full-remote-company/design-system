# Tasks: Product Consumption Contract

**Input:** `specs/002-product-consumption-contract/plan.md`; `spec.md` for
acceptance scenarios.
**Completed:** 2026-08-08 (all tasks except T017–T019, which need network
access and a business credential — see Not done).

Contract-first ordering per Article III: the check that proves a rule is
enforceable comes before the thing that satisfies it.

## Phase 1 — Repair the spec's own record

- [x] **T001** Write `checklist.md`, which `spec.md` already claimed
      existed and had passed, and record its two borderline items instead
      of suppressing them
- [x] **T002** Correct the false "run and passing as of 2026-08-05" claim
      in `spec.md`, leaving a visible correction note rather than
      overwriting it silently
- [x] **T003** Write `plan.md` with the Constitution Check gated, including
      the Article IX exception in Complexity Tracking

## Phase 2 — Rename (decisions/0008.md)

- [x] **T004** `git mv packages/web packages/marketing`,
      `git mv packages/app packages/product`
- [x] **T005** Replace `@tfrc/web` → `@tfrc/marketing` and `@tfrc/app` →
      `@tfrc/product` across all *live* files; leave `decisions/0001`–`0007`
      and `specs/001` as written (`AGENTS.md` rule 7) and forward-link
      `0001` and `0007` to `0008`
- [x] **T006** Re-point `scripts/check-contract.js` and
      `scripts/lint-boundaries.js` at the real new paths, and make the
      boundary lint also match the pre-rename names so a stale import
      reports as a boundary violation
- [x] **T007** Confirm both scripts still pass against the real shipped
      `tokens.css` files (Article IX)
- [x] **T008** Amend the constitution to 1.0.1 with a Sync Impact Report;
      Articles I, V, VI, VII renamed, Article II clarified. Update
      `.specify/templates/plan-template.md`

## Phase 3 — Make the packages consumable (FR-001, FR-002, FR-010)

- [x] **T009** Drop `"private": true` from all three packages; add
      `license`, `repository`, `homepage`, `bugs`, `files`, `exports`,
      `publishConfig`
- [x] **T010** Add `LICENSE` (MIT) at the repo root
- [x] **T011** Add `.github/workflows/publish.yml`, tag-triggered, running
      the contract and boundary checks *before* publishing (Article III),
      publishing `foundation` first since the dialects depend on an exact
      version of it

## Phase 4 — Consumer-side enforcement (FR-006, FR-007, FR-008)

- [x] **T012** Write the deliberately-broken fixtures in
      `scripts/fixtures/`, one per rule, plus one compliant consumer —
      **before** the checker, so the checker is written against known-bad
      input rather than validated against its own assumptions
- [x] **T013** Write `scripts/test-verify-consumer.js` asserting the exact
      exit code and violation codes for each fixture, and confirm it FAILS
      while no checker exists
- [x] **T014** Implement `packages/foundation/bin/tfrc-verify.js`; wire it
      as the `tfrc-verify` bin of `@tfrc/foundation`
- [x] **T015** Confirm `scripts/test-verify-consumer.js` now PASSES,
      including that the `tfrc-allow-raw` allowance is printed and counted
      rather than silently accepted
- [x] **T016** Add both to CI (`.github/workflows/ci.yml`), plus a smoke
      test of the bin itself so a crash surfaces here and not in a product
      repo via `npx`

## Phase 5 — Adoption surface (FR-009, SC-001)

- [x] **T017** Write `CONSUMING.md` — the dialect table, install and import
      snippets for both dialects, every violation code with its fix, the
      four unbreakable rules, and what to do when a token is missing
- [x] **T018** Write `CONSUMERS.md` — the consumer register, with both
      imminent products listed as "expected, not yet started" and the
      native client recorded as having no path yet
- [x] **T019** Point the checker's failure output at `CONSUMING.md`

## Phase 6 — Close out

- [x] **T020** Update `ARCHITECTURE.md` and `README.md` to state, in those
      words, that the two dialects are not two projects — the root cause
      `decisions/0007.md` identified and never got around to fixing
- [x] **T021** Update `AGENTS.md` and `CONTRIBUTING.md` for the new names,
      the consumer boundary, and the new script
- [x] **T022** Update `STATE.md` and `CHANGELOG.md` in the same commit
      (`AGENTS.md` rule 8)
- [x] **T023** Write `decisions/0008.md` and `decisions/0009.md`
- [x] **T024** Re-run all three scripts; grep the whole repo for surviving
      `@tfrc/web` / `@tfrc/app` / `packages/web` / `packages/app`
      references and confirm every survivor is an intentional historical one

## Not done — needs something this session cannot provide

Listed so the next reader knows these are pending, not overlooked. None
are blocked by design work; all three are blocked on access.

- [ ] **T025** Verify the `@tfrc` npm scope is available and owned by the
      company. If it is taken, `decisions/0009.md` needs a successor ADR,
      not an improvised workaround. Carried in `STATE.md` as an open risk.
- [ ] **T026** Add the `NPM_TOKEN` repository secret with publish rights to
      the `@tfrc` scope, then tag `v1.2.0` to perform the first real
      publish. Until this happens, FR-001 is implemented but unproven: no
      consumer can install anything yet.
- [ ] **T027** Prove SC-001 the only way it can be proven — have someone
      who has not read this repo build a styled page from `CONSUMING.md`
      alone. Until then, SC-001 is asserted, not measured.

## Verification against spec.md

| Scenario | Status |
|---|---|
| S1 — marketing consumer builds a page from documented names only | `CONSUMING.md` provides the path; unproven until T026/T027 |
| S2 — product consumer gets the product dialect + finance identity, not the corporate one | Covered by `CONSUMING.md` and enforced by `MIXED_DIALECT` |
| S3 — pinned version unaffected by later changes | Enforced by `VERSION_PIN`; exact-version deps |
| S4 — a release states whether it breaks | `CHANGELOG.md` convention + tag-triggered publish |
| S5 — mixed dialects reported as an error in the consumer's own CI | ✅ proven by `consumer-mixed-dialect` fixture |
| S6 — "who is using this, on what version?" answerable in one place | `CONSUMERS.md` |

**SC-003 is fully met and demonstrated:** every rule in FR-006–FR-008 has a
fixture that makes it fail, asserted in CI. **SC-001, SC-002 and SC-004 are
implemented but not yet observed**, because there is still no consumer in
existence — which is the honest state of this feature until T026 lands.
