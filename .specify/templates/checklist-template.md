# Specification Quality Checklist: [FEATURE NAME]

Unit tests for English. Run this against `spec.md` before `/speckit.plan`
(or before hand-writing `plan.md`, without the CLI). A failed box means
the spec goes back for revision — it does not mean "note it and proceed."

## Content Quality

- [ ] Written for a non-technical stakeholder
- [ ] Focused on user value, not implementation
- [ ] Zero mentions of a package name, framework, or CSS mechanism
- [ ] Zero mentions of specific token names or hex/oklch values

## Requirement Completeness

- [ ] No `[NEEDS CLARIFICATION]` markers remain
- [ ] Every functional requirement is independently testable
- [ ] Success criteria are measurable and technology-agnostic
- [ ] All acceptance scenarios use Given/When/Then and are unambiguous

## Feature Readiness

- [ ] Every functional requirement traces to at least one acceptance scenario
- [ ] Edge cases are documented, not just happy paths
- [ ] No speculative ("might need") requirements without a concrete scenario

## Constitution Pre-Check *(a preview of plan.md's gates — not a substitute for them)*

- [ ] Nothing in this spec implies a 4th top-level package (Article VII)
- [ ] Nothing in this spec implies reusing the gain/loss hue bands for
      anything but market direction (Article V)

**Result:** [ ] PASS — ready for `/speckit.plan` &nbsp;&nbsp; [ ] NEEDS REVISION
