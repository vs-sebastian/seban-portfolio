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

/** Not rendered in the gallery — skip during filesystem walks */
export const EXCLUDED_EXTENSIONS = new Set([".pdf"]);

/** Google Drive duplicate export folders — skip */
export const SKIP_FOLDER_PATTERN = /-\d{8}T\d{6}Z-/i;

export interface CategoryDefinition {
  slug: string;
  folderName: string;
  title: string;
  description: string;
  layout: LayoutVariant;
  tags: string[];
  /** Sort order on hub (lower first) */
  order?: number;
}
