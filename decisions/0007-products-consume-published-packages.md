# ADR 0007: Products consume published packages; they do not live in this repo

**Status:** Accepted; Alternatives item 3 (deferring the rename) overtaken by 0008
**Date:** 2026-08-05

> **Follow-ups (added 2026-08-08):**
> `decisions/0008-renaming-web-and-app-to-marketing-and-product.md` carried
> out the rename this ADR chose to defer — `@tfrc/web` → `@tfrc/marketing`,
> `@tfrc/app` → `@tfrc/product`. `decisions/0009-public-npm-registry-and-consumer-side-verification.md`
> supplies the registry this ADR left unchosen and closes the consumer-side
> enforcement hole named in its Consequences. Everything else below stands.
> Package names in the text are as originally written.

## Context

`decisions/0001.md` established `@tfrc/web` and `@tfrc/app` as two
*expressions* of one foundation — a corporate dialect and a product
dialect. It did not say where the actual consumers of those packages
live, because in v1 there were none. `apps/` exists in
`pnpm-workspace.yaml` with a single stub (`apps/docs`), which left the
question open by accident rather than by decision.

That gap has now produced its first observable cost: the layer names
`web` and `app` were read as "the website" and "the app" — i.e. as two
*projects* — rather than as two dialects. That is a predictable
misreading. `web` and `app` are nouns that name products in almost every
other repo on earth, and nothing in `README.md` or `ARCHITECTURE.md`
said "these are not projects" in those words.

Concretely, two consumers are now imminent:

- the corporate site for The Full Remote Company, which consumes
  `@tfrc/web`
- a personal finance product, which consumes `@tfrc/app` plus
  `src/themes/finance.css` (already shipped in v1), and which is intended
  to gain a native client later

Doing nothing means each consumer improvises: vendoring a copy of
`tokens.css`, or being added to `apps/` ad hoc, at which point the
repo silently stops being a design system and becomes a product
monorepo without anyone deciding that it should.

## Decision

Products live in their own repositories and consume `@tfrc/foundation`,
`@tfrc/web`, and `@tfrc/app` as **published, versioned dependencies**.
This repo contains the design system and its own documentation surface —
never a product.

Consequently, the three packages stop being `"private": true`, and this
repo takes on a publish pipeline it did not previously have. `apps/`
remains reserved for surfaces that document or verify the system itself
(`apps/docs`), not for anything a customer uses.

## Consequences

- The boundary in Article VI stops being a repo-layout convention and
  becomes a dependency-graph fact. A product repo that installs
  `@tfrc/app` has no filesystem path by which to reach `@tfrc/web`.
- Products pin a version. `@tfrc/app` moving at the pace of its slowest
  consuming theme (`CONTRIBUTING.md`, Versioning) becomes enforceable
  rather than aspirational, because a product simply doesn't upgrade
  until it chooses to.
- A product deadline can no longer pressure a token change, because the
  product and the token live in different repos with different review.
- **This makes the first product slower to start.** There is now a
  publish step, a registry decision, and a version bump between "change
  a token" and "see it in the product". A monorepo would not have that.
  We accept it: the cost is front-loaded and fixed, whereas an eroded
  system boundary costs continuously and is hard to detect early.
- **It opens a hole the existing lint scripts cannot see.** Once these
  packages are installed from a registry, nothing in this repo can stop
  a consumer from importing `@tfrc/web` and `@tfrc/app` into the same
  bundle, or from using `--color-gain` as a decorative accent. Both are
  forbidden by Articles VI and V respectively, and both were previously
  unreachable states because the only consumers were inside this repo.
  Article II therefore obliges us to ship a check a *consumer* can run,
  not only one we run on ourselves. That work is specced in
  `specs/002-product-consumption-contract/`; until it exists, the two
  articles are enforced by documentation alone at the consumer boundary,
  which is a known, recorded weakness and not an acceptable end state.
- Native clients remain unsolved. `@tfrc/app` ships CSS, and a native
  runtime cannot consume CSS. Deliberately not solved here — see
  Alternatives.

## Alternatives considered

- **Monorepo: add `apps/website` and `apps/finance`.** Rejected.
  `apps/*` is already globbed by the workspace, so this was nearly free
  to do, which is precisely the danger — it makes eroding the boundary
  the path of least resistance. It also puts product iteration speed and
  system stability in direct competition inside one review process.
- **A fourth package per product (`packages/finance`).** Rejected, and
  forbidden: Article VII caps the system at three top-level packages and
  states that a new product line is a theme file. `themes/finance.css`
  already exists and is the correct home.
- **Renaming `web`/`app` to something less project-like** (e.g.
  `@tfrc/marketing` and `@tfrc/product`). Genuinely tempting, since the
  names caused the misreading that prompted this ADR. Rejected for now:
  a rename is a breaking change to the public API of all three packages
  to fix a documentation failure, and the documentation failure is
  cheaper to fix directly. Revisit only if the confusion recurs after
  `ARCHITECTURE.md` is clearer. Recorded here so the option isn't
  re-derived from scratch.
- **Extracting tokens to a platform-neutral source (JSON, Style
  Dictionary) now, so native works later.** Rejected as speculative
  under Article VII, and it would introduce exactly the
  token-abstraction layer Article VIII forbids. The native client does
  not exist and its runtime is unchosen; building for it now means
  guessing twice. When a native client is actually starting, it gets its
  own spec and, if it needs a neutral token source, its own ADR
  amending Article VIII.
