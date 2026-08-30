# scripts/fixtures — deliberately broken consumer repos

Every directory here is a miniature stand-in for a *consumer* repo: a
product or site that installs this design system from the registry. They
exist so `scripts/test-verify-consumer.js` can prove that
`packages/foundation/bin/tfrc-verify.js` actually fails on each rule it
claims to enforce — `specs/002`'s SC-003 requires exactly that
("a deliberately-introduced violation of each of the three fails a
check"), and a check nobody has ever seen fail is a check nobody should
trust.

**These files violate the constitution on purpose.** `consumer-raw-value`
contains a hex literal (Article IV), `consumer-reserved-color` uses
`--color-gain` from the marketing dialect (Article V),
`consumer-redefines-reserved` redefines it from the product dialect
(Article V), and `consumer-mixed-dialect` imports both dialects
(Article VI). Do not copy any of them as an example of correct usage —
`CONSUMING.md` at the repo root is the correct example. `consumer-clean` is
the only compliant one.

Two fixtures cover *preconditions* rather than rule violations:
`consumer-no-dialect` has a manifest but has adopted neither dialect, and
`consumer-no-manifest` has no `package.json` at all. Both must fail loudly
rather than exit 0, because a silent pass in those states is
indistinguishable from a real pass — a consumer would believe it was
covered while the checker never had anything to check.

Between them these fixtures cover every violation code the tool can emit —
`consumer-reserved-color` covers two, the rest one each — and
`test-verify-consumer.js` asserts the exact codes for every fixture. Adding
a code to the checker without covering it here makes that script's closing
claim — "tfrc-verify enforces every rule it documents" — false, so add both
in the same PR (`AGENTS.md` rule 3).

Note on Article IX (checks run against real source, not fixtures): the
repo's own two checks, `check-contract.js` and `lint-boundaries.js`, still
run exclusively against the real shipped `tokens.css` files and never look
in here. Fixtures are used only to test the *consumer* tool, whose real
inputs live in repositories this one cannot see. That exception is
recorded in `specs/002-product-consumption-contract/plan.md` under
Complexity Tracking rather than taken silently.
