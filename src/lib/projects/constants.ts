import type { LayoutVariant } from "./types";

export const PROJECTS_ROOT = ["public", "images", "projects"] as const;

export const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

export const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".m4v"]);

export const PRESENTATION_EXTENSIONS = new Set([".ppt", ".pptx"]);

/** Google Drive duplicate export folders — skip */
export const SKIP_FOLDER_PATTERN = /-\d{8}T\d{6}Z-/i;

export interface CategoryDefinition {
  slug: string;
  folderName: string;
  title: string;
  description: string;
  layout: LayoutVariant;
  tags: string[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "ui-ux-product-design",
    folderName: "UI-UX and Product Designs",
    title: "UI/UX Product Design",
    description:
      "Spatial product interfaces, dashboards, and mobile experiences crafted with precision.",
    layout: "ui-showcase",
    tags: ["UI/UX", "Product Design", "Dashboards"],
  },
  {
    slug: "graphic-design",
    folderName: "Graphic Design Works",
    title: "Graphic Design",
    description:
      "Editorial compositions, brand visuals, and expressive design explorations.",
    layout: "editorial",
    tags: ["Branding", "Print", "Visual Design"],
  },
  {
    slug: "videos",
    folderName: "Videos",
    title: "Videos",
    description:
      "Cinematic edits, motion campaigns, and immersive moving-image stories.",
    layout: "video",
    tags: ["Motion", "Editing", "Cinematic"],
  },
  {
    slug: "powerpoint-design",
    folderName: "Power Point designs",
    title: "PowerPoint Design",
    description:
      "Presentation systems and narrative slide experiences built for clarity and impact.",
    layout: "presentation",
    tags: ["Presentations", "Storytelling", "Decks"],
  },
  {
    slug: "case-study",
    folderName: "Case Study",
    title: "Case Studies",
    description:
      "End-to-end design journeys — strategy, structure, and shipped outcomes.",
    layout: "case-study",
    tags: ["Case Study", "UX Strategy", "Process"],
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<string, CategoryDefinition>;
