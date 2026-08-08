# Contributing

This applies equally to a human contributor and an AI agent working on this
repo — where they differ, it's called out.

## Before you start

1. Read `.specify/memory/constitution.md`, then `STATE.md`, then the
   newest 3 files in `decisions/`, then `packages/foundation/CONTRACT.md`.
   This order is not optional — see `AGENTS.md` for why.
2. Run `node scripts/check-contract.js`, `node scripts/lint-boundaries.js`
   and `node scripts/test-verify-consumer.js` to confirm the repo is
   currently valid. Or just `npm run verify`, which runs all three.

**Building a product rather than the system?** You're in the wrong file —
see `CONSUMING.md`. Products live in their own repositories
(`decisions/0007.md`); nothing customer-facing belongs in this one.

## New feature? Spec it first.

This repo follows Spec-Driven Development
(`decisions/0006-adopting-spec-driven-development.md`). Any change bigger
than a token tweak or a bug fix — a new product theme, a new shared
component, anything with its own design tradeoffs — starts as
`specs/00N-feature-name/spec.md`, using `.specify/templates/spec-template.md`.
Then `plan.md` (with a Constitution Check against Articles VII–IX), then
`tasks.md`. `specs/001-design-system-foundation/` is v1 retrofitted into
this shape — read it as the worked example. See `.specify/README.md` for
how to run this workflow without the `specify` CLI installed.

A small fix — a bug in a token value, a typo, a missing state on an
existing component — does not need a spec. Use judgment: if you'd
naturally write an ADR for it per the table below, it's spec-sized.

## Making a change

- **New component?** Figure out which package needs it first. Build it
  there. Do not add it to `@tfrc/foundation` unless it already exists,
  identically, in both `@tfrc/marketing` and `@tfrc/product` — see AGENTS.md rule 4.
- **New token?** Check `CONTRACT.md` first — it may already exist under a
  name you didn't expect. If it's genuinely new and every palette needs to
  define it, it's a contract change and needs an ADR.
- **New palette or theme?** Check `STATE.md` for hues already in use before
  picking a color. Follow `decisions/0005.md` if it's a product theme.
- **Touching the boundary between web and app?** Don't. Read
  `decisions/0001.md` again, then ask whether the thing you need actually
  belongs in `@tfrc/foundation`.

## Before opening a PR

- [ ] `node scripts/check-contract.js` passes
- [ ] `node scripts/lint-boundaries.js` passes
- [ ] `node scripts/test-verify-consumer.js` passes
- [ ] If you added a rule a consumer could break, it's implemented in
      `packages/foundation/bin/tfrc-verify.js` *and* has a fixture in
      `scripts/fixtures/` that proves it fails
- [ ] `STATE.md` updated if anything it describes changed
- [ ] `CONSUMERS.md` updated if a consumer's dialect or version changed
- [ ] `CHANGELOG.md` has an entry, and it says whether the change is
      breaking for an existing consumer
- [ ] New structural decisions have an ADR in `decisions/`
- [ ] No raw color or magic-number literals introduced in component files

## Versioning and releasing

- `@tfrc/foundation` is versioned strictly. A breaking change is a major
  bump with a migration note in `CHANGELOG.md`. Treat it like a public API.
- `@tfrc/marketing` can move fast — it has one consumer.
- `@tfrc/product` moves at the pace of its slowest consuming product theme.
  This feels slow on purpose. It is the tradeoff that makes "one product
  system, not one per product" actually hold.

Consumers pin exact versions (`tfrc-verify` enforces it), so nothing you
merge changes a product's appearance until that product chooses to upgrade.
That is the safety net; it is not a licence to be careless with a major
bump, because a product that cannot afford to upgrade is a product stuck on
an old version of the language.

To release: bump the versions in `packages/*/package.json`, update
`CHANGELOG.md` and `STATE.md` in the same commit, then push a `v*` tag.
`.github/workflows/publish.yml` re-runs every check before publishing —
a tag is not a licence to skip the gate — and publishes `@tfrc/foundation`
first, since both dialects depend on an exact version of it.

## For AI agents specifically

If a request conflicts with a rule in `AGENTS.md`, say so and propose the
compliant alternative rather than quietly complying — a prior agent (or a
human) made that rule deliberately, and it's documented in `decisions/` for
exactly this situation. "The user asked for it" is not sufficient reason to
skip a contrast check, cross an import boundary, or use a reserved hue for
decoration.
