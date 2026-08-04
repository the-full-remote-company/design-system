#!/usr/bin/env node
/**
 * lint-boundaries.js
 *
 * Enforces AGENTS.md rule 3 ("@tfrc/web and @tfrc/app never import from
 * each other") and half of rule 5 (the reserved gain/loss tokens must
 * never appear in @tfrc/web's source).
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
const WEB_SRC = path.join(ROOT, "packages", "web", "src");
const APP_SRC = path.join(ROOT, "packages", "app", "src");

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

// @tfrc/web must never import @tfrc/app, and must never reference the
// reserved gain/loss tokens (decisions/0002.md).
// Reserved-token check matches DEFINITIONS (--color-gain:) and USAGES
// (var(--color-gain)) only — not a bare mention inside a comment, since
// explaining *why* a token is absent is legitimate and common (see
// packages/web/src/tokens.css). A regex that flagged prose would train
// people to stop explaining the rule in comments, which is the opposite
// of what AGENTS.md wants.
check(walk(WEB_SRC), [
  { pattern: /@import\s+["']@tfrc\/app/i, message: "imports @tfrc/app — forbidden, see AGENTS.md rule 3" },
  { pattern: /@import\s+["'].*packages\/app/i, message: "imports from packages/app by relative path — forbidden" },
  { pattern: /--color-gain\s*:|var\(\s*--color-gain\s*\)/, message: "defines or uses reserved token --color-gain — see decisions/0002.md" },
  { pattern: /--color-loss\s*:|var\(\s*--color-loss\s*\)/, message: "defines or uses reserved token --color-loss — see decisions/0002.md" },
], "web");

// @tfrc/app must never import @tfrc/web.
check(walk(APP_SRC), [
  { pattern: /@import\s+["']@tfrc\/web/i, message: "imports @tfrc/web — forbidden, see AGENTS.md rule 3" },
  { pattern: /@import\s+["'].*packages\/web/i, message: "imports from packages/web by relative path — forbidden" },
], "app");

if (violations.length) {
  console.error("✗ Boundary violations found:\n");
  for (const v of violations) console.error("  - " + v);
  console.error("\nSee AGENTS.md rule 3 and decisions/0001.md / 0002.md.");
  process.exit(1);
}

console.log("✓ No boundary violations — @tfrc/web and @tfrc/app remain independent.");
