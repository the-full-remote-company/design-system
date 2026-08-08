# @tfrc/product

The product dialect of the company's visual language. Mobile-first,
restrained, built to be used daily for years. ~40 components, 44px touch
floor, near-zero novelty tolerance.

**This package is not an app.** It is the UI kit every product themes over —
the finance app is a separate repository that installs this package plus
`themes/finance` (`decisions/0007.md`). Building a product? Read
`CONSUMING.md` at the repo root. Renamed from `@tfrc/app` because that name
was read as "the app"; see `decisions/0008.md`.

**Products theme over this layer; they do not fork it.** See
`src/themes/finance.css` for the pattern — a product theme imports this
package and adds only what's genuinely product-specific (currently: a
`--theme-product-hue` identity tag). Everything else — button, field,
transaction row, balance card, tab bar — is shared by every product that
will ever theme over this layer.

Never imports from `@tfrc/marketing`. If you're tempted to reuse a marketing component
here, that's a sign it belongs in `@tfrc/foundation` instead, and only
once a third consumer needs it — see `AGENTS.md` rule 4.

## Reserved tokens

`--color-gain` and `--color-loss` are owned by this package. See
`decisions/0002-reserved-hues-for-financial-semantics.md`. Every amount
or direction indicator must pair color with a sign or arrow — never
color alone.

## Adding a new product theme

1. Copy the shape of `src/themes/finance.css`.
2. Pick an unused hue from `STATE.md`'s `product_hues_in_use` — check the
   ceiling in `decisions/0005.md` first.
3. Only add token overrides if the product genuinely needs different
   values — most won't. The finance theme adds none.
4. Update `STATE.md`.
