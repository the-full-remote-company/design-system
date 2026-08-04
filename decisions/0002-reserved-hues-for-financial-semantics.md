# ADR 0002: Reserved hue bands for gain and loss

**Status:** Accepted
**Date:** 2026-08-04

## Context

The company's product line includes personal finance. Financial interfaces
have a near-universal convention: green means gain, red means loss. That
convention is load-bearing user expectation, not a brand preference — a
user who sees red on a balance reads it as a loss before they read any
label. If the brand's own accent color sits inside that hue range, a
primary action button and a loss indicator become visually
indistinguishable on the same screen.

This is what ruled out an otherwise-strong direction (a Spotify-green
brand accent) once the finance product entered scope — see the palette
discussion this ADR formalizes.

## Decision

Two hue bands are reserved, permanently, for market direction only:

- **Gain:** oklch hue 130–170 (shipped value: 150)
- **Loss:** oklch hue 5–40 (shipped value: 25)

No palette, no product theme, no marketing page may use these hue bands
for brand color, decoration, illustration fill, or anything other than
literal gain/loss indication. This applies to `@tfrc/web` absolutely — the
corporate site has no legitimate reason to render a market indicator, so it
should never touch these tokens at all.

Direction is never carried by hue alone: every gain/loss figure also
carries a sign (+/−) or an arrow, because roughly 1 in 12 men cannot
reliably distinguish red from green.

## Consequences

- The Meridian palette's brand indigo sits at hue 275 and gold at hue
  65 — both chosen in part *because* they're clear of these bands.
- Any future palette proposal that lands a brand color inside 130–170 or
  5–40 should be rejected at review, not fixed later.
- `scripts/lint-boundaries.js` checks that `@tfrc/web` never references the
  `--color-gain` / `--color-loss` tokens by name. It cannot detect a *new*
  raw color that happens to fall in the reserved hue range — that check is
  manual, and is explicitly called out in `AGENTS.md` rule 5 so it isn't
  assumed to be automated when it isn't.

## Alternatives considered

- **Let context disambiguate (e.g. only use green-as-brand outside
  financial screens).** Rejected — a portfolio company's whole premise is
  that products share a visual language; a rule that only holds on some
  screens is a rule that will eventually be violated by someone who didn't
  know which screens counted.
- **Use a green brand accent and solve it entirely with iconography.**
  Rejected as the sole mitigation — icons help but don't remove the color
  collision for anyone scanning quickly, which is the primary use case for
  a balance screen.
