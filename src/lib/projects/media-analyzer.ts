import path from "path";
import type { LayoutVariant, MediaAsset, MediaKind, Orientation } from "./types";
import {
  IMAGE_EXTENSIONS,
  PRESENTATION_EXTENSIONS,
  VIDEO_EXTENSIONS,
  type CategoryDefinition,
} from "./constants";

export function getExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

export function getMediaKind(filePath: string): MediaKind | null {
  const ext = getExtension(filePath);
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";
  if (PRESENTATION_EXTENSIONS.has(ext)) return "presentation";
  return null;
}

export function orientationFromDimensions(
  width?: number,
  height?: number
): Orientation {
  if (!width || !height) return "landscape";
  const ratio = width / height;
  if (ratio > 1.15) return "landscape";
  if (ratio < 0.85) return "portrait";
  return "square";
}

const UI_HINTS =
  /dashboard|mobile|app|ios|android|ui|ux|screen|login|module|wireframe|tablet|safety|datapoint|web revamp/i;
const POSTER_HINTS =
  /poster|brand|behance|graphic|print|campaign|logo|brochure/i;

export function inferLayout(
  category: CategoryDefinition,
  files: { kind: MediaKind; relativePath: string }[]
): LayoutVariant {
  const counts = { image: 0, video: 0, presentation: 0 };
  for (const f of files) counts[f.kind]++;

  const total = files.length || 1;
  const imageRatio = counts.image / total;
  const videoRatio = counts.video / total;
  const presentationRatio = counts.presentation / total;

  const pathsJoined = files.map((f) => f.relativePath).join(" ");
  const uiScore = (pathsJoined.match(UI_HINTS) || []).length;
  const posterScore = (pathsJoined.match(POSTER_HINTS) || []).length;

  const typesPresent =
    (counts.image > 0 ? 1 : 0) +
    (counts.video > 0 ? 1 : 0) +
    (counts.presentation > 0 ? 1 : 0);

  if (typesPresent >= 2) return "hybrid";
  if (videoRatio >= 0.5 || category.layout === "video") return "video";
  if (presentationRatio >= 0.4 || category.layout === "presentation")
    return "presentation";
  if (category.layout === "case-study") return "case-study";
  if (uiScore >= 2 || category.layout === "ui-showcase") return "ui-showcase";
  if (posterScore >= 2 || category.layout === "editorial") return "editorial";

  return category.layout;
}

export function pickCover(assets: MediaAsset[]): MediaAsset | null {
  if (assets.length === 0) return null;

  const images = assets.filter((a) => a.kind === "image");
  const pool = images.length > 0 ? images : assets;

  const preferred = pool.find((a) =>
    /cover|hero|thumb|home|landing|main/i.test(a.fileName)
  );
  if (preferred) return preferred;

  const sorted = [...pool].sort((a, b) => {
    const aArea = (a.width ?? 0) * (a.height ?? 0);
    const bArea = (b.width ?? 0) * (b.height ?? 0);
    return bArea - aArea;
  });

  return sorted[0] ?? pool[0];
}

export function buildTags(
  category: CategoryDefinition,
  layout: LayoutVariant,
  title: string
): string[] {
  const tags = new Set<string>(category.tags.slice(0, 2));
  if (layout === "ui-showcase") tags.add("UI Systems");
  if (layout === "video") tags.add("Motion");
  if (layout === "presentation") tags.add("Slides");
  if (layout === "case-study") tags.add("Strategy");
  if (/mobile|app|ios/i.test(title)) tags.add("Mobile");
  return Array.from(tags).slice(0, 4);
}
