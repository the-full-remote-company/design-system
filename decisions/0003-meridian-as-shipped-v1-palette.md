# ADR 0003: Meridian ships as the v1 default palette

**Status:** Accepted
**Date:** 2026-08-04

## Context

Three palette directions were designed and compared before this repo
existed: Lilac (pastel violet), Meadow (Spotify-adjacent green on pastel
sage), and Meridian (indigo and gold). The company's stated scope — finance,
real estate, and adjacent categories — makes ADR 0002's reserved-hue
constraint decisive: Meadow's brand green sits inside the reserved gain
band, which would force every product screen to work around a permanent
collision between "the brand" and "you made money."

## Decision

**Meridian** (`packages/foundation/src/palettes/meridian.css`) is the only
palette wired into `@tfrc/web` and `@tfrc/app` for v1.0.0. Indigo (hue 275)
is the parent brand accent; gold (hue 65) carries the real-estate/property
association. Both are chosen partly because they sit outside the reserved
bands in ADR 0002.

Lilac, Meadow, and Daylight remain in
`packages/foundation/src/palettes/` as fully-specified, contract-compliant
alternates — designed, documented, and available — but not imported by
either shipped package. Switching the active palette is a one-line change
in each package's `tokens.css` (point the ramp variables at a different
palette file), not a rebuild.

## Consequences

- The shipped brand color is a deliberate consequence of the product
  category, not a taste preference — if the product mix changes
  significantly (e.g. finance is dropped entirely), this constraint should
  be revisited, not assumed permanent.
- Lilac and Meadow are not wasted work: they're documented reference
  implementations of "how to build a contract-compliant palette," useful
  the next time someone proposes a fourth.
- Meadow specifically should not be revived as a *brand* palette while any
  product in the portfolio does financial gain/loss display, per ADR 0002.
  It could still be revived for a product with no financial semantics.

## Alternatives considered

- **Ship Lilac.** A strong, distinctive direction with no reserved-hue
  conflict. Not chosen for v1 because Meridian's indigo/gold pairing was
  judged a more legible fit for "finance + real estate + adjacent" as a
  positioning statement — this is a judgment call, not a hard constraint,
  and is the most easily-revisited part of this ADR.
- **Ship Meadow.** Rejected per ADR 0002 — the brand accent would sit
  inside the reserved gain hue band the moment the finance product shipped.
