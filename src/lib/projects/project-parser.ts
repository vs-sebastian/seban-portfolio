import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import type { Category, MediaAsset, Project, ProjectSummary } from "./types";
import { SKIP_FOLDER_PATTERN } from "./constants";
import type { CategoryDefinition } from "./constants";
import {
  buildTags,
  getMediaKind,
  inferLayout,
  orientationFromDimensions,
  pickCover,
} from "./media-analyzer";
import { discoverCategoryDefinitions } from "./discover-categories";
import { getProjectsDir, toPublicSrc } from "./paths";
import { sortMediaAssets, sortProjects } from "./sort";
import { slugify, titleFromFileName } from "./slug";
import {
  CLOUDINARY_VIDEO_CATALOG,
  resolveVideoSrc,
} from "./video-sources";

let cache: {
  categories: Category[];
  projects: Project[];
  byCategory: Map<string, Project[]>;
  bySlug: Map<string, Project>;
} | null = null;

let cacheSourceMtime = 0;

/** Dev-only: invalidate parser cache when project folders change (not every navigation). */
function getProjectsSourceMtime(): number {
  const root = getProjectsDir();
  if (!fs.existsSync(root)) return 0;

  let max = 0;
  try {
    max = fs.statSync(root).mtimeMs;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      try {
        max = Math.max(max, fs.statSync(path.join(root, entry.name)).mtimeMs);
      } catch {
        /* skip */
      }
    }
  } catch {
    return 0;
  }
  return max;
}

function shouldSkipDir(name: string): boolean {
  return SKIP_FOLDER_PATTERN.test(name);
}

function walkMediaFiles(
  dir: string,
  publicPrefix: string,
  acc: { absPath: string; publicPath: string }[] = []
): { absPath: string; publicPath: string }[] {
  if (!fs.existsSync(dir)) return acc;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    const pub = `${publicPrefix}/${entry.name}`;

    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      walkMediaFiles(abs, pub, acc);
      continue;
    }

    if (!fs.existsSync(abs)) continue;

    const kind = getMediaKind(abs);
    if (!kind) continue;

    try {
      if (fs.statSync(abs).size === 0) continue;
    } catch {
      continue;
    }

    acc.push({ absPath: abs, publicPath: pub });
  }

  return acc;
}

function assetExistsOnDisk(publicSrc: string): boolean {
  if (publicSrc.startsWith("http")) return true;
  const rel = decodeURIComponent(publicSrc.replace(/^\//, ""));
  const abs = path.join(process.cwd(), "public", ...rel.split("/"));
  return fs.existsSync(abs);
}

function buildAsset(
  absPath: string,
  publicPath: string,
  order: number
): MediaAsset | null {
  if (!fs.existsSync(absPath)) return null;

  const kind = getMediaKind(absPath);
  if (!kind) return null;

  const fileName = path.basename(absPath);
  let width: number | undefined;
  let height: number | undefined;

  if (kind === "image") {
    try {
      const buffer = fs.readFileSync(absPath);
      const dim = sizeOf(buffer);
      width = dim.width;
      height = dim.height;
    } catch {
      /* use defaults */
    }
  }

  if (kind === "video") {
    const remote = resolveVideoSrc(fileName);
    const src = remote ?? toPublicSrc(publicPath);
    if (!remote && !fs.existsSync(absPath)) return null;

    return {
      id: slugify(`${fileName}-${order}`),
      kind: "video",
      src,
      fileName,
      orientation: "landscape",
      order,
    };
  }

  return {
    id: slugify(`${fileName}-${order}`),
    kind,
    src: toPublicSrc(publicPath),
    fileName,
    width,
    height,
    orientation: orientationFromDimensions(width, height),
    order,
  };
}

function parseMediaAssets(
  projectDir: string,
  publicPrefix: string
): MediaAsset[] {
  if (!fs.existsSync(projectDir)) return [];

  const files = walkMediaFiles(projectDir, publicPrefix);
  const media = files
    .map((f, i) => buildAsset(f.absPath, f.publicPath, i))
    .filter((a): a is MediaAsset => a !== null && assetExistsOnDisk(a.src));

  return sortMediaAssets(media);
}

function uniqueProjectSlug(base: string, used: Set<string>): string {
  let slug = base || "project";
  let counter = 2;
  while (used.has(slug)) {
    slug = `${base}-${counter++}`;
  }
  used.add(slug);
  return slug;
}

function buildProjectFromMedia(
  category: CategoryDefinition,
  title: string,
  projectSlug: string,
  media: MediaAsset[],
  description?: string
): Project | null {
  if (media.length === 0) return null;

  const layout = inferLayout(
    category,
    media.map((m) => ({ kind: m.kind, relativePath: m.src }))
  );

  return {
    slug: projectSlug,
    title,
    categorySlug: category.slug,
    categoryTitle: category.title,
    layout,
    cover: pickCover(media),
    mediaCount: media.length,
    description:
      description ??
      `${category.title} — ${media.length} asset${media.length === 1 ? "" : "s"}.`,
    tags: buildTags(category, layout, title),
    media,
  };
}

function buildProjectFromFolder(
  category: CategoryDefinition,
  folderName: string,
  categoryPath: string,
  usedSlugs: Set<string>
): Project | null {
  const title = folderName;
  const projectSlug = uniqueProjectSlug(slugify(title), usedSlugs);
  const projectDir = path.join(categoryPath, folderName);
  const publicPrefix = `images/projects/${category.folderName}/${folderName}`;

  return buildProjectFromMedia(
    category,
    title,
    projectSlug,
    parseMediaAssets(projectDir, publicPrefix)
  );
}

function buildProjectFromLooseFiles(
  category: CategoryDefinition,
  categoryPath: string,
  looseFiles: fs.Dirent[],
  usedSlugs: Set<string>
): Project[] {
  const projects: Project[] = [];
  const publicPrefix = `images/projects/${category.folderName}`;

  const byKind = {
    image: looseFiles.filter((f) => getMediaKind(f.name) === "image"),
    video: looseFiles.filter((f) => getMediaKind(f.name) === "video"),
    presentation: looseFiles.filter(
      (f) => getMediaKind(f.name) === "presentation"
    ),
  };

  for (const file of byKind.video) {
    const asset = buildAsset(
      path.join(categoryPath, file.name),
      `${publicPrefix}/${file.name}`,
      0
    );
    if (!asset) continue;

    const title = titleFromFileName(file.name);
    const project = buildProjectFromMedia(
      category,
      title,
      uniqueProjectSlug(slugify(title), usedSlugs),
      [asset],
      `Cinematic piece — ${title}.`
    );
    if (project) projects.push(project);
  }

  for (const file of byKind.presentation) {
    const asset = buildAsset(
      path.join(categoryPath, file.name),
      `${publicPrefix}/${file.name}`,
      0
    );
    if (!asset) continue;

    const title = titleFromFileName(file.name);
    const project = buildProjectFromMedia(
      category,
      title,
      uniqueProjectSlug(slugify(title), usedSlugs),
      [asset],
      "Presentation design — deck assets."
    );
    if (project) projects.push(project);
  }

  if (byKind.image.length > 0) {
    const media = byKind.image
      .map((f, i) =>
        buildAsset(
          path.join(categoryPath, f.name),
          `${publicPrefix}/${f.name}`,
          i
        )
      )
      .filter((a): a is MediaAsset => a !== null && assetExistsOnDisk(a.src));

    if (media.length > 0) {
      const sorted = sortMediaAssets(media);
      const title =
        sorted.length === 1
          ? titleFromFileName(sorted[0].fileName)
          : `${category.title} Gallery`;
      const slug =
        sorted.length === 1
          ? uniqueProjectSlug(slugify(title), usedSlugs)
          : uniqueProjectSlug(`${category.slug}-gallery`, usedSlugs);

      const project = buildProjectFromMedia(
        category,
        title,
        slug,
        sorted,
        sorted.length === 1
          ? undefined
          : `Curated works from the ${category.folderName} collection.`
      );
      if (project) projects.push(project);
    }
  }

  return projects;
}

/** Videos category: canonical Cloudinary catalog only (no folder scan duplicates). */
function buildVideosCategoryProjects(category: CategoryDefinition): Project[] {
  const usedSlugs = new Set<string>();
  const projects: Project[] = [];

  for (const [index, entry] of CLOUDINARY_VIDEO_CATALOG.entries()) {
    const asset: MediaAsset = {
      id: entry.slug,
      kind: "video",
      src: entry.url,
      fileName: entry.fileNames?.[0] ?? `${entry.slug}.mp4`,
      orientation: "landscape",
      order: index,
    };

    const project = buildProjectFromMedia(
      category,
      entry.title,
      uniqueProjectSlug(entry.slug, usedSlugs),
      [asset],
      `Cinematic piece — ${entry.title}.`
    );
    if (project) projects.push(project);
  }

  return sortProjects(projects);
}

function dedupeProjectsByMediaSrc(projects: Project[]): Project[] {
  const seen = new Set<string>();
  const out: Project[] = [];

  for (const project of projects) {
    const primarySrc = project.cover?.src ?? project.media[0]?.src;
    if (!primarySrc) {
      out.push(project);
      continue;
    }
    if (seen.has(primarySrc)) continue;
    seen.add(primarySrc);
    out.push(project);
  }

  return out;
}

function parseCategoryFolder(
  category: CategoryDefinition,
  categoryPath: string
): Project[] {
  const projects: Project[] = [];
  const usedSlugs = new Set<string>();

  if (category.slug === "videos") {
    return buildVideosCategoryProjects(category);
  }

  if (!fs.existsSync(categoryPath)) {
    return projects;
  }

  const entries = fs
    .readdirSync(categoryPath, { withFileTypes: true })
    .filter((e) => !e.name.startsWith("."));

  const dirs = entries.filter((e) => e.isDirectory() && !shouldSkipDir(e.name));
  const looseFiles = entries.filter((e) => e.isFile() && getMediaKind(e.name));

  for (const dir of dirs) {
    const project = buildProjectFromFolder(
      category,
      dir.name,
      categoryPath,
      usedSlugs
    );
    if (project) projects.push(project);
  }

  projects.push(
    ...buildProjectFromLooseFiles(category, categoryPath, looseFiles, usedSlugs)
  );

  return sortProjects(dedupeProjectsByMediaSrc(projects));
}

function loadAll(): void {
  const root = getProjectsDir();
  const definitions = discoverCategoryDefinitions();
  const allProjects: Project[] = [];

  const categories: Category[] = definitions.map((def) => {
    const categoryPath = path.join(root, def.folderName);
    const projects = parseCategoryFolder(def, categoryPath);
    allProjects.push(...projects);

    const coverProject = projects.find(
      (p) => p.cover && assetExistsOnDisk(p.cover.src)
    );

    return {
      slug: def.slug,
      title: def.title,
      description: def.description,
      layout: def.layout,
      folderName: def.folderName,
      projectCount: projects.length,
      cover: coverProject?.cover ?? null,
    };
  });

  const byCategory = new Map<string, Project[]>();
  const bySlug = new Map<string, Project>();

  for (const p of allProjects) {
    const list = byCategory.get(p.categorySlug) ?? [];
    list.push(p);
    byCategory.set(p.categorySlug, list);
    bySlug.set(`${p.categorySlug}/${p.slug}`, p);
  }

  cache = { categories, projects: allProjects, byCategory, bySlug };
}

function ensureCache() {
  if (process.env.NODE_ENV === "development") {
    const mtime = getProjectsSourceMtime();
    if (cache && cacheSourceMtime === mtime) {
      return cache;
    }
    cacheSourceMtime = mtime;
    cache = null;
  }
  if (!cache) loadAll();
  return cache!;
}

export function getAllCategories(): Category[] {
  return ensureCache().categories.filter((c) => c.projectCount > 0);
}

export function getAllProjects(): Project[] {
  return ensureCache().projects;
}

export function getProjectsByCategory(categorySlug: string): Project[] {
  return ensureCache().byCategory.get(categorySlug) ?? [];
}

export function getCategory(categorySlug: string): Category | undefined {
  return ensureCache().categories.find((c) => c.slug === categorySlug);
}

export function getProject(
  categorySlug: string,
  projectSlug: string
): Project | undefined {
  return ensureCache().bySlug.get(`${categorySlug}/${projectSlug}`);
}

function hasValidCover(project: Project | ProjectSummary): boolean {
  return Boolean(
    project.cover &&
      (project.cover.src.startsWith("http") ||
        assetExistsOnDisk(project.cover.src))
  );
}

export function getFeaturedProjects(limit = 5): ProjectSummary[] {
  const categories = getAllCategories();
  const picked: ProjectSummary[] = [];

  for (const cat of categories) {
    const projects = getProjectsByCategory(cat.slug).filter(hasValidCover);
    if (projects[0]) {
      const { media, ...summary } = projects[0];
      picked.push(summary);
    }
    if (picked.length >= limit) break;
  }

  const remaining = getAllProjects()
    .filter((p) => hasValidCover(p) && !picked.some((x) => x.slug === p.slug))
    .slice(0, limit - picked.length);

  for (const p of remaining) {
    const { media, ...summary } = p;
    picked.push(summary);
    if (picked.length >= limit) break;
  }

  return picked.slice(0, limit);
}

export function getAllCategorySlugs(): string[] {
  return getAllCategories().map((c) => c.slug);
}

export function getAllProjectParams(): { category: string; slug: string }[] {
  return getAllProjects().map((p) => ({
    category: p.categorySlug,
    slug: p.slug,
  }));
}

/** Invalidate cache (e.g. after bulk asset changes in dev) */
export function refreshProjectCache(): void {
  cache = null;
  ensureCache();
}
