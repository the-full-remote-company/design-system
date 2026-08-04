# Implementation Plan: [FEATURE NAME]

**Input:** `specs/[###-feature-name]/spec.md`
**Prerequisite:** spec.md's Review Checklist passed, zero unresolved
`[NEEDS CLARIFICATION]` markers.

This is where WHAT becomes HOW. Tech stack, package touched, token
choices, and architecture decisions all belong here — none of them
belong in spec.md.

## Technical Context

- **Package(s) touched:** [`@tfrc/foundation` | `@tfrc/web` | `@tfrc/app` | new theme under `@tfrc/app`]
- **New tokens required:** [list, or "none — existing contract covers this"]
- **New reserved-hue considerations:** [does this touch gain/loss? does
  it claim a new product hue? check STATE.md's `product_hues_in_use`]

## Constitution Check *(Phase -1 — gate before writing any task)*

Every box must be checked before `tasks.md` is written. An unchecked box
blocks progress until either the plan changes or the exception is
justified in Complexity Tracking below — it is never silently skipped.

#### Simplicity Gate (Article VII)
- [ ] Stays within 3 top-level packages — this feature is a file inside
      an existing package, not a new package
- [ ] No speculative tokens or components added ahead of real, current need

#### Anti-Abstraction Gate (Article VIII)
- [ ] Uses Tailwind v4 `@theme` / native CSS custom properties directly —
      no new abstraction layer introduced
- [ ] Every concept has exactly one semantic token — no duplicate aliases

#### Contract Gate (Article III / IV)
- [ ] `scripts/check-contract.js` passes against the new/changed
      `tokens.css` before this plan is considered done
- [ ] No raw color or magic-number literal introduced in component code

#### Boundary Gate (Article VI)
- [ ] `scripts/lint-boundaries.js` passes — no new cross-import between
      `@tfrc/web` and `@tfrc/app`

#### Reserved Hue Gate (Article V) — *finance/product features only*
- [ ] Does not use the gain/loss hue bands for anything but market direction
- [ ] Any new product hue is checked against `STATE.md`'s
      `product_hues_in_use` and the ceiling in `decisions/0005.md`

## Project Structure

This feature lives at:

```
packages/[foundation|web|app]/src/[...]
```

*(State the actual path. Do not introduce a new top-level directory
without a passing Simplicity Gate above and its own ADR.)*

**Structure Decision:** [one sentence — which package, and why]

## Complexity Tracking

*Fill only if a gate above is unchecked and the exception is justified.*

| Gate not met | Why it's necessary anyway | Simpler alternative rejected because |
|---|---|---|
| [gate] | [reason] | [alternative + why it doesn't work] |

## Phase 0 — Research *(if anything is unresolved)*

Document any open technical question and its resolution here before
writing tasks. Delete this section if nothing needed research.

## Phase 1 — Design Artifacts

- **Token additions:** list exact token names and values, or "none"
- **Component contracts:** class names and their states (default, hover,
  focus-visible, active, disabled, dark)
- **Data model** *(only if the feature introduces a new content shape)*

## Ready for `/speckit.tasks`

- [ ] All Constitution Check boxes are either checked or justified above
- [ ] Phase 1 artifacts are concrete enough to derive tasks from
