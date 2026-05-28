export type MediaKind = "image" | "video" | "presentation";

export type LayoutVariant =
  | "ui-showcase"
  | "editorial"
  | "video"
  | "presentation"
  | "case-study"
  | "hybrid";

export type Orientation = "landscape" | "portrait" | "square";

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  src: string;
  fileName: string;
  width?: number;
  height?: number;
  orientation: Orientation;
  order: number;
}

export interface ProjectSummary {
  slug: string;
  title: string;
  categorySlug: string;
  categoryTitle: string;
  layout: LayoutVariant;
  cover: MediaAsset | null;
  mediaCount: number;
  description: string;
  tags: string[];
}

export interface Project extends ProjectSummary {
  media: MediaAsset[];
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  layout: LayoutVariant;
  folderName: string;
  projectCount: number;
  cover: MediaAsset | null;
}
