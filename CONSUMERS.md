# Consumers

Every codebase outside this repo that adopts the visual language, which
dialect it uses, the exact version it is pinned to, and whether it runs
`npx tfrc-verify` in its own CI.

This file exists so a maintainer can answer "what breaks if I change this?"
by reading, not by asking around (`specs/002` FR-009). It is maintained by
hand: at two or three consumers, automated cross-repo discovery would cost
more than it saves.

**Update this file in the same commit that changes what it describes** —
the same rule `STATE.md` lives under (`AGENTS.md` rule 8). A consumer list
that is quietly six months stale is worse than none, because it will be
trusted.

| Consumer | Repo | Dialect | Theme | Pinned version | `tfrc-verify` in CI | Notes |
|---|---|---|---|---|---|---|
| _none yet_ | — | — | — | — | — | Two are imminent; see below. |

## Expected, not yet started

Recorded so their absence reads as "not started" rather than "forgotten".
Neither has a repo yet, and nothing below is a commitment to a date.

- **The Full Remote Company website** — will consume `@tfrc/marketing`.
  The first consumer, and therefore the first real test of
  `CONSUMING.md`: if an engineer cannot get from an empty repo to a
  correctly-styled page using that document alone, the document is the bug
  (`specs/002` SC-001).
- **Personal finance app** (web) — will consume `@tfrc/product` plus
  `themes/finance`. The theme already ships; no design-system change is
  needed to start it (`specs/002` SC-005).
- **Personal finance app** (native, someday) — **has no path yet.**
  `@tfrc/product` ships CSS and a native runtime cannot consume CSS. This
  is deliberately unsolved: the runtime is unchosen and the product does
  not exist, so building for it now means guessing twice. When it actually
  starts it gets its own spec, and — if it needs a platform-neutral token
  source — its own ADR amending Article VIII. See `decisions/0007.md`'s
  Alternatives.

## Adding yourself

1. Read `CONSUMING.md`.
2. Install exactly one dialect, at an exact version.
3. Add `npx tfrc-verify` to your CI.
4. Add a row above, in the same PR that adds the dependency.
