# apps/docs — stub

Not built yet. See `STATE.md`'s `known_gaps_for_v1.1`.

Three standalone HTML prototypes were built during the design phase that
produced this repo (a palette comparison, a corporate-site mockup, and a
finance-app mockup with a live device frame). They demonstrate the visual
direction but predate this package structure and do not import
`@tfrc/foundation`, `@tfrc/web`, or `@tfrc/app` — they have their own
inlined copies of the same token values.

**v1.1 scope:** rebuild this as a real docs app (Storybook, Ladle, or
similar) that imports the actual packages, so the documentation can never
drift from the shipped tokens the way a hand-maintained prototype can. Do
not treat the old prototypes as a spec to copy pixel-for-pixel — treat
`packages/foundation/CONTRACT.md` and each package's `tokens.css` as the
spec, and rebuild the presentation against those.
