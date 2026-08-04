# Contributing

This applies equally to a human contributor and an AI agent working on this
repo — where they differ, it's called out.

## Before you start

1. Read `STATE.md`, then the newest 3 files in `decisions/`, then
   `packages/foundation/CONTRACT.md`. This order is not optional — see
   `AGENTS.md` for why.
2. Run `node scripts/check-contract.js` and `node scripts/lint-boundaries.js`
   to confirm the repo is currently valid.

## Making a change

- **New component?** Figure out which package needs it first. Build it
  there. Do not add it to `@tfrc/foundation` unless it already exists,
  identically, in both `@tfrc/web` and `@tfrc/app` — see AGENTS.md rule 4.
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
- [ ] `STATE.md` updated if anything it describes changed
- [ ] `CHANGELOG.md` has an entry
- [ ] New structural decisions have an ADR in `decisions/`
- [ ] No raw color or magic-number literals introduced in component files

## Versioning

- `@tfrc/foundation` is versioned strictly. A breaking change is a major
  bump with a migration note in `CHANGELOG.md`. Treat it like a public API.
- `@tfrc/web` can move fast — it has one consumer.
- `@tfrc/app` moves at the pace of its slowest consuming product theme.
  This feels slow on purpose. It is the tradeoff that makes "one product
  system, not one per product" actually hold.

## For AI agents specifically

If a request conflicts with a rule in `AGENTS.md`, say so and propose the
compliant alternative rather than quietly complying — a prior agent (or a
human) made that rule deliberately, and it's documented in `decisions/` for
exactly this situation. "The user asked for it" is not sufficient reason to
skip a contrast check, cross an import boundary, or use a reserved hue for
decoration.
