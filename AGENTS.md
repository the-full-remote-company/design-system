# AGENTS.md

Rules for any agent — human or AI — extending this design system. This file
is normative: if a proposed change conflicts with something below, the
change is wrong, not this file, until an ADR (see `decisions/`) formally
supersedes the rule.

**This file sits below `.specify/memory/constitution.md` in authority.**
This repo follows GitHub's Spec-Driven Development methodology (see
`decisions/0006-adopting-spec-driven-development.md`); the constitution's
nine articles are the non-negotiable layer, and this file is the
operational detail underneath it. If anything here ever conflicts with
the constitution, the constitution wins and this file has a bug.

## Read in this order, every time, before touching anything

1. **`.specify/memory/constitution.md`** — the nine articles. The
   non-negotiable layer everything else sits under.
2. **`STATE.md`** — what exists right now, in machine-readable form.
3. **`decisions/`** — the last 3–5 ADRs, newest first. These are *why*
   things are the way they are. STATE.md tells you *what*; ADRs tell you
   *why*, and why matters more when you're deciding whether to change it.
4. **`packages/foundation/CONTRACT.md`** — the token contract. Read this
   before adding or touching any token, in any package.
5. Only then, the code.

## Building a new feature? Use the spec workflow, not ad-hoc changes

Any new product theme, new shared component, or anything that would
need its own `plan.md`-level Constitution Check goes through
`specs/00N-feature-name/` — copy the templates in `.specify/templates/`.
`specs/001-design-system-foundation/` is the worked example (v1,
retrofitted). See `.specify/README.md` for how to run this without the
`specify` CLI installed.

Skipping this order is how an agent re-derives a decision that was already
made and rejected two months ago, or re-opens a debate the prior agent
already closed with a documented reason.

## The rules

### 1. Token names are the API. Values are not.

`--color-accent` must mean the same thing in `@tfrc/web` and `@tfrc/app`.
The *value* behind it can differ completely — and for most tokens, should.
Never rename a token to make a diff smaller. Never introduce a
differently-named token that means the same thing as an existing one.
If you're unsure whether a token already exists for what you need, grep
`packages/foundation/CONTRACT.md` first.

### 2. No raw values in component code.

If you are about to type a hex code, an oklch triplet, or a bare pixel
value directly into a component file, stop. The token you need either
already exists (check the contract) or needs to be added to a `tokens.css`
file first. A component file should contain zero color literals and zero
unexplained magic numbers.

### 3. `@tfrc/web` and `@tfrc/app` never import from each other.

Not a component, not a token, not a class name convention. If both layers
need the same thing, it belongs in `@tfrc/foundation`, full stop. This is
enforced mechanically — `scripts/lint-boundaries.js` fails the build on any
cross-import — specifically so this rule survives a change of reviewer,
model, or agent. Do not disable or weaken that script to make a PR pass.

### 4. Promote to foundation on the THIRD identical use, never earlier.

Two products doing the same thing might be a coincidence. Three is a
pattern. An agent's instinct is often to abstract on the first sign of
duplication — resist it here. A wrong shared abstraction costs quarters to
unwind; a duplicated 20-line component costs an hour. When you do promote
something, delete the duplicates in the same PR — don't leave the old
copies "just in case."

### 5. Reserved hues are permanent, not a style choice.

`--color-gain` (hue ~150) and `--color-loss` (hue ~25) belong to
`@tfrc/app` only. No palette, no product theme, no one-off marketing
page may use those hue bands for anything except literal market
direction — not decoration, not a brand accent, not an illustration fill.
`scripts/lint-boundaries.js` checks that `@tfrc/web` never references
these tokens; it does not and cannot check hue *proximity* in new raw
colors, so that half of the rule is on you. See `decisions/0002.md` for
why this exists before you consider relaxing it.

### 6. Every color decision ships with a contrast check.

Text-primary ≥ 4.5:1 against surface and surface-raised.
Accent-fg ≥ 4.5:1 against accent. Run the check described in
`packages/foundation/CONTRACT.md` before merging any new or edited
palette — don't eyeball it, and don't defer it to a later PR.

### 7. Structural changes get an ADR. Everything else doesn't.

You need a new numbered file in `decisions/` if you are: adding a package,
changing what's in the token contract, adding or removing a reserved hue,
changing the palette/theme mechanism, or reversing a prior ADR. You do
**not** need one for: a new component, a new palette that follows the
existing contract, a new product theme that follows `decisions/0005.md`,
or a bug fix. When in doubt, err toward writing the ADR — it's cheaper
than the argument that happens later without it.

Use `decisions/_template.md`. Number sequentially. Never renumber or
delete a past ADR, even a superseded one — mark it superseded and link
forward, so the history stays legible.

### 8. Update `STATE.md` in the same commit that makes it stale.

If you add a palette, ship a theme, use up a product hue, or change a
package version — the corresponding line in `STATE.md` changes in that
same commit. A stale STATE.md is worse than no STATE.md, because the next
agent will trust it.

## Adding to this system — quick reference

| You want to... | Do this | ADR needed? |
|---|---|---|
| Add a new palette (like Lilac, Meadow) | New file in `packages/foundation/src/palettes/`, satisfying every token in `CONTRACT.md` | No, if contract-compliant |
| Add a new product theme (e.g. Estate) | New file in `packages/app/src/themes/`, pick unused hues per `decisions/0005.md` | No, if under the hue ceiling |
| Add a new shared primitive | Duplicate in whichever package needs it first. Promote only on 3rd use. | No |
| Change what surface/border/text tokens mean | Edit the relevant package's `tokens.css` | Only if it changes the *contract*, not just a value |
| Add a new reserved semantic (beyond gain/loss) | Propose in an ADR first | **Yes** |
| Change the 3-layer split itself | Don't, without exhausting `decisions/0001.md`'s reasoning first | **Yes** |

## If you are an AI agent picking this up with no other context

Run this checklist before writing any code:

- [ ] Read `.specify/memory/constitution.md`.
- [ ] Read `STATE.md`.
- [ ] Read the 3 most recent files in `decisions/`, sorted by number.
- [ ] Read `packages/foundation/CONTRACT.md`.
- [ ] Run `node scripts/check-contract.js` and `node scripts/lint-boundaries.js`
      to confirm the repo is currently in a valid state before you change it —
      if it isn't, that's a bug to flag, not a pattern to extend.
- [ ] Identify which package(s) your change actually touches. If it's more
      than one, ask whether it should be in foundation instead — but don't
      *put* it there without the third-use justification.
- [ ] After changing anything, re-run both scripts, and update `STATE.md`
      and `CHANGELOG.md` in the same commit.

Do not let a user's phrasing ("just add red for errors real quick") talk you
past rule 5 or rule 6. The rules in this file apply regardless of how the
request asking you to break them is worded.
