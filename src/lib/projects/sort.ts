import type { MediaAsset, Project } from "./types";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export function compareFileName(a: string, b: string): number {
  return collator.compare(a, b);
}

export function sortMediaAssets(media: MediaAsset[]): MediaAsset[] {
  return [...media].sort((a, b) => compareFileName(a.fileName, b.fileName));
}

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => collator.compare(a.title, b.title));
}
