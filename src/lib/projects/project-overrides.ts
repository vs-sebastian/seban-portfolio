import type { Project } from "./types";

export interface ProjectOverride {
  categoryTitle?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

/** Premium copy for curated projects (key: categorySlug/projectSlug). */
export const PROJECT_OVERRIDES: Record<string, ProjectOverride> = {
  "ui-development/sebastian-vs-cinematic-portfolio": {
    categoryTitle: "UI DEVELOPMENT",
    title: "Sebastian VS — Cinematic Next.js Portfolio",
    description:
      "A cinematic interactive portfolio built with Next.js.",
    tags: ["Next.js", "TypeScript", "Framer Motion", "HTML5 Canvas"],
  },
  "videos/fusion-treats-ad": {
    title: "Fusion Treats Advertisement",
  },
  "ui-ux-product-design/value-stram-mapping-vsm-ui-ux-design": {
    title: "Value Stream Mapping (VSM)",
  },
};

export const PORTFOLIO_SHOWCASE_SLUG = "sebastian-vs-cinematic-portfolio";
export const PORTFOLIO_SHOWCASE_CATEGORY = "ui-development";

export function applyProjectOverrides(project: Project): Project {
  const key = `${project.categorySlug}/${project.slug}`;
  const override = PROJECT_OVERRIDES[key];
  if (!override) return project;

  return {
    ...project,
    categoryTitle: override.categoryTitle ?? project.categoryTitle,
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
