# @tfrc/foundation

Ships to no one directly. Consumed by `@tfrc/web` and `@tfrc/app`.

Contains:
- `src/palettes/meridian.css` — the active v1 palette (raw ramps only)
- `src/palettes/{lilac,meadow,daylight}.css` — designed alternates, not
  wired into any shipped package. See `decisions/0003.md`.
- `src/base.css` — reset, focus-visible, reduced-motion, the 4px spacing
  scale, and shared easing curve shapes (not durations — those diverge
  per package, see `decisions/0004.md`).
- `src/index.css` — imports the active palette + base, in that order.

Does **not** contain semantic tokens (`--color-accent` and friends) or any
component. See `CONTRACT.md` for what every consumer must define, and
`decisions/0004-token-contract-not-shared-values.md` for why the contract
lives here but the values don't.

To change the active palette, do not edit this package — point
`@tfrc/web`'s and `@tfrc/app`'s `tokens.css` imports at a different
palette file, and update `STATE.md`.
