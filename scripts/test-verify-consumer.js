#!/usr/bin/env node
/**
 * test-verify-consumer.js
 *
 * Proves that `packages/foundation/bin/tfrc-verify.js` fails on each rule
 * it claims to enforce, and passes on a compliant consumer. Required by
 * specs/002's SC-003: a deliberately-introduced violation of each rule must
 * fail a check. A governance script that has never been observed failing is
 * indistinguishable from one that always exits 0.
 *
 * Dependency-free, like every other script here (Article II).
 *
 * Exit code 0 = every expectation held, 1 = the checker is wrong.
 */

"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BIN = path.join(ROOT, "packages", "foundation", "bin", "tfrc-verify.js");
const FIXTURES = path.join(ROOT, "scripts", "fixtures");

const cases = [
  {
    fixture: "consumer-clean",
    expectExit: 0,
    expectCodes: [],
    forbidCodes: ["RAW_VALUE", "RESERVED_TOKEN", "RESERVED_HUE", "MIXED_DIALECT", "VERSION_PIN", "NO_DIALECT", "LAYER_ORDER"],
    why: "a compliant product consumer must pass, including its legitimate use of gain/loss for market direction",
  },
  {
    fixture: "consumer-mixed-dialect",
    expectExit: 1,
    expectCodes: ["MIXED_DIALECT"],
    why: "combining both dialects violates Article VI and is invisible to the in-repo boundary lint",
  },
  {
    fixture: "consumer-raw-value",
    expectExit: 1,
    expectCodes: ["RAW_VALUE"],
    why: "raw color literals violate Article IV",
  },
  {
    fixture: "consumer-reserved-color",
    expectExit: 1,
    expectCodes: ["RESERVED_TOKEN", "RESERVED_HUE"],
    why: "the marketing dialect may not reference market-direction color, and a raw oklch in a reserved band is the half of the rule a token grep cannot see",
  },
  {
    fixture: "consumer-unpinned",
    expectExit: 1,
    expectCodes: ["VERSION_PIN"],
    why: "a range specifier lets a consumer's appearance change without a decision (FR-002)",
  },
  {
    fixture: "consumer-redefines-reserved",
    expectExit: 1,
    expectCodes: ["RESERVED_REDEFINE"],
    why: "a product consumer may use the reserved tokens but never redefine them — otherwise 'green means up' silently becomes product-specific (decisions/0002.md)",
  },
  {
    fixture: "consumer-no-dialect",
    expectExit: 1,
    expectCodes: ["NO_DIALECT"],
    forbidCodes: ["NO_MANIFEST"],
    why: "a repo with a manifest but no dialect must be told there was nothing to verify, not silently passed",
  },
  {
    fixture: "consumer-no-manifest",
    expectExit: 1,
    expectCodes: ["NO_MANIFEST"],
    why: "without a package.json the checker cannot know the dialect or the pinned version, and must say so rather than guess",
  },
  {
    fixture: "consumer-layer-order",
    expectExit: 1,
    expectCodes: ["LAYER_ORDER"],
    why: "a consumer that declares its utility layer before base/components silently loses the cascade to this system's reset and component styles instead of winning it (decisions/0010.md)",
  },
];

let failures = 0;

for (const c of cases) {
  const dir = path.join(FIXTURES, c.fixture);
  const res = spawnSync(process.execPath, [BIN, "--dir", dir], { encoding: "utf8" });
  const output = `${res.stdout || ""}${res.stderr || ""}`;
  const problems = [];

  if (res.status !== c.expectExit) {
    problems.push(`expected exit ${c.expectExit}, got ${res.status}`);
  }
  for (const code of c.expectCodes) {
    if (!output.includes(`[${code}]`)) problems.push(`expected violation code ${code} in output`);
  }
  for (const code of c.forbidCodes || []) {
    if (output.includes(`[${code}]`)) problems.push(`unexpected violation code ${code} in output`);
  }

  if (problems.length) {
    failures++;
    console.error(`✗ ${c.fixture} — ${c.why}`);
    for (const p of problems) console.error(`    ${p}`);
    console.error(output.split("\n").map((l) => `    | ${l}`).join("\n"));
  } else {
    console.log(`✓ ${c.fixture} — exit ${res.status}${c.expectCodes.length ? ` [${c.expectCodes.join(", ")}]` : ""}`);
  }
}

// The escape hatch must be visible, not silent (specs/002 edge cases).
const hatch = spawnSync(process.execPath, [BIN, "--dir", path.join(FIXTURES, "consumer-raw-value")], { encoding: "utf8" });
if (!`${hatch.stdout}${hatch.stderr}`.includes("tfrc-allow-raw")) {
  failures++;
  console.error("✗ consumer-raw-value — an allowed raw value must still be reported and counted, never accepted silently");
} else {
  console.log("✓ consumer-raw-value — tfrc-allow-raw allowance is reported, not silent");
}

if (failures) {
  console.error(`\n✗ ${failures} expectation${failures === 1 ? "" : "s"} failed — tfrc-verify does not enforce what it documents.`);
  process.exit(1);
}

console.log("\n✓ tfrc-verify enforces every rule it documents (specs/002 SC-003).");
