import fs from "fs";
import path from "path";
import type { CategoryDefinition } from "./constants";
import {
  CATEGORY_OVERRIDES,
  defaultDescription,
  defaultTags,
  inferLayoutFromFolderName,
} from "./category-overrides";
import { SKIP_FOLDER_PATTERN } from "./constants";
import { getProjectsDir } from "./paths";
import { slugify } from "./slug";

function titleFromFolderName(folderName: string): string {
  return folderName
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Discovers category stacks from top-level folders in /public/images/projects/.
 */
export function discoverCategoryDefinitions(): CategoryDefinition[] {
  const root = getProjectsDir();
  if (!fs.existsSync(root)) return [];

  const folders = fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !SKIP_FOLDER_PATTERN.test(entry.name)
    )
    .map((entry) => entry.name);

  const categories: CategoryDefinition[] = folders.map((folderName) => {
    const override = CATEGORY_OVERRIDES[folderName];
    const slug = override?.slug ?? slugify(folderName);
    const title = override?.title ?? titleFromFolderName(folderName);
    const layout = override?.layout ?? inferLayoutFromFolderName(folderName);

    return {
      slug,
      folderName,
      title,
      description:
        override?.description ?? defaultDescription(folderName, title),
      layout,
      tags: override?.tags ?? defaultTags(folderName),
      order: override?.order ?? 100,
    };
  });

  return categories.sort((a, b) => {
    const orderDiff = (a.order ?? 100) - (b.order ?? 100);
    if (orderDiff !== 0) return orderDiff;
    return a.title.localeCompare(b.title);
  });
}

export function getCategoryDefinitionBySlug(
  slug: string,
  definitions?: CategoryDefinition[]
): CategoryDefinition | undefined {
  const list = definitions ?? discoverCategoryDefinitions();
  return list.find((c) => c.slug === slug);
}

export function getCategoryDefinitionByFolder(
  folderName: string,
  definitions?: CategoryDefinition[]
): CategoryDefinition | undefined {
  const list = definitions ?? discoverCategoryDefinitions();
  return list.find((c) => c.folderName === folderName);
}
