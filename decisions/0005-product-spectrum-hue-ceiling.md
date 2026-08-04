# ADR 0005: Product spectrum — constant lightness/chroma, hue varies, ceiling of 8

**Status:** Accepted
**Date:** 2026-08-04

## Context

A multi-product portfolio needs product accents that read as siblings —
"one company's products" — rather than as unrelated brands competing for
attention within the same app shell or cross-product surface (e.g. a
unified dashboard listing accounts from multiple products).

## Decision

Product accents (`--product-<name>` in `@tfrc/app`) hold lightness and
chroma constant and vary only hue. Six are defined for v1:

| Product | Hue | Association |
|---|---|---|
| Capital | 275 | Investing (shared with the parent brand accent) |
| Estate | 65 | Property |
| Lending | 195 | Credit |
| Insight | 235 | Analytics (shared with `--color-focus` / `--color-info-line`) |
| Legal | 305 | Contracts |
| Market | 340 | Marketplace |

Every product hue must clear both reserved bands in ADR 0002 (130–170,
5–40) by a comfortable margin — the six above were chosen with that
constraint already applied.

**Eight is the documented ceiling** for this mechanism. Past roughly eight
adjacent hues at the same lightness/chroma, they stop being reliably
distinguishable at a glance, which defeats the purpose of the spectrum
entirely — a system that quietly stops working past a threshold is worse
than one that visibly refuses to grow past it.

## Consequences

- Adding a seventh or eighth product theme means picking one of the two
  remaining free hues (see `STATE.md`) — not choosing a color and hoping
  it reads as distinct.
- A ninth product forces a real decision, not a workaround: color stops
  being sufficient identity and a second dimension (icon, wordmark
  treatment, or grouping into families) has to carry the rest. That
  decision should be its own ADR when it happens, not improvised.
- `STATE.md` tracks hues in use specifically so this ceiling is visible
  without re-deriving it from every theme file.

## Alternatives considered

- **No ceiling; add hues as needed.** Rejected — this is the scenario
  where the system silently degrades. Distinguishability doesn't fail
  loudly; it just gets worse product by product until someone notices two
  accounts look the same color and can't say why.
- **Vary lightness/chroma per product instead of only hue.** Rejected for
  v1 — it would let more products coexist, but at the cost of the
  "siblings, same weight" property that's the entire point of the
  spectrum. Revisit only alongside the ninth-product decision above.
