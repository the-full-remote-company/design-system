#!/usr/bin/env node
/**
 * lint-boundaries.js
 *
 * Enforces AGENTS.md rule 3 ("@tfrc/marketing and @tfrc/product never import from
 * each other") and half of rule 5 (the reserved gain/loss tokens must
 * never appear in @tfrc/marketing's source).
 *
 * Dependency-free on purpose — this has to keep working even before
 * `pnpm install` has ever been run in this repo. See STATE.md's known
 * gaps: this repo has never actually had node_modules installed.
 *
 * Exit code 0 = clean. Exit code 1 = violation found, details printed.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MARKETING_SRC = path.join(ROOT, "packages", "marketing", "src");
const PRODUCT_SRC = path.join(ROOT, "packages", "product", "src");

let violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else if (/\.(css|js|jsx|ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function check(files, forbiddenPatterns, label) {
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(ROOT, file);
    for (const { pattern, message } of forbiddenPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push(`${rel}: ${message} (found: "${matches[0].trim()}")`);
      }
    }
  }
}

// @tfrc/marketing must never import @tfrc/product, and must never reference the
// reserved gain/loss tokens (decisions/0002.md).
// Reserved-token check matches DEFINITIONS (--color-gain:) and USAGES
// (var(--color-gain)) only — not a bare mention inside a comment, since
// explaining *why* a token is absent is legitimate and common (see
// packages/marketing/src/tokens.css). A regex that flagged prose would train
// people to stop explaining the rule in comments, which is the opposite
// of what AGENTS.md wants.
//
// The pre-0008 names (`@tfrc/app`, `@tfrc/web`, `packages/app`,
// `packages/web`) are matched too. They resolve to nothing now, so such an
// import would be a build error rather than a live boundary breach — but
// naming it as a boundary violation gives a clearer message than a
// missing-module stack trace. See decisions/0008.md.
check(walk(MARKETING_SRC), [
  { pattern: /@import\s+["']@tfrc\/(product|app)/i, message: "imports @tfrc/product — forbidden, see AGENTS.md rule 3" },
  { pattern: /@import\s+["'].*packages\/(product|app)/i, message: "imports from packages/product by relative path — forbidden" },
  { pattern: /--color-gain\s*:|var\(\s*--color-gain\s*\)/, message: "defines or uses reserved token --color-gain — see decisions/0002.md" },
  { pattern: /--color-loss\s*:|var\(\s*--color-loss\s*\)/, message: "defines or uses reserved token --color-loss — see decisions/0002.md" },
], "marketing");

// @tfrc/product must never import @tfrc/marketing.
check(walk(PRODUCT_SRC), [
  { pattern: /@import\s+["']@tfrc\/(marketing|web)/i, message: "imports @tfrc/marketing — forbidden, see AGENTS.md rule 3" },
  { pattern: /@import\s+["'].*packages\/(marketing|web)/i, message: "imports from packages/marketing by relative path — forbidden" },
], "product");

if (violations.length) {
  console.error("✗ Boundary violations found:\n");
  for (const v of violations) console.error("  - " + v);
  console.error("\nSee AGENTS.md rule 3 and decisions/0001.md / 0002.md.");
  process.exit(1);
}

console.log("✓ No boundary violations — @tfrc/marketing and @tfrc/product remain independent.");
