import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I told my phone I needed space. It deleted my photos, cleared my cache, and asked if I wanted it to leave too.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  console.error(`line must be 1-200 characters, got ${LINE.length}`);
  process.exit(1);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  console.error("line must be non-whitespace and a single line");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

// Ties break on bytes, so assert the exact byte length and read the file
// back to confirm what landed on disk is byte-identical to the line.
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes !== 110) {
  console.error(`expected 110 bytes, got ${bytes}`);
  process.exit(1);
}
if (readFileSync(target, "utf8") !== LINE) {
  console.error("read-back mismatch: entry.txt differs from the line");
  process.exit(1);
}
