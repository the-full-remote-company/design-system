# Feature Specification: Design System Foundation

**Branch:** `001-design-system-foundation` | **Date:** 2026-08-04 | **Status:** Implemented
**Input:** "The Full Remote Company needs a design system spanning its
corporate site and a portfolio of products, starting with a personal
finance app, across finance, real estate, and adjacent industries."

*(Retrofit note: this spec was written after v1 shipped, documenting what
was built, rather than before — see `decisions/0006.md` for why. Treat it
as historical record and as the worked example for `specs/002-...` and
beyond, not as a spec that was followed top-down for v1 itself.)*

## User Scenarios & Testing

### Primary story
A designer or engineer joining the company needs to build a screen —
either on the marketing site or inside a product — and needs it to look
and feel like it belongs to the same company as every other screen,
without inventing new colors, spacing, or component behavior from
scratch, and without accidentally borrowing something from a context it
doesn't belong in (a marketing hero component inside a transaction list,
or vice versa).

A second, financially-literate user opens the personal finance product
and needs to read their balance and recent transactions at a glance,
correctly identifying gains and losses, on a phone, one-handed, in
sunlight.

### Acceptance scenarios
1. **Given** an engineer building a page on thefullremotecompany.com,
   **When** they need a button, **Then** a single documented button
   component exists with a primary/secondary/ghost/danger variant, sized
   for desktop persuasion.
2. **Given** an engineer building a screen inside the finance product,
   **When** they need the same conceptual button, **Then** the same
   class names exist, sized for one-handed mobile use, with a 44×44px
   minimum touch target.
3. **Given** a user viewing a transaction list, **When** an amount
   represents a loss, **Then** it is never distinguishable from a gain
   by color alone — a sign or arrow is always present.
4. **Given** a future product (e.g. real estate), **When** it needs a
   transaction-list-like component that already exists in the finance
   product, **Then** it reuses the existing `@tfrc/app` component rather
   than rebuilding an equivalent one.

### Edge cases
- What happens when a component is needed in both the corporate site and
  a product? It does not get shared automatically — see Assumptions.
- What happens when a color-blind user (~1 in 12 men) views a gain/loss
  figure? Direction must never rely on hue discrimination alone.
- What happens when a third product needs a brand-identity color and
  every hue near the existing ones is close to another product's? See
  the hue-ceiling handled in `decisions/0005.md`.

## Functional Requirements

- **FR-001**: The system MUST provide a shared visual foundation (colors,
  spacing, a reset) usable by both the corporate site and any product.
- **FR-002**: The system MUST provide a distinct set of components for
  the corporate site, sized and paced for a one-time persuasive visit.
- **FR-003**: The system MUST provide a distinct set of components for
  products, sized and paced for daily, long-term, mobile-first use.
- **FR-004**: The corporate components and product components MUST NOT
  depend on one another.
- **FR-005**: Every interactive product component MUST meet a 44×44px
  minimum touch target.
- **FR-006**: The system MUST reserve specific color meaning for
  financial gain and loss, exclusively, across every current and future
  product.
- **FR-007**: A new product MUST be addable as a themed variant of the
  existing product component set, not as a new, separate component set.
- **FR-008**: Every color pairing used for body text MUST meet a 4.5:1
  contrast ratio against its surface.

## Success Criteria

- **SC-001**: An engineer can build a correct, on-brand button in either
  layer using only documented class names, with zero raw color values
  written by hand.
- **SC-002**: A financial amount's direction (gain or loss) is
  identifiable without relying on color perception.
- **SC-003**: Adding a second product (e.g. real estate) requires adding
  one theme file, not a new package.
- **SC-004**: The corporate layer and product layer can each evolve
  (new components, new scale) without a change to one ever requiring a
  change to the other.

## Key Entities

- **Token** — a named design value (color, spacing, radius, duration)
  referenced by name in every component; never a raw literal.
- **Package** — `@tfrc/foundation`, `@tfrc/web`, `@tfrc/app`: the three
  shared units of the system.
- **Theme** — a themed variant of `@tfrc/app` for one specific product
  (e.g. `finance`).

## Assumptions

- Assumed the corporate site and the product line would never need
  pixel-identical components, given how differently they're used (see
  `decisions/0001.md`'s comparison table) — this was validated during
  design, not left as a guess, but is recorded here since it shapes
  every requirement above.
- Assumed a personal-finance product would be the first product built,
  which is why the reserved-hue requirement (FR-006) exists at all in v1
  rather than being deferred to whenever finance shipped.
