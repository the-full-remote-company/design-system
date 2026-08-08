#!/usr/bin/env node
/**
 * tfrc-verify — the consumer-side half of this design system's governance.
 *
 * Ships with @tfrc/foundation so that a product repo, which this design
 * system's maintainers cannot see, can check itself:
 *
 *   npx tfrc-verify
 *
 * Why this exists: once the packages are installed from a registry
 * (decisions/0007.md), nothing inside the design-system repo can stop a
 * consumer from mixing the two dialects, using a reserved market-direction
 * color as decoration, or hard-coding a hex value next to a token. Both of
 * the first two are forbidden by Articles VI and V of the constitution, and
 * both were unreachable states while the only consumers lived in-repo.
 * Article II ("every rule that can be mechanically checked must be")
 * therefore obliges us to ship a check a consumer can run. See
 * specs/002-product-consumption-contract/ for the requirements this
 * implements (FR-002, FR-006, FR-007, FR-008).
 *
 * Dependency-free by design: it must run via `npx` in a repo that has
 * installed nothing but this package.
 *
 * Exit codes: 0 = compliant, 1 = violation(s) found, 2 = usage error.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const SCAN_EXTENSIONS = new Set([
  ".css",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".html",
  ".svelte",
  ".vue",
  ".astro",
]);

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".hg",
  "dist",
  "build",
  "out",
  "coverage",
  "vendor",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".output",
  ".turbo",
  ".cache",
  ".vercel",
  ".astro",
]);

const MARKETING_PKG = "@tfrc/marketing";
const PRODUCT_PKG = "@tfrc/product";
const RESERVED_TOKENS = ["--color-gain", "--color-loss"];

// oklch hue bands reserved for market direction. Kept in sync with
// STATE.md's reserved_hue_bands and decisions/0002.md.
const RESERVED_HUE_BANDS = [
  { name: "gain", min: 130, max: 170 },
  { name: "loss", min: 5, max: 40 },
];

// An escape hatch that is deliberately NOT silent: a raw value preceded by
// `tfrc-allow-raw: <reason>` is downgraded from a violation to a reported
// allowance, and the summary always prints how many exist. specs/002's edge
// cases require that a local override be visible rather than accepted
// quietly; a hatch that produced no output would fail that.
const ALLOW_RAW = /tfrc-allow-raw:\s*\S/;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(
    [
      "tfrc-verify — verify a consumer repo against The Full Remote Company design system",
      "",
      "Usage: npx tfrc-verify [--dir <path>] [--quiet]",
      "",
      "  --dir <path>   directory to verify (default: current working directory)",
      "  --quiet        print only violations and the summary line",
      "",
      "Checks:",
      "  1. exactly one dialect     — @tfrc/marketing and @tfrc/product are never combined",
      "  2. reserved colors         — gain/loss tokens and hue bands mean market direction only",
      "  3. no raw values           — every color resolves through a named token",
      "  4. pinned version          — every @tfrc/* dependency is an exact version",
      "",
      "Exit codes: 0 compliant, 1 violations found, 2 usage error.",
    ].join("\n")
  );
  process.exit(0);
}

const quiet = args.includes("--quiet");
const dirFlag = args.indexOf("--dir");
const ROOT = path.resolve(dirFlag === -1 ? process.cwd() : args[dirFlag + 1] || "");

if (!fs.existsSync(ROOT) || !fs.statSync(ROOT).isDirectory()) {
  console.error(`✗ Not a directory: ${ROOT}`);
  process.exit(2);
}

const violations = [];
const allowances = [];

function violation(code, file, line, message) {
  violations.push({ code, file, line, message });
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (SCAN_EXTENSIONS.has(path.extname(entry.name)) && !/\.min\.(css|js)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Check 4 (first, because it also tells us which dialect we are)      */
/* FR-002: one explicit, recorded version. FR-003: one dialect only.   */
/* ------------------------------------------------------------------ */

const EXACT_VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const pkgPath = path.join(ROOT, "package.json");
let declaredDeps = {};

if (!fs.existsSync(pkgPath)) {
  violation("NO_MANIFEST", "package.json", 0, "no package.json found — cannot determine which dialect or version this consumer adopted");
} else {
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch (err) {
    console.error(`✗ package.json is not valid JSON: ${err.message}`);
    process.exit(2);
  }
  declaredDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies, pkg.peerDependencies);
  for (const [name, range] of Object.entries(declaredDeps)) {
    if (!name.startsWith("@tfrc/")) continue;
    if (!EXACT_VERSION.test(String(range))) {
      violation(
        "VERSION_PIN",
        "package.json",
        0,
        `${name} is declared as "${range}" — must be an exact version (e.g. "1.0.0") so this consumer's appearance cannot change without a deliberate upgrade`
      );
    }
  }
}

const dependsOnMarketing = Object.prototype.hasOwnProperty.call(declaredDeps, MARKETING_PKG);
const dependsOnProduct = Object.prototype.hasOwnProperty.call(declaredDeps, PRODUCT_PKG);

const files = walk(ROOT);

// Source-level dialect references, so a dialect reached around package.json
// (a transitive dep, a vendored copy, a CDN link) is still caught.
const referencedInSource = { marketing: [], product: [] };
const RESERVED_TOKEN_USES = [];

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/;
const FUNCTIONAL_COLOR = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^)\n]*\)?/;
const OKLCH_LITERAL = /\boklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+)/g;

for (const file of files) {
  const rel = path.relative(ROOT, file) || path.basename(file);
  let content;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;
    const prev = i > 0 ? lines[i - 1] : "";
    const allowed = ALLOW_RAW.test(line) || ALLOW_RAW.test(prev);

    if (/@tfrc\/marketing/.test(line)) referencedInSource.marketing.push(`${rel}:${lineNo}`);
    if (/@tfrc\/product/.test(line)) referencedInSource.product.push(`${rel}:${lineNo}`);

    /* --- Check 2: reserved market-direction colors (FR-008) --- */
    for (const token of RESERVED_TOKENS) {
      const defines = new RegExp(`${token}\\s*:`).test(line);
      const uses = new RegExp(`var\\(\\s*${token}\\s*[,)]`).test(line);
      if (defines) {
        violation(
          "RESERVED_REDEFINE",
          rel,
          lineNo,
          `redefines ${token}, which is owned by ${PRODUCT_PKG} — a consumer may use it, never redefine it`
        );
      } else if (uses) {
        RESERVED_TOKEN_USES.push({ rel, lineNo, token });
      }
    }

    // Raw oklch inside a reserved hue band: the half of the reserved-hue
    // rule that a token-name grep cannot see. Only oklch is checked, because
    // only oklch states its hue directly; a hex in the same band will still
    // be caught as a raw value below, just with a less specific message.
    // This is a known, deliberate limit, not an oversight.
    OKLCH_LITERAL.lastIndex = 0;
    let m;
    while ((m = OKLCH_LITERAL.exec(line))) {
      const hue = parseFloat(m[3]);
      if (Number.isNaN(hue)) continue;
      const band = RESERVED_HUE_BANDS.find((b) => hue >= b.min && hue <= b.max);
      if (band) {
        violation(
          "RESERVED_HUE",
          rel,
          lineNo,
          `raw oklch hue ${hue} falls in the reserved "${band.name}" band (${band.min}–${band.max}), which means market direction only — never decoration or brand`
        );
      }
    }

    /* --- Check 3: no raw values (FR-006) --- */
    const hexMatch = matchHexValue(line);
    const funcMatch = line.match(FUNCTIONAL_COLOR);
    const rawFound = hexMatch || (funcMatch ? funcMatch[0] : null);
    if (rawFound) {
      if (allowed) {
        allowances.push({ rel, lineNo, value: rawFound });
      } else {
        violation(
          "RAW_VALUE",
          rel,
          lineNo,
          `raw color value "${rawFound}" — every color must resolve through a named token from the design system's contract`
        );
      }
    }
  }
}

/**
 * Hex colors are only reported in a value position. A bare `#abc {` is an
 * ID selector, and `href="#abc"` is a fragment link; flagging either would
 * make the tool cry wolf, and a tool that cries wolf gets switched off.
 */
function matchHexValue(line) {
  if (/\b(?:href|xlink:href|url)\s*[=(]/.test(line)) return null;
  const m = line.match(HEX);
  if (!m) return null;
  const before = line.slice(0, m.index);
  // A value position: after a CSS `prop:`, a JS assignment, or inside a string.
  if (!/[:=]|["'`]/.test(before)) return null;
  return m[0];
}

/* ------------------------------------------------------------------ */
/* Check 1: exactly one dialect (FR-003, FR-007)                       */
/* ------------------------------------------------------------------ */

const usesMarketing = dependsOnMarketing || referencedInSource.marketing.length > 0;
const usesProduct = dependsOnProduct || referencedInSource.product.length > 0;

if (usesMarketing && usesProduct) {
  const where = [...referencedInSource.marketing.slice(0, 3), ...referencedInSource.product.slice(0, 3)];
  violation(
    "MIXED_DIALECT",
    where[0] ? where[0].split(":")[0] : "package.json",
    0,
    `both ${MARKETING_PKG} and ${PRODUCT_PKG} are present — they are two dialects of one language and must never be combined in one bundle` +
      (where.length ? ` (seen at ${where.join(", ")})` : "")
  );
} else if (!usesMarketing && !usesProduct) {
  violation(
    "NO_DIALECT",
    "package.json",
    0,
    `neither ${MARKETING_PKG} nor ${PRODUCT_PKG} is present — nothing to verify. Add exactly one as an exact-version dependency.`
  );
}

// A marketing consumer may not touch the reserved tokens at all; a product
// consumer may use them, for market direction, which is what they're for.
for (const use of RESERVED_TOKEN_USES) {
  if (usesMarketing && !usesProduct) {
    violation(
      "RESERVED_TOKEN",
      use.rel,
      use.lineNo,
      `uses ${use.token}, which belongs to ${PRODUCT_PKG} only — the marketing dialect must never reference market-direction color`
    );
  }
}

/* ------------------------------------------------------------------ */
/* Report                                                             */
/* ------------------------------------------------------------------ */

const dialect = usesMarketing && !usesProduct ? "marketing" : usesProduct && !usesMarketing ? "product" : "indeterminate";

if (!quiet) {
  console.log(`tfrc-verify — ${path.relative(process.cwd(), ROOT) || "."}`);
  console.log(`  dialect: ${dialect}`);
  console.log(`  files scanned: ${files.length}`);
  const pinned = Object.entries(declaredDeps).filter(([n]) => n.startsWith("@tfrc/"));
  if (pinned.length) {
    console.log(`  design system: ${pinned.map(([n, v]) => `${n}@${v}`).join(", ")}`);
  }
  console.log("");
}

if (allowances.length) {
  console.log(`! ${allowances.length} explicitly-allowed raw value${allowances.length === 1 ? "" : "s"} (tfrc-allow-raw):`);
  for (const a of allowances) console.log(`    ${a.rel}:${a.lineNo}  ${a.value}`);
  console.log("  Allowed, but counted. Each one is a value the shared language does not cover.");
  console.log("");
}

if (violations.length) {
  console.error(`✗ ${violations.length} violation${violations.length === 1 ? "" : "s"} found:\n`);
  for (const v of violations) {
    const loc = v.line ? `${v.file}:${v.line}` : v.file;
    console.error(`  [${v.code}] ${loc}`);
    console.error(`      ${v.message}`);
  }
  console.error("\nSee https://github.com/the-full-remote-company/design-system — CONSUMING.md");
  process.exit(1);
}

console.log("✓ Consumer is compliant: one dialect, pinned version, no raw values, reserved colors respected.");
