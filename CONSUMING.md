# Consuming this design system

For engineers building a **product** — the corporate website, the personal
finance app, anything else the company ships. You are in the right place if
you are starting a repo that is *not* this one.

If you are changing the design system itself, you want `CONTRIBUTING.md`
instead.

## First, the thing that confuses everyone

There are two packages you might install, and they are **not** "the
website one" and "the app one". They are two dialects of a single visual
language:

| | `@tfrc/marketing` | `@tfrc/product` |
|---|---|---|
| Job | persuade a stranger once | serve a returning user for years |
| Feel | expressive, generous motion | restrained, near-zero novelty |
| Layout | desktop-first | mobile-first |
| Buttons | 56px, generous | 44px minimum touch target |
| Typical surface | landing page, careers, case study | dashboard, transaction list, settings |

Both define the *same token names* (`--color-accent` means the same thing
in both) with *different values*. That is what lets you write the same
markup in either and get the correct result for the context.

**Pick exactly one.** A single bundle must never contain both — see
"Rules you must not break" below.

- The Full Remote Company website → `@tfrc/marketing`
- The personal finance app (a web application) → `@tfrc/product` + the
  `finance` theme
- A future real-estate product → `@tfrc/product` + a new theme file, which
  is added to *this* repo, not yours

Your product lives in **its own repository** and installs these as
versioned dependencies. It does not live in this repo, and it does not copy
CSS out of it. See `decisions/0007-products-consume-published-packages.md`
for why, including the honest cost: a publish step now sits between
"change a token" and "see it in your product".

## Setting up a marketing consumer

```bash
npm install @tfrc/marketing@1.0.1 --save-exact
```

```css
/* src/styles.css — your one entry point */
@import "@tfrc/marketing";

/* Your own layout on top. Colors, spacing and type come from tokens. */
.pricing-grid {
  display: grid;
  gap: var(--space-6);
  background: var(--color-surface);
  color: var(--color-text-primary);
}
```

## Setting up a product consumer

```bash
npm install @tfrc/product@1.0.1 --save-exact
```

```css
/* src/styles.css */
@import "@tfrc/product/themes/finance";   /* imports @tfrc/product itself */

.holdings-table { background: var(--color-surface-raised); }

/* Market direction — this is what the reserved colors are for, and they
   must always be paired with a sign or an arrow, never color alone. */
.change[data-direction="up"]   { color: var(--color-gain); }
.change[data-direction="down"] { color: var(--color-loss); }
```

Every available theme lives in `packages/product/src/themes/` in this repo.
Your product does **not** author its own theme locally — a new theme is a
change to this repo, so that two products can never drift into two
incompatible versions of the same idea.

## Cascade layers — how your overrides win

This system's reset lives in `@layer base` and every component
(`.btn`, `.field`, `.pill`, theme additions like `.theme-tag`) lives in
`@layer components`. Custom properties (`--color-accent` and friends) are
deliberately **not** layered — see `decisions/0010-cascade-layers-for-
consumer-overrides.md` if you want the reasoning.

This matters because of what it lets you do: declare your own utility
layer *after* these two, and your utilities reliably win the cascade
against this system's components — no `!important`, no specificity
arms race with `.field input`.

```css
/* src/styles.css — your one entry point */
@layer base, components, utilities;   /* declare the order FIRST */

@import "@tfrc/product/themes/finance";

@layer utilities {
  .mt-4 { margin-top: var(--space-4); }
}
```

**Using Tailwind v4?** It already generates `@layer theme, base, components,
utilities;` for you. Add this system's two layer names into that same
statement, in the same relative position, before your own `@tailwind`-style
imports:

```css
/* src/styles.css */
@import "tailwindcss";              /* Tailwind's own base/components/utilities */
@layer base, components, tailwind-utilities;

@import "@tfrc/product/themes/finance";

@layer tailwind-utilities {
  @tailwind utilities;
}
```

The exact syntax depends on your Tailwind v4 setup (whether you're using
`@tailwind` directives or the newer `@import "tailwindcss" layer(utilities)`
form) — the requirement is only that whichever layer holds your utility
classes is declared **after** `base` and `components` in the order
statement. `npx tfrc-verify` (below) checks for the common mistake:
writing the list backwards.

## Verify your repo, in your repo

```bash
npx tfrc-verify
```

Wire this into your CI as a required check. It is dependency-free and needs
no configuration:

```yaml
# .github/workflows/ci.yml in YOUR repo
- run: npx tfrc-verify
```

It reports:

| Code | Meaning | Fix |
|---|---|---|
| `NO_MANIFEST` | No `package.json` was found where you ran it | Run it from your repo root. The checker reads your manifest to learn which dialect and version you adopted. |
| `NO_DIALECT` | Neither dialect is installed or imported | Add exactly one, as an exact-version dependency. Expected in a repo that hasn't adopted the system yet — it means "nothing to verify", not "something is broken". |
| `MIXED_DIALECT` | You have both dialects installed or imported | Remove one. If you genuinely need both looks, you have two products, not one. |
| `RESERVED_TOKEN` | A marketing consumer referenced `--color-gain`/`--color-loss` | Use `--color-success`/`--color-danger` if you mean status, or an accent if you mean decoration. |
| `RESERVED_REDEFINE` | You redefined a reserved token | Never redefine it. Use it, or use a different token. |
| `RESERVED_HUE` | A raw `oklch()` value sits in the reserved gain/loss hue band | Pick a hue outside 130–170 and 5–40, and use a token. |
| `RAW_VALUE` | A hex/`rgb()`/`oklch()` literal in your source | Use the token that means what you want. If none exists, open an issue on this repo — do not invent a local value. |
| `VERSION_PIN` | A `@tfrc/*` dependency uses a range like `^1.0.0` | Pin it exactly, so your appearance never changes without a decision. |
| `LAYER_ORDER` | An `@layer` statement lists `utilities` before `base`/`components` | Declare `@layer base, components, utilities;` — see "Cascade layers" above. |

Exit codes: `0` compliant, `1` violations found, `2` usage error.

### The escape hatch, and why it is loud

If you truly need a raw value the language does not cover — a favicon
background, an OG image color — annotate it:

```css
/* tfrc-allow-raw: OG image background must be an opaque literal */
.og-card { background: #ffffff; }
```

`tfrc-verify` will allow it and **still print it, and count it**. A rising
count is the visible symptom of the shared language failing to cover your
product; treat it as a prompt to ask for a token, not as a way to silence
the check.

## Rules you must not break

These come from the constitution (`.specify/memory/constitution.md`) and
apply to your repo as much as to this one:

1. **Never combine `@tfrc/marketing` and `@tfrc/product`** in one bundle
   (Article VI). They are deliberately inconsistent with each other.
2. **`--color-gain` and `--color-loss` mean market direction only**
   (Article V). Not brand, not decoration, not an illustration fill — and
   never in a marketing consumer at all. Always pair them with a sign or
   arrow so the meaning survives color-blindness.
3. **No raw color values** (Article IV). Every color resolves through a
   named token.
4. **Pin the version exactly.** A range means the design system can change
   your product's appearance while you sleep.
5. **Declare `@layer base, components, utilities;`** (in that relative
   order) before your own styles. Getting it backwards silently loses the
   cascade to this system's reset and components instead of winning it —
   see "Cascade layers" above and `decisions/0010.md`.

## Upgrading

Read `CHANGELOG.md` in this repo, then bump the exact version. A MAJOR bump
means something that looked right will now look different; a MINOR bump
only adds. You are never obliged to upgrade — a product can sit on an old
version indefinitely and keep building, which is what makes it safe for two
products to move at different speeds.

## When you need something that doesn't exist

Open an issue on this repo. Do **not**:

- copy a token value into your repo and tweak it
- write the component locally with hard-coded colors
- add your product to this repo to get faster iteration

The first two decay the language one product at a time; the third dissolves
the boundary this whole structure exists to hold. Adding a token or a
component here takes one PR, and then every product gets it.

## Register yourself

Add your repo to `CONSUMERS.md` in this repo when you adopt a package, and
update the version line when you upgrade. That file is how a maintainer
answers "what breaks if I change this?" without guessing.
