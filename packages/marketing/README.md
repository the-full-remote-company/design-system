# @tfrc/marketing

The marketing dialect of the company's visual language. Marketing pages,
case studies, careers. Persuades a stranger once; desktop-first; motion is
generous because motion sells here.

**This package is not the website.** It is one of two dialects — the other
is `@tfrc/product` — and thefullremotecompany.com is a separate repository
that *installs* this one (`decisions/0007.md`). Building that site? Read
`CONSUMING.md` at the repo root, not this file. Renamed from `@tfrc/web`
for exactly this reason; see `decisions/0008.md`.

~14 components. None of them have a product equivalent — a hero, a CTA
band, and a stat strip mean nothing inside a finance app, which is exactly
why they live here and not in `@tfrc/foundation`.

Never imports from `@tfrc/product`. If you need something from there, it
belongs in `@tfrc/foundation` instead — see `decisions/0001.md`.

## Files

- `src/tokens.css` — the semantic layer. Same token names as `@tfrc/product`,
  different values (`CONTRACT.md` in the foundation package documents which
  names are required).
- `src/components.css` — button, card, stats, CTA band.
- `src/index.css` — entry point; import order is foundation → tokens →
  components.
