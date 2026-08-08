<!--
Sync Impact Report
Version: 1.0.0 → 1.0.1
Ratified: 2026-08-04 | Amended: 2026-08-08
Change type: PATCH — identifier rename only. Articles I, V, VI and VII now
             name `@tfrc/marketing` and `@tfrc/product` where they named
             `@tfrc/web` and `@tfrc/app`. No article was added, removed,
             reversed, or altered in what it requires: the three-package
             ceiling is still three, the reserved hues are still reserved,
             the boundary is still absolute. See decisions/0008.md.
Modified principles: Article I (package names), Article V (package names),
             Article VI (package names), Article VII (package names),
             Article II (clarification only — states that a check for a
             rule breakable only in a consumer's codebase must be
             shippable to that consumer, which is what the existing
             "any new mechanically-checkable rule gets a script" already
             required; adds no new obligation)
Added sections: none
Removed sections: none
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — package names in Technical
     Context, Boundary Gate, and Project Structure
  ✅ AGENTS.md, CONTRIBUTING.md, README.md, ARCHITECTURE.md, STATE.md
  ✅ scripts/check-contract.js, scripts/lint-boundaries.js — real paths
  ⬜ decisions/0001–0007, specs/001 — deliberately NOT updated. They are
     historical records and AGENTS.md rule 7 forbids rewriting them;
     0001 and 0007 carry a forward-link to 0008 instead.

Version: 1.0.0 (initial adoption, 2026-08-04)
Change type: Initial adoption (MINOR — new governance layer, no breaking
             change to shipped packages; see decisions/0006.md)
Modified principles: n/a (initial version)
Added sections: Preamble, Articles I–IX, Governance & Amendment Process
Removed sections: none
Templates requiring updates:
  ✅ .specify/templates/spec-template.md   — created alongside this constitution
  ✅ .specify/templates/plan-template.md   — created alongside this constitution
  ✅ .specify/templates/tasks-template.md  — created alongside this constitution
  ✅ .specify/templates/checklist-template.md — created alongside this constitution
  ✅ AGENTS.md — updated to defer to this document on conflict
  ✅ CONTRIBUTING.md — updated with the spec → plan → tasks → implement workflow
Follow-up TODOs: none
-->

# The Full Remote Company — Design System Constitution

## Preamble

This constitution governs `tfrc-design-system` under GitHub's
Spec-Driven Development (SDD) methodology. It is adapted from the
[spec-kit](https://github.com/github/spec-kit) nine-article structure to
a front-end design-system domain — a domain of tokens, CSS packages, and
themes rather than backend services. Where an article's literal wording
(written for application backends) doesn't map cleanly onto that domain,
the adaptation is stated explicitly rather than forced. This is not a
byte-for-byte copy of spec-kit's own constitution — it is spec-kit's
methodology applied honestly to what this repo actually is. See
`decisions/0006-adopting-spec-driven-development.md` for the reasoning.

**Precedence.** This constitution is supreme over `AGENTS.md`,
`CONTRIBUTING.md`, and any package `README.md` on any point where they
conflict. `AGENTS.md` and `CONTRIBUTING.md` provide day-to-day operating
detail; this document provides the principles that detail must never
violate. `decisions/*.md` (ADRs) remain the record of *why* a specific
past decision was made — they supplement this constitution, they don't
supersede it.

---

## Article I — Package-First Principle

Every capability in this system exists as a standalone, importable
package before anything consumes it. `@tfrc/foundation`, `@tfrc/marketing`,
and `@tfrc/product` are packages, not folders of convenience. A product theme
(`packages/product/src/themes/*.css`) is a themeable unit over `@tfrc/product`,
not inline overrides scattered through a consuming application.

No feature may be built by copy-pasting CSS directly into a consuming
site or app without first existing as an addressable file inside one of
these packages. This is what makes "one product system, not one per
product" (`decisions/0001.md`) enforceable rather than aspirational.

## Article II — Text-Auditable Governance

Every rule in this constitution that *can* be mechanically checked
*must* be — as a dependency-free script that takes no interactive input,
prints human-readable results to stdout, and returns a machine-checkable
exit code (0 = compliant, 1 = violation). This is the design-system
translation of spec-kit's CLI Interface Mandate: observability over
opacity. A rule that only lives in prose is a rule an agent can
plausibly deniably miss; a rule with a script is one a CI job can block
on. `scripts/check-contract.js` and `scripts/lint-boundaries.js` exist
because of this article, not the other way around — any new
mechanically-checkable rule gets a script in the same PR that adds it.

This obligation does not stop at this repository's edge. Where a rule can
only be broken in a consumer's codebase — which is where Articles V and VI
became breakable once products began installing these packages from a
registry (`decisions/0007.md`) — the check must be *shippable to* that
consumer rather than merely run here. `tfrc-verify`, shipped as an
executable in `@tfrc/foundation`, exists for that reason; see
`decisions/0009.md`.

## Article III — Contract-First Imperative (NON-NEGOTIABLE)

No `tokens.css`, palette, or theme may be merged before
`scripts/check-contract.js` runs against it and passes. No cross-package
change may be merged before `scripts/lint-boundaries.js` passes. This is
this domain's translation of Test-First: the contract *is* the test
suite for a token system, and it runs before the change is proposed, not
after it's already in review.

## Article IV — Token Contract Supremacy (project-defined)

Component CSS never contains a raw color literal, an unexplained magic
number, or a bespoke spacing value. Every value resolves through a named
token defined in `packages/foundation/CONTRACT.md`. If the token doesn't
exist yet, the contract is extended first — deliberately, in its own
change — never worked around locally. See `AGENTS.md` rule 2.

## Article V — Reserved Semantic Colors (project-defined)

The hue bands reserved for market direction (`--color-gain`,
`--color-loss`) belong exclusively to `@tfrc/product` and may never be used
as brand, decorative, or illustrative color anywhere in `@tfrc/marketing` or
any future package. See `decisions/0002-reserved-hues-for-financial-semantics.md`.
This article does not sunset and is not subject to convenience
exceptions.

## Article VI — Package Boundary Isolation (project-defined)

`@tfrc/marketing` and `@tfrc/product` never import from each other, at any level —
not a component, not a token, not a class-naming convention. A shared
need graduates into `@tfrc/foundation` only on its third identical use
across packages, never in anticipation of a second. See
`decisions/0001.md` and `decisions/0004.md`.

## Article VII — Simplicity Gate

The shared system holds a maximum of three top-level packages:
`@tfrc/foundation`, `@tfrc/marketing`, `@tfrc/product`. A new product line is a
**theme file** under `packages/product/src/themes/`, never a fourth
top-level package. No token, component, or configuration may be added in
anticipation of a need that doesn't exist yet — see the "no
future-proofing" gate in `.specify/templates/plan-template.md`. Any
proposal to exceed three packages requires its own ADR justifying the
exception, per Article IX of `AGENTS.md` rule 7's spirit.

## Article VIII — Anti-Abstraction Gate

Use Tailwind v4's `@theme` directive and native CSS custom properties
directly. Do not build a JavaScript token-abstraction layer, a config
compiler, or a second naming scheme on top of what CSS custom properties
already provide natively. Every concept gets exactly one semantic
representation — one `--color-accent`, not `--color-accent` aliased
under a second name for convenience in some other file.

## Article IX — Integration-First Verification

`scripts/check-contract.js` and `scripts/lint-boundaries.js` run against
the real, shipped `tokens.css` files in each package — never against
mocked or hard-coded fixture strings standing in for them. If a check
can't be performed against real source, that's a signal the check itself
needs redesigning, not a reason to fake its input.

---

## Governance & Amendment Process

- **Ratification.** This constitution took effect at version 1.0.0 on
  the date in the Sync Impact Report above.
- **Amendment.** A change to any article requires: (1) a new numbered
  ADR in `decisions/` stating the rationale, (2) a version bump to this
  file following semver — MAJOR for removing or reversing an article,
  MINOR for adding one, PATCH for wording clarification that changes no
  rule, and (3) an updated Sync Impact Report at the top of this file
  listing every template and doc that needed a matching update.
- **Compliance.** Every `plan.md` under `specs/` must include a
  Constitution Check section gating on Articles VII–IX before any
  implementation task is written. A plan that fails a gate documents the
  justified exception in its Complexity Tracking section — it does not
  silently skip the gate.
- **Conflict resolution.** If `AGENTS.md`, `CONTRIBUTING.md`, or any
  README appears to permit something this constitution forbids, this
  constitution wins, and the conflicting document is a bug to fix in the
  same PR that notices it.

**Version:** 1.0.1 | **Ratified:** 2026-08-04 | **Last amended:** 2026-08-08
