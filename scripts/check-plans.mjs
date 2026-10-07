import fs from "fs";
import path from "path";

const ROOT = "C:\\Users\\hp\\Desktop\\Promed\\ava-next";
const PLANS_DIR = path.join(ROOT, "public\\docs\\plans");
const MANIFEST_PATH = path.join(ROOT, "data\\plan-manifest.json");

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
const onDisk = new Set(fs.readdirSync(PLANS_DIR).map((f) => f.toLowerCase()));

const errors = [];
const warnings = [];
const unused = [];

for (const [ref, entry] of Object.entries(manifest)) {
  const fields = ["src", "webp", "thumb", "rdcSrc", "rdcWebp", "rdcThumb"];
  for (const field of fields) {
    const value = entry[field];
    if (!value) continue;
    const name = path.basename(value).toLowerCase();
    if (!onDisk.has(name)) {
      errors.push(`MANIFEST ${ref} ${field} -> ${name} missing on disk`);
    }
  }
}

// Files on disk that are not referenced by any manifest entry.
const referenced = new Set();
for (const entry of Object.values(manifest)) {
  for (const field of ["src", "webp", "thumb", "rdcSrc", "rdcWebp", "rdcThumb"]) {
    const value = entry[field];
    if (value) referenced.add(path.basename(value).toLowerCase());
  }
}
for (const file of onDisk) {
  if (!referenced.has(file)) {
    unused.push(file);
  }
}

if (unused.length) {
  warnings.push(`Unused files in docs/plans: ${unused.join(", ")}`);
}

if (errors.length) {
  console.error("PLAN CHECK FAILED");
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}

if (warnings.length) {
  warnings.forEach((w) => console.warn("  ! " + w));
}

console.log(`PLAN CHECK OK — ${Object.keys(manifest).length} units verified, ${onDisk.size} files on disk.`);