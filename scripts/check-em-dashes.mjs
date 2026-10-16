// Fails when an em dash (U+2014) appears anywhere the team writes text.
// Dependency free on purpose, so it runs on any machine with Node.
import fs from "node:fs";
import path from "node:path";

const EM_DASH = String.fromCharCode(0x2014);
const ROOTS = ["src", "scripts", "README.md", "CLAUDE.md", "brief.md"];
const SKIP = new Set(["node_modules", ".next", "out", ".git"]);
const TEXT_FILE = /\.(ts|tsx|js|mjs|css|md|json|svg|txt)$/;

function collect(target, files) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isFile()) return TEXT_FILE.test(target) ? [...files, target] : files;
  for (const name of fs.readdirSync(target)) {
    if (!SKIP.has(name)) files = collect(path.join(target, name), files);
  }
  return files;
}

function findDashes(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  return lines.flatMap((line, i) => (line.includes(EM_DASH) ? [`${file}:${i + 1}`] : []));
}

const hits = ROOTS.flatMap((root) => collect(root, [])).flatMap(findDashes);

if (hits.length > 0) {
  console.error("Em dashes found. Use a comma, colon, period or parentheses instead:");
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log("No em dashes found.");
