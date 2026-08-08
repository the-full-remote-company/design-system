# Specification Quality Checklist: Product Consumption Contract

Run against `spec.md` on 2026-08-08, before `plan.md` was written.

This checklist was referenced by `spec.md` on 2026-08-05 as "run and
passing" while this file did not exist. It exists now, and the referring
line has been corrected. See `decisions/0008.md` and the correction note at
the bottom of `spec.md`.

## Content Quality

- [x] Written for a non-technical stakeholder
- [x] Focused on user value, not implementation
- [x] Zero mentions of a package name, framework, or CSS mechanism
      — *with one qualification: the scoping note and Assumptions cite ADR
      filenames. Judged acceptable: those are governance provenance, not
      implementation. No package name, no framework, no token appears in
      any requirement or scenario.*
- [x] Zero mentions of specific token names or hex/oklch values

## Requirement Completeness

- [x] No `[NEEDS CLARIFICATION]` markers remain
- [x] Every functional requirement is independently testable
- [x] Success criteria are measurable and technology-agnostic
- [x] All acceptance scenarios use Given/When/Then and are unambiguous

## Feature Readiness

- [x] Every functional requirement traces to at least one acceptance scenario
      — traced explicitly:
      FR-001→S1,S2 · FR-002→S3 · FR-003→S2 · FR-004→S2 · FR-005→S4 ·
      FR-006→S5,edge 1 · FR-007→S5 · FR-008→edge 3 · FR-009→S6 ·
      FR-010→S1
- [x] Edge cases are documented, not just happy paths
- [x] No speculative ("might need") requirements without a concrete scenario

## Constitution Pre-Check *(a preview of plan.md's gates — not a substitute for them)*

- [x] Nothing in this spec implies a 4th top-level package (Article VII)
      — *checked deliberately, because the request that produced this spec
      sounded like it wanted new packages. It does not: the two named
      products are consumers, and the second one's identity is an existing
      theme file.*
- [x] Nothing in this spec implies reusing the gain/loss hue bands for
      anything but market direction (Article V) — *it strengthens the rule
      by requiring it be checkable in a consumer's own codebase.*

**Result:** [x] PASS — ready for `plan.md` &nbsp;&nbsp; [ ] NEEDS REVISION

## Recorded deviations

Neither blocks the plan; both are logged so a later reader does not think
the checklist was rubber-stamped.

1. **FR-010** ("adopting MUST NOT require the consumer to run a
   transformation or build step over its source") describes a delivery
   mechanism more than a user value. It survives because the value behind
   it is real and testable — an engineer can start without a build
   pipeline — but a stricter reading of "no CSS mechanism" would send it
   back for rewording.
2. **Edge case 4** says "cannot use web styling at all — a native
   client", which leaks the delivery medium. Left as-is: rewording it to
   avoid the term would obscure the actual limitation, which is the whole
   point of that entry.
