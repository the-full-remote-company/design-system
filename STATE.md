# STATE

Machine-readable-ish snapshot of where this design system is right now. Read
this file FIRST — before ARCHITECTURE.md, before the decisions/ log, before
touching any code. It exists so an agent picking up this repo cold doesn't
have to reconstruct history to find out what's already decided.

If you make a change that invalidates a line below, update that line in the
same commit. This file drifting out of sync with reality is the single
fastest way this repo becomes unmaintainable for the next agent.

```yaml
repo_version: 1.2.5
last_updated: 2026-08-31
status: T026 is fully done — see resolved_risks and T025-T027 history in
        specs/002 tasks.md. Mid-T028: migrating off the long-lived
        NPM_TOKEN to npm trusted publishing (OIDC). v1.2.3 (1.0.2)
        published successfully with a trusted publisher configured AND
        NODE_AUTH_TOKEN still present as a fallback — genuinely ambiguous
        evidence, since --provenance signs a Sigstore attestation using
        GitHub's OIDC identity regardless of which credential actually
        authenticated the registry write. The NPM_TOKEN GitHub secret was
        then deleted entirely for v1.2.4, which failed immediately with
        ENEEDAUTH — before any registry write was attempted, meaning OIDC
        was never even tried. Root cause: Node 22.14.0 (set via
        setup-node's node-version) almost certainly still bundles npm
        10.x, which has no concept of OIDC at all; node-version controls
        only the Node binary, not the npm CLI version, and this went
        unverified until it failed. v1.2.5 adds an explicit
        `npm install -g npm@latest` step plus a version-diagnostic log
        line. NPM_TOKEN remains deleted — this is still the decisive,
        no-fallback test, now with the actual prerequisite npm version.
        Verify against the registry after this tag runs, not just CI's
        exit code. See decisions/0008.md, 0009.md, and
        specs/002-product-consumption-contract/tasks.md T025–T028.

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
  "@tfrc/foundation": 1.0.3   # target of v1.2.5 — verify against the
  "@tfrc/marketing":  1.0.3   # registry before trusting this; v1.2.4's
  "@tfrc/product":    1.0.3   # attempt at 1.0.3 failed with ENEEDAUTH
                              # before any registry write (npm CLI version
                              # gap, now fixed), so this is the same target
                              # version retried, not a new one. 1.0.2
                              # confirmed live 2026-08-31, but with the
                              # token still present as a fallback, so it
                              # didn't prove OIDC specifically. Old names
                              # were never published, so 1.0.0 under the
                              # new names was a first release, not a
                              # successor.

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
                                          # all three at 1.0.2, 2026-08-31.
                                          # v1.2.4's attempt at 1.0.3 failed
                                          # with ENEEDAUTH (npm CLI version
                                          # gap — see auth note below).
                                          # v1.2.5 fixes the CLI version and
                                          # retries the same 1.0.3 target —
                                          # verify before trusting past
                                          # this line.
  auth: OIDC (NPM_TOKEN secret deleted)   # mid-migration (T028). Trusted
                                          # publisher configured on npmjs.com
                                          # for all three packages.
                                          # NPM_TOKEN was deleted ahead of
                                          # v1.2.4 to force an unambiguous
                                          # test, which instead surfaced
                                          # that Node 22.14.0's bundled npm
                                          # (10.x) predates OIDC support —
                                          # setup-node's node-version input
                                          # controls only the Node binary,
                                          # not the bundled npm CLI version,
                                          # which went unverified until
                                          # this failure. v1.2.5 adds an
                                          # explicit `npm install -g
                                          # npm@latest` step before
                                          # publishing. If v1.2.5 succeeds,
                                          # OIDC is proven and the real
                                          # npm-side token (still valid,
                                          # separately from the deleted GH
                                          # secret) needs revoking on
                                          # npmjs.com. If it fails again,
                                          # a new NPM_TOKEN needs generating
                                          # to restore the fallback while
                                          # debugging continues.
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

known_gaps_for_v1.3:             # intentionally out of scope, not
                                 # forgotten. Don't silently re-decide these —
                                 # open an ADR first if you're tackling one.
  - publishing authenticates with a long-lived NPM_TOKEN, not trusted
    publishing (OIDC). Deliberate bootstrap ordering, not an oversight —
    OIDC can only be configured on a package that already exists, and now
    does (T026 done). Migrate per specs/002 tasks.md T028.
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
