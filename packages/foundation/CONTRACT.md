# Token contract

Any package that defines a semantic layer (`@tfrc/marketing`, `@tfrc/product`, or any
future sibling) MUST define every token below in its `tokens.css`.
Components reference these names only — never a `--ramp-*` value directly,
and never a raw color literal. See `AGENTS.md` rule 2.

`scripts/check-contract.js` verifies this mechanically for every file it's
pointed at. Run it before merging any new or edited `tokens.css`.

The other side of the contract — that a *consumer* uses only these names and
never a raw value — is checked by `tfrc-verify`, which ships as an
executable in this package and runs inside the consumer's own repo. See
`CONSUMING.md` and `decisions/0009.md`.

## Surfaces
- `--color-surface`
- `--color-surface-raised`
- `--color-surface-sunken`

## Borders
- `--color-border-subtle`
- `--color-border-strong`

## Text
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`

## Action
- `--color-accent`
- `--color-accent-hover`
- `--color-accent-fg`
- `--color-accent-bg`
- `--color-accent-bg-fg`

## System
- `--color-focus`

## Status
- `--color-info-bg`, `--color-info-fg`, `--color-info-line`
- `--color-danger-bg`, `--color-danger-fg`, `--color-danger-line`, `--color-danger-solid`
- `--color-success-bg`, `--color-success-fg`, `--color-success-line`

## Reserved — `@tfrc/product` only
These must NOT be defined or referenced in `@tfrc/marketing`. See
`decisions/0002-reserved-hues-for-financial-semantics.md`.

- `--color-gain`, `--color-gain-tint`
- `--color-loss`, `--color-loss-tint`

## Contrast floor
- `--color-text-primary` ≥ 4.5:1 against both `--color-surface` and
  `--color-surface-raised`.
- `--color-accent-fg` ≥ 4.5:1 against `--color-accent`.

Check with any WCAG contrast tool before merging. This is not currently
automated — see `STATE.md`'s known gaps for v1.3.
