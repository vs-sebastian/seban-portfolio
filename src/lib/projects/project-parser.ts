import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import type { Category, MediaAsset, Project, ProjectSummary } from "./types";
import {
  CATEGORIES,
  CATEGORY_BY_SLUG,
  SKIP_FOLDER_PATTERN,
  type CategoryDefinition,
} from "./constants";
import {
  buildTags,
  getMediaKind,
  inferLayout,
  orientationFromDimensions,
  pickCover,
} from "./media-analyzer";
import { getProjectsDir, toPublicSrc } from "./paths";
import { slugify, titleFromFileName } from "./slug";
import {
  buildVideoProjectsFromCloudinary,
  resolveVideoSrc,
} from "./video-sources";

let cache: {
  categories: Category[];
  projects: Project[];
  byCategory: Map<string, Project[]>;
  bySlug: Map<string, Project>;
} | null = null;

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

    const kind = getMediaKind(abs);
    if (!kind) continue;

    // Videos are hosted on Cloudinary — skip local video files in the walk
    if (kind === "video") continue;

    acc.push({ absPath: abs, publicPath: pub });
  }

  return acc;
}

function buildAsset(
  absPath: string,
  publicPath: string,
  order: number
): MediaAsset | null {
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
    if (!remote) return null;
    return {
      id: slugify(`${fileName}-${order}`),
      kind: "video",
      src: remote,
      fileName,
      orientation: orientationFromDimensions(width, height),
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
  const files = walkMediaFiles(projectDir, publicPrefix);
  return files
    .map((f, i) => buildAsset(f.absPath, f.publicPath, i))
    .filter((a): a is MediaAsset => a !== null)
    .sort((a, b) => a.fileName.localeCompare(b.fileName));
}

function buildProject(
  category: CategoryDefinition,
  projectSlug: string,
  title: string,
  projectDir: string,
  publicPrefix: string
): Project | null {
  const media = parseMediaAssets(projectDir, publicPrefix);
  if (media.length === 0) return null;

  const layout = inferLayout(
    category,
    media.map((m) => ({
      kind: m.kind,
      relativePath: m.src,
    }))
  );

  const cover = pickCover(media);

  return {
    slug: projectSlug,
    title,
    categorySlug: category.slug,
    categoryTitle: category.title,
    layout,
    cover,
    mediaCount: media.length,
    description: `${category.title} exploration — ${media.length} assets.`,
    tags: buildTags(category, layout, title),
    media,
  };
}

function parseCategoryFolder(
  category: CategoryDefinition,
  categoryPath: string
): Project[] {
  if (category.slug === "videos") {
    return buildVideoProjectsFromCloudinary(category);
  }

  const projects: Project[] = [];
  if (!fs.existsSync(categoryPath)) return projects;

  const entries = fs
    .readdirSync(categoryPath, { withFileTypes: true })
    .filter((e) => !e.name.startsWith("."));

  const dirs = entries.filter((e) => e.isDirectory() && !shouldSkipDir(e.name));
  const looseFiles = entries.filter((e) => e.isFile() && getMediaKind(e.name));

  for (const dir of dirs) {
    const title = dir.name;
    const projectSlug = slugify(title);
    const projectDir = path.join(categoryPath, dir.name);
    const publicPrefix = `images/projects/${category.folderName}/${dir.name}`;

    const project = buildProject(
      category,
      projectSlug,
      title,
      projectDir,
      publicPrefix
    );
    if (project) projects.push(project);
  }

  if (looseFiles.length > 0) {
    const images = looseFiles.filter((f) => getMediaKind(f.name) === "image");
    const presentations = looseFiles.filter(
      (f) => getMediaKind(f.name) === "presentation"
    );

    if (images.length > 0 && category.slug === "graphic-design") {
      const publicPrefix = `images/projects/${category.folderName}`;
      const media = images
        .map((f, i) =>
          buildAsset(
            path.join(categoryPath, f.name),
            `${publicPrefix}/${f.name}`,
            i
          )
        )
        .filter((a): a is MediaAsset => a !== null);

      if (media.length > 0) {
        projects.push({
          slug: "selected-works",
          title: "Selected Works",
          categorySlug: category.slug,
          categoryTitle: category.title,
          layout: "editorial",
          cover: pickCover(media),
          mediaCount: media.length,
          description: "Curated graphic design explorations and visual compositions.",
          tags: buildTags(category, "editorial", "Selected Works"),
          media,
        });
      }
    }

    for (const file of presentations) {
      const title = titleFromFileName(file.name);
      const projectSlug = slugify(title);
      const publicPrefix = `images/projects/${category.folderName}`;
      const media = [
        buildAsset(
          path.join(categoryPath, file.name),
          `${publicPrefix}/${file.name}`,
          0
        ),
      ].filter((a): a is MediaAsset => a !== null);

      const slideImages = media.filter((m) => m.kind === "image");
      const layout =
        slideImages.length > 0 ? "presentation" : "presentation";

      projects.push({
        slug: projectSlug,
        title,
        categorySlug: category.slug,
        categoryTitle: category.title,
        layout,
        cover: pickCover(media) ?? media[0],
        mediaCount: media.length,
        description: "Presentation design — slide exports and deck assets.",
        tags: buildTags(category, "presentation", title),
        media,
      });
    }
  }

  return projects.sort((a, b) => a.title.localeCompare(b.title));
}

function loadAll(): void {
  const root = getProjectsDir();
  const allProjects: Project[] = [];

  const categories: Category[] = CATEGORIES.map((def) => {
    const categoryPath = path.join(root, def.folderName);
    const projects = parseCategoryFolder(def, categoryPath);
    allProjects.push(...projects);

    const cover =
      projects.find((p) => p.cover)?.cover ??
      projects[0]?.cover ??
      null;

    return {
      slug: def.slug,
      title: def.title,
      description: def.description,
      layout: def.layout,
      folderName: def.folderName,
      projectCount: projects.length,
      cover,
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
  const cat = CATEGORY_BY_SLUG[categorySlug];
  if (!cat) return [];
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

export function getFeaturedProjects(limit = 5): ProjectSummary[] {
  const categories = getAllCategories();
  const picked: ProjectSummary[] = [];

  for (const cat of categories) {
    const projects = getProjectsByCategory(cat.slug);
    if (projects[0]) {
      const { media, ...summary } = projects[0];
      picked.push(summary);
    }
    if (picked.length >= limit) break;
  }

  const remaining = getAllProjects()
    .filter((p) => !picked.some((x) => x.slug === p.slug))
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

/** Invalidate cache in dev when filesystem changes */
export function refreshProjectCache(): void {
  cache = null;
  ensureCache();
}
