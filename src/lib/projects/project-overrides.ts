import type { Project } from "./types";

export interface ProjectOverride {
  title?: string;
  description?: string;
  tags?: string[];
}

/** Premium copy for curated projects (key: categorySlug/projectSlug). */
export const PROJECT_OVERRIDES: Record<string, ProjectOverride> = {
  "ui-ux-product-design/sebastian-vs-cinematic-portfolio": {
    title: "Sebastian VS — Cinematic Portfolio",
    description:
      "A scroll-orchestrated personal showcase—frame-synced hero storytelling, glass navigation, and immersive project galleries built as one cohesive cinematic experience.",
    tags: ["UI/UX", "Frontend", "Motion", "Scrollytelling"],
  },
};

export const PORTFOLIO_SHOWCASE_SLUG = "sebastian-vs-cinematic-portfolio";
export const PORTFOLIO_SHOWCASE_CATEGORY = "ui-ux-product-design";

export function applyProjectOverrides(project: Project): Project {
  const key = `${project.categorySlug}/${project.slug}`;
  const override = PROJECT_OVERRIDES[key];
  if (!override) return project;

  return {
    ...project,
    title: override.title ?? project.title,
    description: override.description ?? project.description,
    tags: override.tags ?? project.tags,
  };
}

export function isPortfolioShowcaseProject(project: {
  categorySlug: string;
  slug: string;
}): boolean {
  return (
    project.categorySlug === PORTFOLIO_SHOWCASE_CATEGORY &&
    project.slug === PORTFOLIO_SHOWCASE_SLUG
  );
}
