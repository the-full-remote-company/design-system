# Implementation Plan: Product Consumption Contract

**Input:** `specs/002-product-consumption-contract/spec.md`
**Date:** 2026-08-08
**Prerequisite:** `checklist.md` run and passing (2026-08-08), zero
unresolved `[NEEDS CLARIFICATION]` markers.

## Technical Context

- **Package(s) touched:** all three — `@tfrc/foundation` (gains the
  consumer-side checker as a `bin`), `@tfrc/marketing` and
  `@tfrc/product` (renamed, and made publishable). No package added, none
  removed.
- **New tokens required:** none. This feature changes how the language is
  distributed and verified, not what it says. `CONTRACT.md` is untouched.
- **New reserved-hue considerations:** no new hue claimed. The existing
  reserved bands (gain 130–170, loss 5–40) become *checkable in a
  consumer's codebase* for the first time, which strengthens Article V
  without changing it.
- **Decisions this depends on:** `decisions/0007.md` (products live in
  their own repos), `decisions/0008.md` (the rename), `decisions/0009.md`
  (public npm + the consumer checker).

## Constitution Check *(Phase -1 — gate before writing any task)*

#### Simplicity Gate (Article VII)
- [x] Stays within 3 top-level packages — the rename changes two package
      *names*, not the count; the checker is a `bin` inside an existing
      package rather than a fourth package
- [x] No speculative tokens or components added ahead of real, current
      need — notably, **nothing is built for the native client**, which is
      named in the request but has no chosen runtime

#### Anti-Abstraction Gate (Article VIII)
- [x] Uses native CSS custom properties directly — no token-abstraction
      layer, no JSON source of truth, no build-time transform. The
      tempting move here (extracting tokens to a platform-neutral format
      "so native works later") is explicitly rejected in
      `decisions/0007.md`
- [x] Every concept has exactly one semantic token — no aliases added.
      Notably, the rename does **not** ship `@tfrc/web` as an alias of
      `@tfrc/marketing`

#### Contract Gate (Article III / IV)
- [x] `scripts/check-contract.js` passes — re-pointed at the renamed
      directories and run
- [x] No raw color or magic-number literal introduced in component code —
      component CSS is unmodified by this feature. Raw literals *are*
      introduced in `scripts/fixtures/`, on purpose, as the inputs that
      prove the checker rejects them; see Complexity Tracking

#### Boundary Gate (Article VI)
- [x] `scripts/lint-boundaries.js` passes — and now also matches the
      pre-rename names, so a stale import fails as a boundary violation
      rather than a missing module
- [x] The boundary is additionally enforced *outside* this repo for the
      first time, via `MIXED_DIALECT` in `tfrc-verify`

#### Reserved Hue Gate (Article V) — *finance/product features only*
- [x] Does not use the gain/loss hue bands for anything but market
      direction. The one place a reserved hue appears as a raw value is
      `scripts/fixtures/consumer-reserved-color/`, where it exists to be
      rejected
- [x] No new product hue claimed — `STATE.md`'s `product_hues_in_use` is
      unchanged

## Project Structure

```
packages/foundation/bin/tfrc-verify.js        # the consumer-side checker (new)
packages/marketing/                           # was packages/web/
packages/product/                             # was packages/app/
scripts/test-verify-consumer.js               # proves the checker fails when it should (new)
scripts/fixtures/consumer-*/                  # deliberately-broken consumer repos (new)
CONSUMING.md                                  # how an outside repo adopts the language (new)
CONSUMERS.md                                  # who has adopted it, and on what version (new)
LICENSE                                       # MIT, required to publish (new)
.github/workflows/publish.yml                 # tag-triggered release (new)
```

**Structure Decision:** the checker ships as a `bin` in
`@tfrc/foundation` because every consumer already installs that package
transitively, so no consumer needs a new dependency to verify itself — and
because a fourth package holding one script would fail the Simplicity
Gate.

## Complexity Tracking

One gate is met only with a stated exception.

| Gate not met | Why it's necessary anyway | Simpler alternative rejected because |
|---|---|---|
| Article IX (integration-first: checks run against real source, never fixtures) | `tfrc-verify`'s real inputs are consumer repositories, which do not exist yet and which this repo will never be able to read. Its own regression test therefore has no real source to run against, and `specs/002` SC-003 requires each rule be *demonstrably* able to fail. | Testing it against this repo's own `packages/` was considered: it fails to exercise `MIXED_DIALECT` and `VERSION_PIN` at all, since this repo is not a consumer and has no consumer `package.json`. Article IX's own wording ("if a check can't be performed against real source, that's a signal the check needs redesigning") was weighed; here the check is sound and the *subject* is what's absent. The repo's two original scripts remain fixture-free and still read only the real shipped `tokens.css`. |

## Phase 0 — Research

Two questions had to be resolved before tasks could be written; both were
put to the requester rather than guessed, because both are business
decisions rather than technical ones.

1. **Do products live in this repo or their own?** → Their own.
   Confirmed, and already recorded as `decisions/0007.md`.
2. **Which registry, and under what license?** → Public npm, `@tfrc`
   scope, MIT. Recorded as `decisions/0009.md`, along with the constraint
   that ruled out GitHub Packages (its scope must equal the org name,
   which would have forced `@the-full-remote-company/*`).

Unresolved and deliberately left so: whether the `@tfrc` npm scope is
actually available. Unverifiable without network access; carried as an open
risk in `STATE.md`, not as an assumption.

## Phase 1 — Design Artifacts

- **Token additions:** none.
- **Contract additions:** none.
- **Checker rules** (`tfrc-verify`), each mapping to a spec requirement:

  | Code | Rule | Spec | Authority |
  |---|---|---|---|
  | `MIXED_DIALECT` | never both dialects in one consumer | FR-007 | Article VI |
  | `RESERVED_TOKEN` | marketing consumer references gain/loss | FR-008 | Article V |
  | `RESERVED_REDEFINE` | consumer redefines a reserved token | FR-008 | Article V |
  | `RESERVED_HUE` | raw `oklch()` hue inside a reserved band | FR-008 | Article V |
  | `RAW_VALUE` | any raw color literal | FR-006 | Article IV |
  | `VERSION_PIN` | `@tfrc/*` dependency not an exact version | FR-002 | `decisions/0007.md` |
  | `NO_DIALECT` / `NO_MANIFEST` | nothing to verify | FR-003 | — |

- **Escape hatch:** `tfrc-allow-raw: <reason>` downgrades `RAW_VALUE` to a
  printed, counted allowance. It never suppresses output — `spec.md`'s
  first edge case requires a local override be visible rather than
  silently accepted. There is deliberately **no** hatch for Article V.
- **Distribution:** `npx tfrc-verify`, dependency-free, so it runs in a
  consumer repo that has installed nothing else (FR-010).

## Ready for tasks

- [x] All Constitution Check boxes are checked, or justified above
- [x] Phase 1 artifacts are concrete enough to derive tasks from
