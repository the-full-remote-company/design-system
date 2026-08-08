#!/usr/bin/env node
/**
 * check-contract.js
 *
 * Verifies that every package's tokens.css defines every token required
 * by packages/foundation/CONTRACT.md. Parses the contract's markdown for
 * backtick-wrapped `--color-*` names, then checks each is defined
 * (`--token-name:`) in each tokens.css file it's pointed at.
 *
 * Also verifies the reserved-token rule from decisions/0002.md: gain/loss
 * tokens must exist in @tfrc/product's tokens.css and must NOT exist in
 * @tfrc/marketing's.
 *
 * Dependency-free. Exit code 0 = clean, 1 = missing tokens found.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTRACT = path.join(ROOT, "packages", "foundation", "CONTRACT.md");

const TARGETS = [
  { name: "@tfrc/marketing", file: path.join(ROOT, "packages", "marketing", "src", "tokens.css"), reserved: "forbidden" },
  { name: "@tfrc/product", file: path.join(ROOT, "packages", "product", "src", "tokens.css"), reserved: "required" },
];

function extractRequiredTokens(contractText) {
  // Pull every `--color-...` token mentioned under a heading that is not
  // "Reserved" — those are handled separately via the `reserved` flag.
  const lines = contractText.split("\n");
  const required = new Set();
  const reserved = new Set();
  let inReserved = false;

  for (const line of lines) {
    if (/^##\s/.test(line)) {
      inReserved = /reserved/i.test(line);
      continue;
    }
    const matches = line.match(/`(--color-[a-z0-9-]+)`/g);
    if (!matches) continue;
    for (const m of matches) {
      const token = m.replace(/`/g, "");
      (inReserved ? reserved : required).add(token);
    }
  }
  return { required: [...required], reserved: [...reserved] };
}

function definedTokens(cssText) {
  const found = new Set();
  const re = /(--color-[a-z0-9-]+)\s*:/g;
  let m;
  while ((m = re.exec(cssText))) found.add(m[1]);
  return found;
}

if (!fs.existsSync(CONTRACT)) {
  console.error(`✗ Contract file not found at ${path.relative(ROOT, CONTRACT)}`);
  process.exit(1);
}

const { required, reserved } = extractRequiredTokens(fs.readFileSync(CONTRACT, "utf8"));
let failed = false;

for (const target of TARGETS) {
  if (!fs.existsSync(target.file)) {
    console.error(`✗ ${target.name}: tokens.css not found at ${path.relative(ROOT, target.file)}`);
    failed = true;
    continue;
  }
  const defined = definedTokens(fs.readFileSync(target.file, "utf8"));
  const missing = required.filter((t) => !defined.has(t));

  if (missing.length) {
    failed = true;
    console.error(`✗ ${target.name} is missing required tokens:`);
    for (const t of missing) console.error(`    ${t}`);
  } else {
    console.log(`✓ ${target.name} satisfies the token contract (${required.length} required tokens).`);
  }

  if (target.reserved === "required") {
    const missingReserved = reserved.filter((t) => !defined.has(t));
    if (missingReserved.length) {
      failed = true;
      console.error(`✗ ${target.name} should define reserved tokens but is missing:`);
      for (const t of missingReserved) console.error(`    ${t}`);
    }
  }
  if (target.reserved === "forbidden") {
    const present = reserved.filter((t) => defined.has(t));
    if (present.length) {
      failed = true;
      console.error(`✗ ${target.name} defines reserved tokens it must not (see decisions/0002.md):`);
      for (const t of present) console.error(`    ${t}`);
    }
  }
}

if (failed) {
  console.error("\nSee packages/foundation/CONTRACT.md and decisions/0002.md.");
  process.exit(1);
}

console.log("\n✓ Token contract satisfied by all checked packages.");
