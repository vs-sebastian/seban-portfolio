import type { LayoutVariant } from "./types";

/**
 * Optional metadata overrides keyed by exact folder name under /public/images/projects/.
 * New folders work without an entry — defaults are inferred from the folder name.
 */
export interface CategoryOverride {
  /** Stable URL slug (e.g. /projects/ui-ux-product-design) */
  slug?: string;
  title?: string;
  description?: string;
  layout?: LayoutVariant;
  tags?: string[];
  /** Lower = appears first on the projects hub */
  order?: number;
}

export const CATEGORY_OVERRIDES: Record<string, CategoryOverride> = {
  "UI Development": {
    slug: "ui-development",
    title: "UI Development",
    description:
      "Cinematic UI engineering — Next.js builds, motion systems, and immersive front-end craft.",
    layout: "ui-showcase",
    tags: ["Next.js", "Frontend", "Motion", "Engineering"],
    order: 1,
  },
  "UI-UX and Product Designs": {
    slug: "ui-ux-product-design",
    title: "UI/UX Product Design",
    description:
      "Spatial product interfaces, dashboards, and mobile experiences crafted with precision.",
    layout: "ui-showcase",
    tags: ["UI/UX", "Product Design", "Dashboards"],
    order: 2,
  },
  "Graphic Design Works": {
    slug: "graphic-design",
    title: "Graphic Design",
    description:
      "Editorial compositions, brand visuals, and expressive design explorations.",
    layout: "editorial",
    tags: ["Branding", "Print", "Visual Design"],
    order: 3,
  },
  Videos: {
    slug: "videos",
    title: "Videos",
    description:
      "Cinematic edits, motion campaigns, and immersive moving-image stories.",
    layout: "video",
    tags: ["Motion", "Editing", "Cinematic"],
    order: 4,
  },
  "Power Point designs": {
    slug: "powerpoint-design",
    title: "PowerPoint Design",
    description:
      "Presentation systems and narrative slide experiences built for clarity and impact.",
    layout: "presentation",
    tags: ["Presentations", "Storytelling", "Decks"],
    order: 5,
  },
  "Case Study": {
    slug: "case-study",
    title: "Case Studies",
    description:
      "End-to-end design journeys — strategy, structure, and shipped outcomes.",
    layout: "case-study",
    tags: ["Case Study", "UX Strategy", "Process"],
    order: 6,
  },
};

const LAYOUT_HINTS: { pattern: RegExp; layout: LayoutVariant }[] = [
  { pattern: /video|motion|film|reel/i, layout: "video" },
  { pattern: /power\s*point|presentation|ppt|deck|slide/i, layout: "presentation" },
  { pattern: /case\s*stud/i, layout: "case-study" },
  { pattern: /ui|ux|product|app|web|interface|dashboard/i, layout: "ui-showcase" },
  { pattern: /graphic|brand|print|editorial|poster/i, layout: "editorial" },
];

export function inferLayoutFromFolderName(folderName: string): LayoutVariant {
  for (const { pattern, layout } of LAYOUT_HINTS) {
    if (pattern.test(folderName)) return layout;
  }
  return "hybrid";
}

export function defaultDescription(folderName: string, title: string): string {
  return `Explore ${title} — curated work from the ${folderName} collection.`;
}

export function defaultTags(folderName: string): string[] {
  const layout = inferLayoutFromFolderName(folderName);
  if (layout === "video") return ["Motion", "Cinematic"];
  if (layout === "presentation") return ["Presentations", "Slides"];
  if (layout === "case-study") return ["Case Study", "Process"];
  if (layout === "ui-showcase") return ["UI/UX", "Product"];
  if (layout === "editorial") return ["Visual Design", "Brand"];
  return ["Portfolio", "Creative"];
}
