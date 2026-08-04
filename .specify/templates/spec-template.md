# Feature Specification: [FEATURE NAME]

**Branch:** `[###-feature-name]` | **Date:** [DATE] | **Status:** Draft
**Input:** [the raw feature description this spec was generated from]

## Guardrails for whoever writes this document

- Focus on **WHAT** the feature needs to do and **WHY** — never **HOW**.
  No tech stack, no package names, no CSS, no framework mentions here.
  That's `plan.md`'s job.
- Written for a stakeholder who has never opened this repo — a designer,
  a PM, a founder. If a sentence only makes sense to someone who's read
  `ARCHITECTURE.md`, it belongs in the plan, not here.
- Mark real ambiguity with `[NEEDS CLARIFICATION: specific question]`.
  Don't guess at something the input didn't specify. Maximum 3 markers —
  if you need more than 3, the feature description was too vague to spec
  yet; go back and ask before writing more of this document.
- Every functional requirement must be independently testable. If you
  can't imagine the test, the requirement isn't specific enough yet.
- Remove any optional section below that doesn't apply. Don't leave a
  heading with "N/A" under it.

---

## User Scenarios & Testing *(mandatory)*

### Primary story
[One paragraph: who is doing what, and why they need it]

### Acceptance scenarios
1. **Given** [starting state], **When** [action], **Then** [outcome]
2. **Given** [starting state], **When** [action], **Then** [outcome]

### Edge cases
- What happens when [boundary condition]?
- What happens when [conflicting/concurrent condition]?

## Functional Requirements *(mandatory)*

- **FR-001**: The system MUST [specific, testable capability]
- **FR-002**: The system MUST [specific, testable capability]
- **FR-003**: Users MUST be able to [specific action]

*(Number sequentially. Every FR must be verifiable without reference to
an implementation choice.)*

## Success Criteria *(mandatory)*

Technology-agnostic and measurable — someone should be able to verify
these without reading any code.

- **SC-001**: [quantitative — e.g. "a user completes X in under Y seconds"]
- **SC-002**: [qualitative — e.g. "a first-time user can locate X without help"]

## Key Entities *(only if the feature involves new data or content types)*

- **[Entity]**: [what it represents, its key attributes, without
  specifying storage or schema]

## Assumptions

Document any reasonable default you chose in place of a
`[NEEDS CLARIFICATION]` marker, and why it was reasonable given the input.

## Review Checklist

Run `.specify/templates/checklist-template.md` against this document
before moving to `/speckit.plan` (or, without the CLI, before writing
`plan.md` by hand). Do not proceed with unresolved
`[NEEDS CLARIFICATION]` markers.
