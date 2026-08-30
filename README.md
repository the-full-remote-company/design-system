# The Full Remote Company — Design System

One foundation, two dialects. Built for a company that ships a corporate
identity and a portfolio of products (starting with personal finance) at
the same time, without either one dragging on the other.

```
@tfrc/foundation      ← tokens, contract, reset, tfrc-verify. Nothing user-facing.
   ├── @tfrc/marketing ← persuade a stranger once. Expressive, desktop-first, ~14 components.
   └── @tfrc/product   ← serve a returning user for years. Restrained, mobile-first, ~23 components.
                          └── themes/finance.css  ← the first product theme.
```

## `marketing` and `product` are dialects, not projects

They are two expressions of **one** visual language, with identical token
*names* and mostly different token *values*. `--color-accent` means the same
thing in both; it just resolves differently, because a hero button and a row
in a transaction list have different jobs.

**Neither one is a product.** The company website and the finance app live
in **their own repositories** and install these as versioned dependencies
(`decisions/0007.md`). Nothing in `packages/` is something a customer opens.

If you are building a product, you want **`CONSUMING.md`**, not this file.

| You are building... | You install | Plus |
|---|---|---|
| thefullremotecompany.com | `@tfrc/marketing` | — |
| the personal finance app (web) | `@tfrc/product` | `@tfrc/product/themes/finance` |
| a future real-estate product | `@tfrc/product` | a new theme file, added to *this* repo |
| a native client, someday | *no path yet* | deliberately unsolved — see `ARCHITECTURE.md` |

*(These were called `@tfrc/web` and `@tfrc/app` until 2026-08-08. They were
renamed because those names describe a delivery platform, while the split
they encode is one of intent — see `decisions/0008.md`.)*

## Read in this order

1. **`.specify/memory/constitution.md`** — the nine non-negotiable articles.
2. **`STATE.md`** — what is actually shipped right now.
3. **`decisions/`** — newest first; *why* things are the way they are.
4. **`AGENTS.md`** — before changing anything. Written for whoever, or
   whatever, touches this repo next.

This repo follows GitHub's [Spec-Driven Development](https://github.com/github/spec-kit)
methodology (`decisions/0006.md`). New features go through
`specs/00N-feature-name/` using the templates in `.specify/templates/`.

## Packages

| Package | What it's for | Version |
|---|---|---|
| `@tfrc/foundation` | Color ramps, spacing base, reset, the token contract, and `tfrc-verify` | 1.0.0 |
| `@tfrc/marketing` | The marketing dialect — corporate site, campaigns, careers | 1.0.0 |
| `@tfrc/product` | The product dialect. Every product themes over this; none forks it. | 1.0.0 |

All three are MIT-licensed and published to the public npm registry under
the `@tfrc` scope (`decisions/0009.md`). **Not yet actually published** —
see `STATE.md`'s open risks.

## Quick start

```bash
node scripts/check-contract.js        # every dialect satisfies the token contract
node scripts/lint-boundaries.js       # the two dialects never import each other
node scripts/test-verify-consumer.js  # tfrc-verify still rejects what it claims to
```

All three are dependency-free Node — they run without `npm install`. To
check a *consumer* repo instead, run `npx tfrc-verify` inside it.

## The rules that matter most

1. **Token names are the API; values are not.** Same name, different value
   per dialect. That divergence is the mechanism, not a defect.
2. **The two dialects never import each other.** A shared need graduates
   into `@tfrc/foundation` on its third identical use, never the second.
3. **`--color-gain` and `--color-loss` mean market direction only.** Never
   brand, never decoration, and never in the marketing dialect at all.
4. **No raw color values anywhere.** Every color resolves through a
   contract token.

See `AGENTS.md` for the full rule set and `CONSUMING.md` for the consumer
half of it.

## Status

v1.2.0 — the two dialects renamed, all three packages made publishable, and
consumer-side verification shipped so the boundary survives leaving this
repo. See `STATE.md` for what is in, what is deferred, and what is at risk.
