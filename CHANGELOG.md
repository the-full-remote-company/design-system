# Changelog

All notable changes to this repo. Each package also carries its own
version in `package.json` and in `STATE.md`; this file is the human-
readable narrative across all of them.

## 1.3.0 — 2026-09-01

Adds CSS cascade layers across all three packages —
`decisions/0010-cascade-layers-for-consumer-overrides.md`. Without this,
an unlayered design-system stylesheet beats an unlayered consumer utility
of equal or lower specificity regardless of import order, which made
overriding `.btn--primary` or `.field input` from a Tailwind consumer
unreliable or, for `.field input`, effectively impossible without
`!important`.

- **Changed** `packages/foundation/src/base.css`: the reset, `:focus-
  visible`, and reduced-motion block now ship inside `@layer base`. Both
  `:root` custom-property blocks stay unlayered on purpose — layering
  them would let any unlayered `:root` in a consumer's own CSS silently
  win over this system's token values.
- **Changed** `packages/marketing/src/components.css` and
  `packages/product/src/components.css`: every component rule now ships
  inside `@layer components`.
- **Changed** `packages/product/src/themes/finance.css`: `.theme-tag` now
  ships inside `@layer components`; its `:root` block (the theme's hue
  identity) stays unlayered, same reasoning as base.css.
- **Changed** every package's `src/index.css`: now opens with
  `@layer base, components;` as its first line, so the layer order is
  registered even for a consumer that imports one file directly instead
  of the package entry point.
- **Added** the `LAYER_ORDER` rule to `tfrc-verify` (`packages/
  foundation/bin/tfrc-verify.js`): flags an `@layer` statement in a
  consumer's own source that lists `utilities` before `base`/`components`,
  which would silently reinstate the exact problem this release fixes.
  Covered by a new fixture, `scripts/fixtures/consumer-layer-order/`, and
  registered in `scripts/test-verify-consumer.js`.
- **Documented** in `CONSUMING.md`: a new "Cascade layers" section with
  the required `@layer base, components, utilities;` declaration and a
  worked Tailwind v4 example.
- **Behavioral, not breaking.** This changes which rule wins in the rare
  case a consumer's unlayered override happened to rely on this system's
  previously-unlayered CSS beating it. `STATE.md` records `consumers:
  none_yet` as of this release, which is why it ships as MINOR (1.1.0 for
  all three packages) rather than MAJOR — there is no real consumer's
  rendered output that changes.

## 1.2.7 — 2026-08-31

Closes out `specs/002-product-consumption-contract` T028. `1.2.6` proved
OIDC works with no token existing anywhere. Ahead of this tag, each
package's npmjs.com Publishing access was set to "Require two-factor
authentication and disallow tokens" — the strict setting that caused an
earlier lockout when it was set *before* OIDC was confirmed working (see
`1.2.1`'s incident) — and the npm-side `NPM_TOKEN` value was revoked
directly, not just removed from GitHub. This release confirms the fully
locked-down end state still publishes correctly, and cleans up
`.github/workflows/publish.yml`: the now-dead `NODE_AUTH_TOKEN` env var is
removed from all three publish steps (Publishing access makes a token
unusable here regardless, so leaving it wired would misleadingly imply a
fallback still exists), and the top-of-file comment block now describes
OIDC as the actual mechanism instead of a bootstrap-in-progress.

`decisions/0009.md` gets a dated addendum (not a rewrite — `AGENTS.md`
rule 7) recording OIDC as the auth mechanism. All three packages bump to
`1.0.4` to force the confirmation publish, for the same reason every prior
release in this sequence needed a real version bump: skip-if-already-
published logic means retagging at a live version proves nothing.

T028 is done. The full migration took five tagged releases (`1.2.3`
through `1.2.7`) against a seven-step plan that looked complete on paper —
two of those releases exist purely because the plan didn't anticipate
that Node's `node-version` doesn't pin npm's version, and that `npm@latest`
is itself a moving target that can outrun a pinned Node version. Neither
failure had anything to do with OIDC or npmjs.com configuration.

## 1.2.6 — 2026-08-31

Fixes `.github/workflows/publish.yml` again, not any package. `1.2.5`'s
`npm install -g npm@latest` itself failed with `EBADENGINE`: npm's current
`latest` is `12.0.2`, which requires Node `^22.22.2` or later — newer than
the `22.14.0` pinned in the same job. `@latest` is a moving target that
had already outrun the Node version chosen to satisfy OIDC's *minimum*
requirement; those are two different constraints that both need
satisfying simultaneously, not one implying the other.

- **Changed** the npm upgrade step to pin an exact version,
  `npm@11.5.1` — the documented minimum for trusted publishing — rather
  than `@latest`. Checked its own `engines` field
  (`^20.17.0 || >=22.9.0`) against the published package manifest before
  pinning, so this isn't another unverified assumption.
- No package version bump: `1.0.3` still hasn't reached the registry
  (confirmed against it directly), so this retries the same target again.

## 1.2.5 — 2026-08-31

Fixes `.github/workflows/publish.yml` itself, not any package. `1.2.4`'s
attempt to publish `1.0.3` with no `NPM_TOKEN` failed immediately with
`ENEEDAUTH` — before even attempting a registry write, meaning OIDC was
never tried at all. Root cause: `actions/setup-node@v4`'s `node-version`
input controls only the Node binary, not the npm CLI it bundles. Node
`22.14.0`'s own release notes show no npm version bump, so it almost
certainly still ships npm 10.x — which has no concept of trusted
publishing at all. Assuming Node's minimum-supported version implied a
matching minimum npm version was wrong and went unverified until this
failure surfaced it.

- **Added** an explicit `npm install -g npm@latest` step immediately after
  `setup-node`, plus a diagnostic printing both `node --version` and
  `npm --version` into the log, so this can be confirmed directly in any
  future run instead of inferred.
- No package version bump: `1.0.3` never actually reached the registry
  (the previous failure happened before any write), so this retries the
  same target version rather than advancing past it again.

## 1.2.4 — 2026-08-31

No functional change to any package. Second and decisive verification
release for T028. `1.2.3` proved a real publish succeeds with a trusted
publisher configured *and* `NODE_AUTH_TOKEN` still present as a fallback —
which is genuinely ambiguous evidence, since `--provenance` always signs a
Sigstore attestation using GitHub's OIDC identity regardless of which
credential actually authenticated the registry write, and nothing on
npmjs.com's UI surfaced which path was taken either.

The `NPM_TOKEN` GitHub repository secret has been deleted entirely ahead
of this tag — not blanked, removed. If this release succeeds,
`NODE_AUTH_TOKEN` resolves to an empty string with no fallback behind it
at all, which makes a successful publish unambiguous proof that trusted
publishing is doing the work. If it fails, the trusted publisher
configuration has a real problem to debug, caught here rather than after
permanently locking the registry down.

All three packages bump to `1.0.3` for the same reason `1.2.3` bumped to
`1.0.2`: skip-if-already-published logic means retagging at a live
version proves nothing.

## 1.2.3 — 2026-08-31

No functional change to any package. This is a verification release for
`specs/002-product-consumption-contract` T028 — the migration off the
long-lived `NPM_TOKEN` to npm's trusted publishing (OIDC). All three
packages bump to `1.0.2`, purely to force a real publish attempt: with
`publish.yml`'s skip-if-already-published logic from `1.2.2`, re-tagging
at `1.0.1` would just skip every step and prove nothing.

Ahead of this tag: `.github/workflows/publish.yml`'s publish job now runs
on Node `22.14.0` (trusted publishing requires npm >= 11.5.1, which Node
20's bundled npm 10.x cannot provide), and a trusted publisher — GitHub
Actions, `the-full-remote-company/design-system`, workflow `publish.yml`
— was configured on npmjs.com for all three packages. `NODE_AUTH_TOKEN`
is still wired as a fallback; npm's CLI tries OIDC first and only falls
back to the token if trusted publishing isn't configured, so this release
is the actual test of whether that configuration works. If it does, T028's
remaining steps (disallow tokens per package, revoke and delete
`NPM_TOKEN`) follow in a subsequent change once confirmed on the registry.

## 1.2.2 — 2026-08-31

No package changed. This release fixes `.github/workflows/publish.yml`
itself, so it could finish what `1.2.1` started.

`1.2.1`'s publish stalled on `@tfrc/product`: a per-package "Publishing
access" setting on npmjs.com rejected the automation token for `product`
specifically, after `foundation` and `marketing` had already published
successfully at `1.0.1`. Once that setting was corrected, the only way to
retry was GitHub's "Re-run failed jobs" — which re-runs the entire
`publish` job from its first step, not just the step that failed. Every
retry therefore re-attempted `foundation`, which now correctly refused to
publish over its own already-live `1.0.1`, and the job never reached
`product` again. Three retries produced the same result.

- **Fixed** each of the three publish steps to check the registry for its
  own exact version first and skip with a message if it's already there,
  instead of unconditionally attempting `npm publish`. This is what makes
  a partial-failure retry actually recoverable: `foundation` and
  `marketing` now skip cleanly, and the job reaches `product` regardless
  of how many times the job is re-run.
- This is a workflow-robustness fix, not a policy or content change — no
  package version bumps with it. `@tfrc/product` still targets `1.0.1`,
  which never successfully published; this release exists to let that
  attempt actually reach the registry.

## 1.2.1 — 2026-08-31

Patch release. `v1.2.0` was tagged and published successfully — all three
packages are live at `1.0.0` — but the tag was cut from a commit that
predated a documentation and test-coverage pass caught immediately
afterward, so `@tfrc/product@1.0.0`'s published description permanently
carries an inflated "~40 components" claim (npm does not allow editing
published package metadata). This release corrects it going forward.

All three packages bump to `1.0.1` together, even though only
`@tfrc/product`'s content changed. `.github/workflows/publish.yml`
publishes all three unconditionally on every tag; publishing only one
would make `foundation`'s step fail on the *next* release (version already
exists on the registry), which would stop the pipeline before it ever
reached `product`. Bumping in lockstep avoids re-hitting this immediately.

- **Fixed** the component count for `@tfrc/product`, which claimed "~40
  components" while shipping 23 selectors across 8 families (button,
  field, list/row, balance, amount, pill, segmented control, tabs).
  Corrected in `packages/product/package.json`,
  `packages/product/README.md`, `ARCHITECTURE.md` and the root `README.md`.
  The marketing dialect's "~14" was checked against the same convention
  and is accurate, so `@tfrc/marketing` did not need this fix — it bumps
  only because the pipeline publishes in lockstep, not because anything in
  it changed.
- **Documented** `NO_MANIFEST` and `NO_DIALECT` in `CONSUMING.md`'s
  violation table and `STATE.md`'s `rules_enforced`. Both codes have
  always been emitted by `tfrc-verify` — `NO_DIALECT` is the first thing a
  repo that has not yet adopted the system will see — but neither appeared
  in the table a consumer is pointed at on failure.
- **Added** fixtures for the two violation codes that had none, plus one
  that was documented as enforced but never actually asserted:
  `consumer-redefines-reserved` (`RESERVED_REDEFINE`), `consumer-no-dialect`
  (`NO_DIALECT`) and `consumer-no-manifest` (`NO_MANIFEST`).
  `scripts/test-verify-consumer.js` now covers all 8 codes the checker can
  emit, which makes its closing claim — "tfrc-verify enforces every rule
  it documents" — true rather than nearly true.
- **Corrected** a wrong assumption recorded in
  `specs/002-product-consumption-contract/tasks.md`: an npm scope is not
  claimed by whoever publishes into it first, it is granted with a
  registered user or organization of that exact name. `@tfrc` required the
  npm organization `tfrc` to exist before anything could publish to it —
  this was the actual missing first step, now corrected in T025/T026.
- **Recorded** T028 in the same file: migrate off the long-lived
  `NPM_TOKEN` used for this and the `v1.2.0` publish to npm's trusted
  publishing (OIDC), now that packages exist on the registry and the
  per-package configuration OIDC requires is possible. Not done in this
  release.

## 1.2.0 — 2026-08-31

Products can now be built. The two dialect packages were renamed to say
what they actually are, all three packages became publishable, and the
governance that used to stop at this repo's edge now ships to consumers.

**Breaking for anyone who had installed the old packages — which is
nobody.** `@tfrc/web@1.0.0` and `@tfrc/app@1.0.0` were `"private": true`
and never reached a registry, so there is no migration path to document.
This is why the rename happened now rather than later: the window in which
it cost nothing was about to close. See `decisions/0008.md`.

- **Renamed** `@tfrc/web` → `@tfrc/marketing` (`packages/web/` →
  `packages/marketing/`) and `@tfrc/app` → `@tfrc/product`
  (`packages/app/` → `packages/product/`). The old names described a
  delivery platform; the split they encode is one of intent. Package
  *count* is unchanged, so Article VII's ceiling is untouched.
  `decisions/0008.md`.
- **Added** `packages/foundation/bin/tfrc-verify.js`, shipped as the
  `tfrc-verify` executable. A consumer runs `npx tfrc-verify` in its own
  repo to catch mixed dialects, reserved-color misuse, raw color literals,
  and unpinned versions — the rules this repo's own lints cannot see once
  packages are installed from a registry. `decisions/0009.md`.
- **Added** `scripts/test-verify-consumer.js` and `scripts/fixtures/` —
  eight miniature consumer repos covering every violation code the checker
  can emit, asserting the exact codes each produces. Five break a rule on
  purpose, two cover preconditions (no manifest, no dialect adopted), one
  is compliant. Wired into CI, because a governance check nobody has
  watched fail is indistinguishable from one that always passes.
- **Added** `CONSUMING.md` (how an outside repo adopts the language) and
  `CONSUMERS.md` (who has adopted it, and on what version). `CONSUMING.md`
  documents all eight violation codes and the three exit codes, including
  `NO_DIALECT` — which is the first thing a repo that has not yet adopted
  the system will see.
- **Added** `LICENSE` (MIT) and `.github/workflows/publish.yml`, a
  tag-triggered release that re-runs every check before publishing.
- **Changed** all three packages: `"private": true` removed, plus
  `license`, `repository`, `exports`, `files`, `publishConfig`. Target is
  the public npm registry under the `@tfrc` scope. **Nothing is published
  yet** — that needs an `NPM_TOKEN` and a tag.
- **Changed** `scripts/lint-boundaries.js` to also match the pre-rename
  names, so a stale `@import "@tfrc/app"` reports as a boundary violation
  with a useful message instead of a missing-module error downstream.
- **Amended** the constitution to 1.0.1 — identifier rename across
  Articles I, V, VI, VII, plus a clarification to Article II that a check
  for a rule breakable only in a consumer's codebase must be shippable to
  that consumer. No rule added, removed, or reversed.
- **Rewrote** `ARCHITECTURE.md` and `README.md` to state in those words
  that the two dialects are *not* two projects, and that neither is a
  product. This was the documentation fix `decisions/0007.md` identified
  as the real problem and never carried out; the same misreading recurred
  three days later, which is what triggered the rename.
- **Fixed** the component count for `@tfrc/product`, which claimed "~40
  components" in five places while shipping 23 selectors across 8 families
  (button, field, list/row, balance, amount, pill, segmented control,
  tabs). Corrected in `packages/product/package.json`,
  `packages/product/README.md`, `ARCHITECTURE.md` and `README.md`; the
  marketing dialect's "~14" was checked against the same convention and is
  accurate. Caught while preparing the first publish. An inflated count
  invites a consumer to assume a component exists and find out otherwise
  mid-build, so it is corrected before anyone can install it.
- **Fixed** a false claim in `specs/002-product-consumption-contract/spec.md`:
  it stated its review checklist was "run and passing" while
  `checklist.md` did not exist. The checklist now exists, has been run,
  and records its two borderline items rather than suppressing them.
  `plan.md` and `tasks.md` were written to complete the spec workflow.
- **Not done, deliberately:** no native-client support, no
  platform-neutral token export, no product code in this repo. See
  `STATE.md`'s known gaps.

### Post-release note — 2026-08-08

Checked the one open risk this release recorded: whether the `@tfrc` scope
is actually available on public npm. It is — `@tfrc/foundation`,
`@tfrc/marketing`, and `@tfrc/product` all 404, and the scope itself
(not just those three names) returns "Scope not found". See `STATE.md`'s
`resolved_risks`. This does not reserve the scope — npm claims a scope on
first publish, first-come — so `specs/002` T026 (add `NPM_TOKEN`, tag,
publish) is now the only remaining blocker on any consumer installing
anything.

## 1.1.0 — 2026-08-04

Adopted GitHub Spec Kit's Spec-Driven Development conventions on top of
the v1.0.0 packages. No package code changed — this is governance and
process, not a functional release.

- **Added** `.specify/memory/constitution.md` — nine articles, adapted
  for a design-system domain, supreme over `AGENTS.md`/`CONTRIBUTING.md`.
- **Added** `.specify/templates/{spec,plan,tasks,checklist}-template.md`
  for all future feature work.
- **Added** `specs/001-design-system-foundation/` — v1 retrofitted into
  spec/plan/tasks/checklist form, serving as both historical record and
  worked example.
- **Added** `decisions/0006-adopting-spec-driven-development.md`,
  documenting the adoption and its honest adaptations (no CLI access;
  nine articles translated for a CSS/token domain rather than a backend).
- **Updated** `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `STATE.md` to
  reference and defer to the constitution.

## 1.0.0 — 2026-08-04

Initial release.

- **Added** `@tfrc/foundation` 1.0.0 — color ramps (Meridian, active),
  three documented alternates (Lilac, Meadow, Daylight — see
  `decisions/0003.md`), 4px spacing scale, reset, token contract.
- **Added** `@tfrc/web` 1.0.0 — corporate layer. Button, card, stat strip,
  CTA band. Desktop-first, expressive scale.
- **Added** `@tfrc/app` 1.0.0 — product layer. Button, field, pill, amount,
  transaction row, balance card, segmented control, tab bar. Mobile-first,
  44px touch floor, reserved gain/loss tokens.
- **Added** `packages/app/src/themes/finance.css` — the first product
  theme, themed over `@tfrc/app` rather than forked from it.
- **Added** governance: `AGENTS.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`,
  `STATE.md`, five ADRs in `decisions/`.
- **Added** `scripts/lint-boundaries.js` and `scripts/check-contract.js` —
  dependency-free, run and passing as of this release.
- **Fixed** (pre-tag) a false positive in `lint-boundaries.js`: the script
  originally flagged any *mention* of `--color-gain` / `--color-loss`,
  including in explanatory comments. Narrowed to match only definitions
  and `var()` usages before the first release, so comments can keep
  explaining the rule without tripping it.

### Known gaps, deliberately deferred to v1.1
See `STATE.md`'s `known_gaps_for_v1.1` block — icon set, a live docs app
wired to these packages, real build tooling, automated contrast checking,
and a real-estate theme are all out of scope for this release, not
forgotten.
