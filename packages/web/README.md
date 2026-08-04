# @tfrc/web

The corporate layer — thefullremotecompany.com. Marketing pages, case
studies, careers. Persuades a stranger once; desktop-first; motion is
generous because motion sells here.

~14 components. None of them have a product equivalent — a hero, a CTA
band, and a stat strip mean nothing inside a finance app, which is exactly
why they live here and not in `@tfrc/foundation`.

Never imports from `@tfrc/app`. If you need something from there, it
belongs in `@tfrc/foundation` instead — see `decisions/0001.md`.

## Files

- `src/tokens.css` — the semantic layer. Same token names as `@tfrc/app`,
  different values (`CONTRACT.md` in the foundation package documents which
  names are required).
- `src/components.css` — button, card, stats, CTA band.
- `src/index.css` — entry point; import order is foundation → tokens →
  components.
