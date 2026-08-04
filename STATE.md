# STATE

Machine-readable-ish snapshot of where this design system is right now. Read
this file FIRST — before ARCHITECTURE.md, before the decisions/ log, before
touching any code. It exists so an agent picking up this repo cold doesn't
have to reconstruct history to find out what's already decided.

If you make a change that invalidates a line below, update that line in the
same commit. This file drifting out of sync with reality is the single
fastest way this repo becomes unmaintainable for the next agent.

```yaml
repo_version: 1.1.0
last_updated: 2026-08-04
status: v1.0.0 packages unchanged; Spec-Driven Development conventions
        adopted on top (constitution + specs/ workflow). See decisions/0006.md.

spec_driven_development:
  adopted: true
  constitution_version: 1.0.0
  constitution_path: .specify/memory/constitution.md
  specs_retrofitted: [001-design-system-foundation]
  cli_actually_run: false   # no network access when this was built — see
                             # .specify/README.md before running the real
                             # `specify` CLI against this repo

packages:
  "@tfrc/foundation": 1.0.0
  "@tfrc/web":        1.0.0
  "@tfrc/app":         1.0.0

active_palette: meridian      # packages/foundation/src/palettes/meridian.css
                                # the only palette wired into a shipped package.
alternate_palettes_on_file:    # designed, documented, NOT wired into any package.
  - lilac                     # packages/foundation/src/palettes/lilac.css
  - meadow                    # packages/foundation/src/palettes/meadow.css
  - daylight                  # packages/foundation/src/palettes/daylight.css
                                # switching active_palette = point web/app tokens.css
                                # at a different palette file. See decisions/0003.

reserved_hue_bands:             # @tfrc/app only. @tfrc/web must never define or
                                 # reference --color-gain / --color-loss. Enforced
                                 # by scripts/lint-boundaries.js.
  gain: "130–170"               # oklch hue, currently 150
  loss: "5–40"                  # oklch hue, currently 25

product_hues_in_use:            # portfolio product spectrum — @tfrc/app only.
                                 # constant L=.545 C=.185(ish), hue varies. See
                                 # decisions/0005. Before adding a 7th product,
                                 # read that ADR — 8 is the documented ceiling.
  capital:  275   # indigo   — investing (also the parent brand accent)
  estate:   65    # gold     — property
  lending:  195   # teal
  insight:  235   # lagoon blue (also --color-focus and --color-info-line)
  legal:    305   # violet
  market:   340   # rose
  free_hues_below_8_ceiling: 2

themes_shipped_on_app_layer:
  - finance    # packages/app/src/themes/finance.css — the only theme so far.

known_gaps_for_v1.2:             # intentionally out of scope, not
                                 # forgotten. Don't silently re-decide these —
                                 # open an ADR first if you're tackling one.
  - no icon set yet (foundation/src/icons/ does not exist)
  - apps/docs is a stub; live prototypes exist only as chat deliverables,
    not wired to consume the packages in this repo
  - no build tooling wired (no actual `pnpm install` has been run — this
    repo has never left this container with node_modules present)
  - no visual regression / contrast CI check, only static grep-based lint
  - no real estate theme yet (packages/app/src/themes/estate.css does not exist)
  - the actual `specify` CLI has never been run against this repo (no
    network access when it was built) — .specify/ was hand-authored to
    match documented conventions; see .specify/README.md before running
    the real CLI, especially regarding memory/constitution.md
  - only specs/001 exists; no new feature has gone through the spec
    workflow yet to prove the templates hold up in practice
```
