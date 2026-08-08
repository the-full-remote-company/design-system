# Feature Specification: Product Consumption Contract

**Branch:** `002-product-consumption-contract` | **Date:** 2026-08-05 | **Status:** Implemented 2026-08-08
**Input:** "I want to create a website for the-full-remote-company and then
later multiple other projects like a personal finance management app, which
should be a web application and also get a native app one day. Update the
structure accordingly."

*(Scoping note: the input asked for a structural change to the design
system. Investigation found the existing structure already accommodates
both named products — the two expressions of the visual language were
misread as two projects. The real gap is that nothing defines how a
product, built in its own codebase, adopts the visual language. That gap
is what this spec addresses. See `decisions/0007.md`.)*

## User Scenarios & Testing *(mandatory)*

### Primary story

An engineer starts building the company's corporate website in a fresh,
separate codebase. They need every page they build to look like it
belongs to the company — the same colors, spacing, type, and component
behavior as anything else the company ships — without copying design
files into their project, and without inventing values by hand.

Some months later a second engineer starts a personal finance product in
a third, unrelated codebase. They need the same guarantee, but for the
product-facing expression of the visual language rather than the
corporate one, plus the finance product's own identity. They must be
able to build against a fixed, known version of the language, and must
not be broken by a change made for the corporate site the week after
they launch.

### Acceptance scenarios

1. **Given** an empty new codebase for the corporate website, **When**
   the engineer adopts the visual language, **Then** they receive the
   corporate expression and can build a page using only documented
   component names, having written zero color values by hand.
2. **Given** an empty new codebase for the finance product, **When** the
   engineer adopts the visual language, **Then** they receive the
   product expression and the finance identity, and do **not** receive
   the corporate expression.
3. **Given** a product built against a fixed version of the language,
   **When** the language changes in a way that would alter that
   product's appearance, **Then** the product is unaffected until it
   explicitly chooses to move to the newer version.
4. **Given** a maintainer about to release a change to the language,
   **When** that change would break an existing consumer, **Then** the
   release states that it is breaking, distinctly from a release that
   only adds.
5. **Given** a product engineer who has accidentally mixed the corporate
   and product expressions in one screen, **When** they run the checks
   available to them in their own codebase, **Then** the mix is reported
   as an error before it reaches users.
6. **Given** a maintainer asked "who is using this, and on what
   version?", **When** they consult this repo, **Then** the answer is
   recorded in one place and is current.

### Edge cases

- What happens when a product needs a value the shared language does not
  define? It must be visibly an error in the product's own checks, not a
  silently accepted local override — otherwise the language decays one
  product at a time.
- What happens when two products need to move at different speeds, and
  one wants a change the other cannot absorb yet? The slower product
  must not be forced to move.
- What happens when a product uses a color that the language reserves
  for a specific meaning, for decoration instead? This must be caught in
  the product's codebase, since the language's maintainers cannot see
  that product's source.
- What happens when a product cannot use web styling at all — a native
  client? Explicitly out of scope; see Out of Scope.

## Functional Requirements *(mandatory)*

- **FR-001**: A product in a separate codebase MUST be able to adopt the
  shared visual language without copying or vendoring its source.
- **FR-002**: Every adoption MUST resolve to one explicit, recorded
  version of the language.
- **FR-003**: A product MUST be able to adopt the product expression
  without receiving the corporate expression, and vice versa.
- **FR-004**: A product MUST be able to select its own product identity
  without modifying any shared source.
- **FR-005**: A release of the language MUST distinguish a change that
  breaks existing consumers from one that only adds to it.
- **FR-006**: A consuming codebase MUST be able to verify, without help
  from this repo's maintainers, that it has not introduced values
  outside the shared language.
- **FR-007**: A consuming codebase MUST be able to verify that it has
  not combined the corporate and product expressions.
- **FR-008**: A consuming codebase MUST be able to verify that it has
  not used a reserved-meaning color for anything but that meaning.
- **FR-009**: This repo MUST record every known consumer and the version
  of the language it is on.
- **FR-010**: Adopting the language MUST NOT require the consumer to run
  a transformation or build step over its source in order to get usable
  styling.

## Success Criteria *(mandatory)*

- **SC-001**: An engineer with no prior exposure to this repo can go
  from an empty codebase to a correctly-styled page by following written
  instructions only, with no questions asked of a maintainer.
- **SC-002**: A product can remain on an older version of the language
  indefinitely and continue to build and ship.
- **SC-003**: Every violation of the three rules in FR-006 through
  FR-008 is caught by an automated check in the consuming codebase, not
  by review — measurably: a deliberately-introduced violation of each of
  the three fails a check.
- **SC-004**: The recorded list of consumers and their versions is
  accurate at any commit — verifiable by comparing it against each
  consumer's declared version.
- **SC-005**: Adding the second product requires no change to the shared
  language's structure, only a version adoption and an identity
  selection.

## Key Entities

- **Consumer** — a codebase outside this repo that adopts the visual
  language. Has a name, an expression it consumes (corporate or
  product), an adopted version, and, if a product, one identity.
- **Release** — a published, immutable, named version of one part of the
  language, classified as breaking or additive.
- **Identity** — the per-product distinguishing layer selected by a
  product consumer, described in `decisions/0005.md`.

## Out of Scope

- **Native clients.** The finance product is intended to gain a native
  client eventually. Nothing in this feature prepares for it. The
  runtime is unchosen and the product does not exist, so building for it
  now would be guessing; see `decisions/0007.md`'s Alternatives. When a
  native client actually starts, it gets its own spec.
- **Building the corporate website or the finance product themselves.**
  This feature makes them possible to build; it does not build them.
- **Renaming the two expressions to less project-like names.**
  Considered and deferred in `decisions/0007.md`.

## Assumptions

- Assumed products live in separate codebases rather than in this repo.
  This was confirmed with the requester rather than guessed, and is
  recorded as `decisions/0007.md` because it is structural.
- Assumed the finance product's identity already exists and does not
  need to be created by this feature — it shipped in v1.
- Assumed "record every known consumer" (FR-009) means a hand-maintained
  list in this repo, not automated discovery. Automated discovery of
  consumers across repos is disproportionate at two consumers, and the
  existing convention of updating a state file in the same commit
  already covers the failure mode.

## Review Checklist

See `checklist.md` in this directory — run and passing as of 2026-08-08.

*(Correction, 2026-08-08: this line previously read "run and passing as of
2026-08-05" while `checklist.md` did not exist in this directory. The claim
was false when written. The checklist has now actually been written and
run; it passes, with one borderline item recorded in it rather than
suppressed (FR-010 and one edge case lean on a delivery mechanism). Noted
here rather than silently overwritten, because "our own review passed" is
precisely the kind of assertion a later reader cannot audit, and the fix
for it is a habit, not a one-time edit.)*
