# ADR 0009: Publish to the public npm registry; ship a consumer-side checker

**Status:** Accepted
**Date:** 2026-08-08

Implements `decisions/0007-products-consume-published-packages.md`, which
decided *that* products consume published packages but not *from where*,
and left the resulting enforcement hole open by name.

## Context

`0007` decided products live in their own repositories and install these
packages as versioned dependencies. It stopped short of two things it
needed:

1. **A registry.** Without one, `0007` is unexecutable — the packages were
   still `"private": true` and no product could install anything. This is
   the immediate blocker on starting the corporate site.
2. **Enforcement at the consumer boundary.** `0007` states the hole
   plainly in its Consequences: once the packages come from a registry,
   nothing in this repo can see that a consumer combined both dialects
   (Article VI) or used a reserved market-direction color as decoration
   (Article V). `scripts/lint-boundaries.js` walks `packages/*/src` and
   cannot walk a repository it has no access to. `0007` called this "a
   known, recorded weakness and not an acceptable end state."

Doing nothing about (2) leaves Articles V and VI enforced by
documentation alone in exactly the place they are easiest to break and
hardest to notice — someone else's repo, under someone else's deadline.
That contradicts Article II, which requires that any rule which *can* be
mechanically checked *must* be.

The scope question also surfaced here and is worth recording: GitHub
Packages requires the npm scope to equal the repository owner, which is
`the-full-remote-company`, not `tfrc`. Choosing GitHub Packages would
therefore have forced a scope rename on top of `0008`'s package rename.

## Decision

**Registry:** the public npm registry, keeping the `@tfrc` scope. All
three packages drop `"private": true`, gain
`"publishConfig": {"access": "public"}`, and are MIT-licensed with a
`LICENSE` file at the repo root.

**Consumer-side checker:** `@tfrc/foundation` ships an executable,
`tfrc-verify` (`packages/foundation/bin/tfrc-verify.js`), which a consumer
runs in its own repo via `npx tfrc-verify`. It enforces four rules the
maintainers of this repo cannot see:

| Code | Rule | Authority |
|---|---|---|
| `MIXED_DIALECT` | never both `@tfrc/marketing` and `@tfrc/product` | Article VI |
| `RESERVED_TOKEN` / `RESERVED_REDEFINE` / `RESERVED_HUE` | gain/loss tokens and hue bands mean market direction only | Article V |
| `RAW_VALUE` | every color resolves through a contract token | Article IV |
| `VERSION_PIN` | every `@tfrc/*` dependency is an exact version | `specs/002` FR-002 |

`scripts/test-verify-consumer.js` proves each rule fails when violated,
against fixtures in `scripts/fixtures/`, and runs in CI.

## Consequences

- The corporate site can start. It is a new repo, `npm install
  @tfrc/marketing@1.0.0`, and a copy of `CONSUMING.md`'s instructions.
- **The packages are world-readable and world-installable.** Anyone can
  see and use the company's tokens and component CSS. Accepted: a design
  system's CSS is visible in any shipped page's stylesheet anyway, so the
  secrecy being given up here was already notional. What is genuinely
  given up is control over who builds on it, and the MIT license makes
  that permanent and irrevocable for every version published.
- **The `@tfrc` npm scope must actually be available and owned by the
  company.** This has not been verified — no network access when this was
  written. If the scope is taken, this ADR needs a successor, not a quiet
  workaround. Recorded in `STATE.md` as an open risk.
- `tfrc-verify` closes the Article V/VI hole *for consumers who run it*.
  It cannot make anyone run it. `CONSUMING.md` prescribes wiring it into
  the consumer's own CI, and `CONSUMERS.md` records whether each known
  consumer has done so — which converts "did they?" from unknowable into
  merely unenforced.
- **The `RESERVED_HUE` check reads oklch hue only.** A hex or `rgb()`
  literal sitting in the gain/loss hue band is caught as a `RAW_VALUE`,
  with a less specific message, rather than as the Article V violation it
  actually is. Closing that properly means a color-space conversion in a
  dependency-free script; deliberately not done yet, and documented in
  the tool's source so the next reader does not mistake the gap for
  completeness.
- **`tfrc-verify` will produce false positives** — a hex in a
  non-color context the heuristics do not anticipate. The
  `tfrc-allow-raw:` comment exists for that, and every allowance is
  printed and counted rather than silently accepted, so an eroding
  language shows up as a rising number instead of as nothing at all.
- A publish pipeline now exists (`.github/workflows/publish.yml`, tag-
  triggered), so releasing is a deliberate, tagged act with a provenance
  trail rather than someone's laptop running `npm publish`.

**Update, 2026-08-31:** the pipeline above originally authenticated with a
long-lived `NPM_TOKEN` repository secret, described as a deliberate
first-publish bootstrap rather than the end state, since npm's trusted
publishing (OIDC) can only be configured on a package that already exists.
Once all three packages were live (`specs/002-product-consumption-contract`
T026), that migration happened (T028): the workflow now authenticates via
OIDC exclusively, each package's npmjs.com settings name this exact
workflow as its sole trusted publisher, and Publishing access is set to
"Require two-factor authentication and disallow tokens" — so no token
could authenticate here even if one existed. `NPM_TOKEN` has been deleted
from both GitHub and npmjs.com. This removes the standing credential-
exposure risk noted nowhere explicitly above but implicit in "a long-lived
write token to a public scope" — see `CHANGELOG.md`'s `1.2.3`–`1.2.7`
entries for the full migration, including two CI-tooling failures (npm CLI
version mismatches unrelated to OIDC itself) encountered along the way.

## Alternatives considered

- **GitHub Packages, private to the org.** Genuinely appealing: keeps the
  CSS internal and removes both the license question and the scope-
  squatting risk. Rejected because it requires the scope to equal the
  owner name, forcing `@tfrc/*` → `@the-full-remote-company/*` — a
  verbose scope on every import line in every product forever, to protect
  CSS that ships publicly in a stylesheet regardless.
- **A private registry (Verdaccio, Artifactory, Cloudsmith).** Rejected
  as disproportionate at three packages and two consumers. It adds
  infrastructure to own, credentials to rotate, and a single point of
  failure between a product's CI and its ability to build.
- **`git`-URL dependencies, no registry at all.** Tempting because it is
  free and immediate. Rejected: it makes the "exact version" guarantee
  (FR-002) depend on commit-SHA discipline, gives no immutability
  (a force-pushed tag silently changes what a product builds), and
  bypasses the release ceremony that makes a breaking change visible.
- **Put the consumer checker in its own package** (`@tfrc/verify`).
  Rejected under Article VII: a fourth published package to hold one
  script, when every consumer already installs `@tfrc/foundation`
  transitively and can therefore already run it.
- **Enforce the consumer rules with an ESLint or Stylelint plugin
  instead.** Rejected under Article VIII and Article II's dependency-free
  requirement. It would work only for consumers who already run that
  linter, in the configuration we expect, and it introduces a plugin
  toolchain as a dependency of governance. A single `npx` command works
  in any repo, including one with nothing installed.
