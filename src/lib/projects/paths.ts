import path from "path";

/** URL path under /public (leading slash, encoded segments). */
export function toPublicSrc(relativeFromPublic: string): string {
  const normalized = relativeFromPublic.replace(/\\/g, "/");
  const segments = normalized.split("/").filter(Boolean);
  return "/" + segments.map((s) => encodeURIComponent(s)).join("/");
}

export function getProjectsDir(): string {
  return path.join(
    process.cwd(),
    "public",
    "images",
    "projects"
  );
}
