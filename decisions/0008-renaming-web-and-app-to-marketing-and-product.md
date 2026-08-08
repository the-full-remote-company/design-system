# ADR 0008: Rename `@tfrc/web` / `@tfrc/app` to `@tfrc/marketing` / `@tfrc/product`

**Status:** Accepted
**Date:** 2026-08-08

Partially reverses the "Renaming web/app" item in
`decisions/0007-products-consume-published-packages.md`'s Alternatives
section. `0007` remains accepted in every other respect.

## Context

`0007` recorded that the layer names `web` and `app` had been read as
"the website" and "the app" — i.e. as two *projects* — rather than as two
*dialects* of one visual language. It chose not to rename them, on the
grounds that a rename is a breaking change to the public API of all three
packages in order to fix what was really a documentation failure. It
explicitly set the condition for revisiting: *"Revisit only if the
confusion recurs after `ARCHITECTURE.md` is clearer."*

The confusion recurred three days later, from the same person, in almost
the same words — but before `ARCHITECTURE.md` was ever made clearer, so
the documentation fix `0007` was betting on had not actually been
attempted. The trigger condition was therefore met on a technicality, and
that weakens the recurrence as evidence. Worth stating plainly rather
than presenting the recurrence as a clean vindication.

Two facts settle it anyway:

1. **The rename is free right now and never will be again.** `0007`
   priced the rename as "a breaking change to the public API of all three
   packages." That price assumed consumers. There are none: all three
   packages were `"private": true` and have never been published. The
   window in which this costs nothing closes the moment the first product
   repo runs `npm install`, which is imminent and is the whole point of
   `0007`.
2. **`web` and `app` are not merely ambiguous, they are wrong.** The
   corporate site is an app in every ordinary sense, and the finance
   product is delivered on the web. Both names describe a *delivery
   platform*, while the split they encode is one of *communicative
   intent*: persuade a stranger once, versus serve a returning user for
   years (`decisions/0001.md`). A reader who knows nothing else about
   this repo can infer that difference from "marketing" and "product".
   They cannot infer it from "web" and "app", and no amount of
   `ARCHITECTURE.md` prose changes what the import statement says.

Doing nothing means paying for the misreading permanently: in every
onboarding conversation, and — more expensively — in the standing risk
that someone reasonably concludes `@tfrc/app` is where the finance app
goes, and starts putting product code in this repo.

## Decision

Rename the two dialect packages:

| Before | After |
|---|---|
| `@tfrc/web` (`packages/web/`) | `@tfrc/marketing` (`packages/marketing/`) |
| `@tfrc/app` (`packages/app/`) | `@tfrc/product` (`packages/product/`) |

`@tfrc/foundation` is unchanged. The package *count* is unchanged, so
Article VII's three-package ceiling is untouched.

The renamed packages keep version `1.0.0`. This is not a `2.0.0`, because
`@tfrc/web@1.0.0` and `@tfrc/app@1.0.0` were never published — `1.0.0`
under the new names is therefore a first release, not a successor, and
there is no migration path to document because there is nobody to
migrate. The repo-level version goes to `1.2.0`.

## Consequences

- The names now state the distinction they encode, so the most likely
  future misreading of this repo is closed off at the import statement
  rather than in a document someone may not read.
- **Every pre-0008 document in this repo now names packages that no
  longer exist.** ADRs `0001`–`0007` and `specs/001` are deliberately
  *not* rewritten: they are historical records, and `AGENTS.md` rule 7
  forbids editing history to make the present look tidy. `0001` and
  `0007` get a one-line forward-link to this ADR and nothing more. The
  cost is real — a reader of `0001` sees `@tfrc/web` and must follow a
  pointer to learn it is now `@tfrc/marketing`.
- `scripts/lint-boundaries.js` now also matches the *old* names, so a
  stale `@import "@tfrc/app"` inside `packages/marketing/` is reported as
  a boundary violation with a useful message rather than surfacing as a
  module-not-found error somewhere downstream.
- `decisions/0007.md`'s reasoning for *not* renaming is now on the record
  as having been overtaken by its own trigger condition. Anyone
  re-reading it should read this ADR next; it is linked from there.
- This burns the one cheap opportunity for a rename. A future rename —
  say, if "product" turns out to be as ambiguous as "app" was — will
  cost what `0007` said this one would, and should be resisted
  accordingly. The names are now settled.

## Alternatives considered

- **Keep `web`/`app`, fix `ARCHITECTURE.md` and `README.md` instead**
  (i.e. hold `0007`'s line). Genuinely defensible, and it was the right
  call while a rename looked expensive. Rejected because the names are
  inaccurate on their own terms, not just ambiguous, and because the
  rename's cost is approximately zero for a window that is about to
  close. Documentation that has to work against a misleading identifier
  is a permanent tax.
- **`@tfrc/site` / `@tfrc/app`.** Rejected — keeps one of the two
  platform-flavoured names and so keeps half the problem.
- **`@tfrc/brand` / `@tfrc/ui`.** Rejected. "Brand" overstates the
  marketing package's scope (brand includes voice, logo usage, and
  photography, none of which live here), and "ui" understates the
  product package's, since both packages are UI.
- **Publish `@tfrc/web`/`@tfrc/app` as deprecated aliases pointing at the
  new names.** Rejected as pure ceremony: nothing has ever installed
  them, so there is no one to warn. It would also permanently occupy two
  npm names with packages that exist only to apologise.
- **Renaming the `@tfrc` scope too** (e.g. to match the GitHub org
  `the-full-remote-company`). Out of scope here and deliberately not
  done: `@tfrc` is short, unambiguous within the company, and the scope
  is not what caused the confusion. See `decisions/0009.md` for the
  registry decision that made the question come up.
