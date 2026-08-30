# STATE

Machine-readable-ish snapshot of where this design system is right now. Read
this file FIRST — before ARCHITECTURE.md, before the decisions/ log, before
touching any code. It exists so an agent picking up this repo cold doesn't
have to reconstruct history to find out what's already decided.

If you make a change that invalidates a line below, update that line in the
same commit. This file drifting out of sync with reality is the single
fastest way this repo becomes unmaintainable for the next agent.

```yaml
repo_version: 1.2.7
last_updated: 2026-08-31
status: All three packages are LIVE on npm, published via trusted
        publishing (OIDC) exclusively — proven, not assumed: v1.2.6
        published 1.0.3 with NO npm token existing anywhere (GitHub secret
        deleted, npm-side token revoked), and v1.2.7 confirms the fully
        locked-down state (Publishing access: "Require two-factor
        authentication and disallow tokens" on all three packages) still
        works. T026 and T028 are both fully done — see
        specs/002-product-consumption-contract/tasks.md for the complete
        history, including two CI-tooling failures along the way (Node
        22.14.0 bundles npm 10.x, which predates OIDC; a subsequent
        `npm@latest` fix had its own Node-version mismatch) — neither was
        an OIDC or npmjs.com configuration problem. CHANGELOG.md's
        1.2.0–1.2.7 entries carry the full narrative. Only T027 remains
        open: proving SC-001 by having someone unfamiliar with this repo
        build a page from CONSUMING.md alone. See decisions/0008.md and
        0009.md (dated addendum recording the OIDC migration).

spec_driven_development:
  adopted: true
  constitution_version: 1.0.1     # PATCH: identifier rename + Article II
                                  # clarification. No rule changed.
  constitution_path: .specify/memory/constitution.md
  specs_retrofitted: [001-design-system-foundation]
  specs_implemented: [002-product-consumption-contract]
  cli_actually_run: false   # no network access when this was built — see
                             # .specify/README.md before running the real
                             # `specify` CLI against this repo

packages:                     # renamed 2026-08-08 by decisions/0008.md.
  "@tfrc/foundation": 1.0.4   # target of v1.2.7, published via OIDC with
  "@tfrc/marketing":  1.0.4   # Publishing access fully locked down
  "@tfrc/product":    1.0.4   # (tokens disallowed at the registry, not
                              # just absent from CI) — verify against the
                              # registry before trusting this if it's been
                              # a while. Old names were never published,
                              # so 1.0.0 under the new names was a first
                              # release, not a successor.

publishing:
  registry: https://registry.npmjs.org   # public. decisions/0009.md
  scope: "@tfrc"                          # requires an npm ORG literally
                                          # named "tfrc" — a scope is not
                                          # claimed by first publish, it is
                                          # granted with the org. See
                                          # specs/002 tasks.md T025's
                                          # 2026-08-31 correction.
  license: MIT                            # LICENSE at repo root
  private: false                          # all three, as of 1.2.0
  published_yet: true                     # confirmed on the registry,
                                          # all three at 1.0.4 via OIDC,
                                          # 2026-08-31.
  auth: OIDC only (trusted publishing)    # T028 complete. No NPM_TOKEN
                                          # exists on GitHub OR npmjs.com —
                                          # both revoked. Each package's
                                          # npmjs.com Publishing access is
                                          # "Require two-factor
                                          # authentication and disallow
                                          # tokens", so a token literally
                                          # cannot authenticate here even
                                          # if one existed. Trusted
                                          # publisher: GitHub Actions,
                                          # the-full-remote-company/
                                          # design-system, workflow
                                          # publish.yml. Proven by v1.2.6
                                          # (1.0.3 published with zero
                                          # tokens anywhere) and confirmed
                                          # again by v1.2.7 under the fully
                                          # locked-down setting. Full
                                          # migration history, including
                                          # two CI-tooling failures
                                          # unrelated to OIDC itself, in
                                          # CHANGELOG.md's 1.2.3–1.2.7
                                          # entries and specs/002
                                          # tasks.md's T028.
  pipeline: .github/workflows/publish.yml # tag-triggered, verifies first
  publish_order: [foundation, marketing, product]  # dialects depend on
                                          # an exact foundation version

consumer_verification:          # the half of governance that runs OUTSIDE
                                # this repo. decisions/0009.md, specs/002.
  tool: packages/foundation/bin/tfrc-verify.js   # bin name: tfrc-verify
  invoked_by_consumers_as: "npx tfrc-verify"
  self_test: scripts/test-verify-consumer.js     # runs in CI
  fixtures: scripts/fixtures/consumer-*          # one per violation code;
                                                 # most deliberately broken
  rules_enforced:
    - MIXED_DIALECT       # never both dialects        (Article VI)
    - RESERVED_TOKEN      # marketing using gain/loss  (Article V)
    - RESERVED_REDEFINE   # consumer redefines them    (Article V)
    - RESERVED_HUE        # raw oklch in reserved band (Article V)
    - RAW_VALUE           # any raw color literal      (Article IV)
    - VERSION_PIN         # non-exact @tfrc/* dep      (specs/002 FR-002)
    - NO_MANIFEST         # no package.json to read    (precondition)
    - NO_DIALECT          # neither dialect present    (precondition)
  known_limit: RESERVED_HUE reads oklch hue only. A hex or rgb() literal
               inside a reserved band is caught merely as RAW_VALUE.

consumers: none_yet          # see CONSUMERS.md. Two imminent: the company
                             # website (@tfrc/marketing) and the personal
                             # finance app (@tfrc/product + finance theme).
                             # Products live in their OWN repos —
                             # decisions/0007.md. Never add one to apps/.

active_palette: meridian      # packages/foundation/src/palettes/meridian.css
                                # the only palette wired into a shipped package.
alternate_palettes_on_file:    # designed, documented, NOT wired into any package.
  - lilac                     # packages/foundation/src/palettes/lilac.css
  - meadow                    # packages/foundation/src/palettes/meadow.css
  - daylight                  # packages/foundation/src/palettes/daylight.css
                                # switching active_palette = point marketing/product
                                # tokens.css at a different palette file. See decisions/0003.

reserved_hue_bands:             # @tfrc/product only. @tfrc/marketing must never
                                 # define or reference --color-gain / --color-loss.
                                 # Enforced by scripts/lint-boundaries.js in this
                                 # repo, and by tfrc-verify in consumer repos.
  gain: "130–170"               # oklch hue, currently 150
  loss: "5–40"                  # oklch hue, currently 25

product_hues_in_use:            # portfolio product spectrum — @tfrc/product only.
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

themes_shipped_on_product_layer:
  - finance    # packages/product/src/themes/finance.css — the only theme so far.

open_risks:                      # unverified assumptions that would need a
                                 # decision reversed, not a patch, if wrong.
  - tfrc-verify's raw-value detection is heuristic and will produce some
    false positives. The tfrc-allow-raw escape hatch exists for those, and
    every use of it is printed and counted so erosion stays visible.

resolved_risks:
  - the "@tfrc" npm scope is real, owned by the company, and all three
    packages are published on it. The npm org `tfrc` was created, an
    `NPM_TOKEN` with publish rights was added, and `v1.2.0` was tagged and
    published successfully on 2026-08-30 — specs/002 T026 is done. (Earlier
    entries here said the scope would be "claimed automatically by
    whichever account first publishes to it" — that was wrong for a scope
    this specific; a scope is granted only by registering a user or org of
    that exact name. Corrected in specs/002 tasks.md T025.)
  - publishing no longer depends on a long-lived NPM_TOKEN. specs/002 T028
    migrated to npm trusted publishing (OIDC), completed and proven
    2026-08-31: v1.2.6 published with no token existing anywhere (GitHub
    secret deleted, npm-side token revoked), and Publishing access on all
    three packages is set to disallow tokens entirely, not just lack one.
    The migration took more attempts than planned — two CI-tooling
    failures (Node 22.14.0 bundles npm 10.x, which predates OIDC; a
    subsequent npm-upgrade fix had its own Node-version mismatch) — see
    CHANGELOG.md's 1.2.3–1.2.7 entries and specs/002 tasks.md's T028 for
    the full narrative.

known_gaps_for_v1.3:             # intentionally out of scope, not
                                 # forgotten. Don't silently re-decide these —
                                 # open an ADR first if you're tackling one.
  - packages are published (T026 done, 2026-08-30) but FR-001 is still
    unproven in the sense that matters: no real consumer has installed a
    real package yet (see CONSUMERS.md, still "none yet"). T027 tracks
    this specifically.
  - no icon set yet (foundation/src/icons/ does not exist)
  - apps/docs is a stub; live prototypes exist only as chat deliverables,
    not wired to consume the packages in this repo
  - no build tooling wired (no actual `pnpm install` has been run — this
    repo has never left this container with node_modules present)
  - no visual regression / contrast CI check, only static grep-based lint
  - no real estate theme yet (packages/product/src/themes/estate.css does
    not exist)
  - NO PATH FOR A NATIVE CLIENT. @tfrc/product ships CSS; a native runtime
    can't consume it. Deliberately unsolved — the runtime is unchosen and
    the product doesn't exist. Needs its own spec, and an ADR amending
    Article VIII if it needs a platform-neutral token source. See
    decisions/0007.md's Alternatives before "just adding a JSON export".
  - the actual `specify` CLI has never been run against this repo (no
    network access when it was built) — .specify/ was hand-authored to
    match documented conventions; see .specify/README.md before running
    the real CLI, especially regarding memory/constitution.md
  - SC-001 of specs/002 is asserted, not measured: nobody unfamiliar with
    this repo has yet built a page from CONSUMING.md alone
```
