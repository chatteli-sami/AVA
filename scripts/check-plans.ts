import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Floor, Unit } from "../data/inventory";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const planRoots = [
  path.join(publicRoot, "docs", "plans"),
  path.join(publicRoot, "docs", "plans-interactifs"),
];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSION = /\.(?:avif|jpe?g|png|webp|orig)$/i;
const LOCAL_ASSET_EXTENSION = /\.(?:avif|jpe?g|png|webp|orig|html?|css|js)$/i;

const IGNORED_FILE_PATTERNS = [
  /\.orig$/i,
  /-thumb\./i,
  /^dup\d+-/,
  /^appart1_\d+-/,
  /^appart2_\d+-/,
];

interface InventoryData {
  UNITS: ReadonlyArray<Unit>;
  FLOORS: ReadonlyArray<{ floor: Floor; urlValue: string }>;
}

interface WalkEntry {
  absolutePath: string;
  relativePath: string;
  isDirectory: boolean;
}

function isNormalizedName(name: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*$/.test(name);
}

async function walk(directory: string): Promise<WalkEntry[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const results: WalkEntry[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(publicRoot, absolutePath).replace(/\\/g, "/");
    results.push({
      absolutePath,
      relativePath,
      isDirectory: entry.isDirectory(),
    });
    if (entry.isDirectory()) results.push(...(await walk(absolutePath)));
  }

  return results;
}

function localReferencePath(htmlFile: string, reference: string): string | null {
  const value = reference.trim();
  if (
    !value ||
    value.startsWith("#") ||
    /^(?:https?:|data:|javascript:|mailto:|\/\/)/i.test(value)
  ) {
    return null;
  }

  const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]).replace(/\\/g, "/");
  if (!LOCAL_ASSET_EXTENSION.test(pathname)) return null;

  return path.resolve(
    pathname.startsWith("/")
      ? path.join(publicRoot, pathname.replace(/^\/+/, ""))
      : path.resolve(path.dirname(htmlFile), pathname),
  );
}

async function collectUnitAssets(
  unit: Unit,
  unitAssetPaths: Set<string>,
  errors: string[],
): Promise<void> {
  const directReferences = [
    unit.planImage,
    unit.planThumb,
    unit.planPdf,
    unit.interactivePlan,
  ].filter((reference): reference is string => Boolean(reference));
  const pendingHtml: string[] = [];

  for (const reference of directReferences) {
    if (!reference.startsWith("/")) {
      errors.push(`${unit.ref}: plan paths must be public-root URLs: ${reference}`);
      continue;
    }

    const absolutePath = path.resolve(publicRoot, reference.replace(/^\/+/, ""));
    unitAssetPaths.add(absolutePath.toLowerCase());
    try {
      await stat(absolutePath);
    } catch {
      errors.push(`${unit.ref}: plan file does not exist: ${reference}`);
      continue;
    }
    if (/\.html?$/i.test(absolutePath)) pendingHtml.push(absolutePath);
    if (unit.planPdf === reference) {
      const header = await readFile(absolutePath);
      if (header.subarray(0, 5).toString("ascii") !== "%PDF-") {
        errors.push(`${unit.ref}: linked file is not a valid PDF: ${reference}`);
      }
    }
  }

  const visitedHtml = new Set<string>();
  while (pendingHtml.length > 0) {
    const htmlFile = pendingHtml.pop();
    if (!htmlFile || visitedHtml.has(htmlFile.toLowerCase())) continue;
    visitedHtml.add(htmlFile.toLowerCase());
    const html = await readFile(htmlFile, "utf8");
    const references = new Set<string>();

    for (const match of html.matchAll(/["']([^"'<>\s]+)["']/g)) {
      if (LOCAL_ASSET_EXTENSION.test(match[1].split(/[?#]/, 1)[0])) {
        references.add(match[1]);
      }
    }
    for (const match of html.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)) {
      references.add(match[1]);
    }

    for (const reference of references) {
      const absolutePath = localReferencePath(htmlFile, reference);
      if (!absolutePath) continue;
      unitAssetPaths.add(absolutePath.toLowerCase());
      try {
        await stat(absolutePath);
      } catch {
        errors.push(
          `${unit.ref}: local interactive-plan reference does not exist: ${path.relative(htmlFile, absolutePath)} (${reference})`,
        );
        continue;
      }
      if (/\.html?$/i.test(absolutePath)) pendingHtml.push(absolutePath);
    }
  }
}

async function main(): Promise<void> {
  const inventoryPath = pathToFileURL(path.join(root, "data", "inventory.ts")).href;
  const inventory = (await import(inventoryPath)) as InventoryData;
  const knownFloors = new Set(inventory.FLOORS.map(({ floor }) => floor));
  const errors: string[] = [];
  const unitAssetPaths = new Set<string>();
  const unitFolderPattern = /\/(?:d\d+|s3-\d+|s45-\d+|appart[1-3]_\d+)\//;
  const files: WalkEntry[] = [];

  for (const directory of planRoots) {
    try {
      files.push(...(await walk(directory)));
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      errors.push(`Cannot read plan directory ${path.relative(root, directory)}: ${detail}`);
    }
  }

  for (const entry of files) {
    if (entry.relativePath.startsWith("docs/plans-interactifs/pack/")) continue;
    const segments = entry.relativePath.split("/");
    for (const segment of segments) {
      if (!isNormalizedName(segment) || segment !== segment.toLowerCase()) {
        errors.push(`Name violates lowercase ASCII naming rules: ${entry.relativePath}`);
        break;
      }
    }
  }

  for (const unit of inventory.UNITS) {
    if (unit.floors.length === 0) {
      errors.push(`${unit.ref}: no floor is assigned`);
    }
    for (const floor of unit.floors) {
      if (!knownFloors.has(floor)) errors.push(`${unit.ref}: unknown floor "${floor}"`);
    }
    await collectUnitAssets(unit, unitAssetPaths, errors);
  }

  const candidateAssets = files.filter((entry) => {
    if (entry.isDirectory) return false;
    if (entry.relativePath.startsWith("docs/plans-interactifs/pack/")) return false;
    const basename = path.basename(entry.relativePath);
    if (IGNORED_FILE_PATTERNS.some((pattern) => pattern.test(basename))) return false;
    const normalized = entry.relativePath.toLowerCase();
    const isStaticPlan2000 = normalized.startsWith("docs/plans/") && /-2000\.webp$/.test(basename);
    const isStaticPlan800 = normalized.startsWith("docs/plans/") && /-800\.webp$/.test(basename);
    const isUpperFloorView = /^\/docs\/plans\/dup-\d+-(?:2000|800)\.webp$/.test(`/${normalized}`);
    const isUnitInteractiveAsset =
      normalized.startsWith("docs/plans-interactifs/") &&
      unitFolderPattern.test(`/${normalized}`) &&
      /\.html?$/.test(basename);
    return (isStaticPlan2000 || isStaticPlan800 || isUnitInteractiveAsset) && !isUpperFloorView;
  });

  for (const asset of candidateAssets) {
    if (!unitAssetPaths.has(asset.absolutePath.toLowerCase())) {
      errors.push(`Plan file is not used by any inventory unit: /${asset.relativePath}`);
    }
  }

  const planImages = files.filter((entry) => {
    if (entry.isDirectory) return false;
    const basename = path.basename(entry.relativePath);
    if (IGNORED_FILE_PATTERNS.some((pattern) => pattern.test(basename))) return false;
    return IMAGE_EXTENSION.test(entry.absolutePath);
  });
  for (const image of planImages) {
    const { size } = await stat(image.absolutePath);
    if (size > MAX_IMAGE_BYTES) {
      errors.push(
        `Plan image exceeds the 5 MB limit (${size} bytes): /${image.relativePath}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error(`PLAN CHECK FAILED — ${errors.length} issue(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `PLAN CHECK OK — ${inventory.UNITS.length} units, ${planImages.length} plan images, all plan assets linked.`,
  );
}

main().catch((error: unknown) => {
  console.error("PLAN CHECK FAILED — unable to complete validation.");
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
