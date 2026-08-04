# The Full Remote Company — Design System

One foundation, two expressions. Built for a company that ships a corporate
identity and a portfolio of products (starting with personal finance) at
the same time, without either one dragging on the other.

```
@tfrc/foundation   ← tokens, contract, reset. Nothing user-facing.
   ├── @tfrc/web    ← corporate site. Expressive, desktop-first, ~14 components.
   └── @tfrc/app    ← product UI. Restrained, mobile-first, ~40 components.
                        └── themes/finance.css  ← the first product theme.
```

Read **`STATE.md`** for what's actually shipped right now. Read
**`ARCHITECTURE.md`** for why it's shaped this way. Read **`AGENTS.md`**
before changing anything — it's written for whoever (or whatever) touches
this repo next, including a future instance of the tool that built v1.

## Packages

| Package | What it's for | Version |
|---|---|---|
| `@tfrc/foundation` | Color ramps, spacing base, reset, the token contract | 1.0.0 |
| `@tfrc/web` | thefullremotecompany.com — marketing, careers, case studies | 1.0.0 |
| `@tfrc/app` | The product UI kit. Every product themes over this, none forks it. | 1.0.0 |

## Quick start

```bash
pnpm install
node scripts/check-contract.js     # verifies every palette satisfies the token contract
node scripts/lint-boundaries.js    # verifies web and app never import each other
```

Both scripts are dependency-free Node — they run without `pnpm install`
too, if you just want a fast sanity check.

## The one rule that matters most

A component only moves into `@tfrc/foundation` when two other packages
already use it identically — never when someone predicts a third will.
Everything else in this repo exists to make that rule easy to follow and
hard to accidentally violate. See `AGENTS.md` for the full rule set.

## Status

v1.0.0 — initial release. See `STATE.md` for exactly what's in and what's
deliberately deferred to v1.1.
