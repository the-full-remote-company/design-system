# apps/docs — stub

Not built yet. See `STATE.md`'s `known_gaps_for_v1.3`.

## What `apps/` is for, and what it is not

`apps/` is reserved for surfaces that **document or verify this design
system itself**. It is not where products go. The company website, the
personal finance app, and every future product live in their own
repositories and install published packages — `decisions/0007.md`, and
`AGENTS.md` rule 3a.

Adding `apps/website` here would be nearly free, since `apps/*` is already
globbed by the workspace. That is exactly why the rule is written down: the
cheapest path is the one that quietly turns a design system into a product
monorepo.

## Background

Three standalone HTML prototypes were built during the design phase that
produced this repo (a palette comparison, a corporate-site mockup, and a
finance-app mockup with a live device frame). They demonstrate the visual
direction but predate this package structure and do not import
`@tfrc/foundation`, `@tfrc/marketing`, or `@tfrc/product` — they have their
own inlined copies of the same token values.

## Scope when this is actually built

Rebuild as a real docs app (Storybook, Ladle, or similar) that imports the
actual packages, so the documentation can never drift from the shipped
tokens the way a hand-maintained prototype can.

Do not treat the old prototypes as a spec to copy pixel-for-pixel — treat
`packages/foundation/CONTRACT.md` and each package's `tokens.css` as the
spec, and rebuild the presentation against those.

One constraint that is easy to get wrong: a docs app that renders **both**
dialects side by side would have to import both `@tfrc/marketing` and
`@tfrc/product`, which Article VI forbids in a single bundle. Render them
in separate routes with separate entry points, or in iframes — do not
weaken the boundary to make a comparison page easier.
