import type { CategoryDefinition } from "./constants";
import type { MediaAsset, Project } from "./types";
import { buildTags } from "./media-analyzer";
import { slugify, titleFromFileName } from "./slug";

/** Original filename → Cloudinary delivery URL */
export const VIDEO_CLOUDINARY_BY_FILENAME: Record<string, string> = {
  "python promo final out.mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774315/Python_Promo_Final_out_kwwrd4.mp4",
  "canadian final mix.mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774314/canadian_final_mix_oxkan6.mp4",
  "the graphite homes - hd 1080p.mov":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774311/The_graphite_homes_-_HD_1080p_stfmqo.mov",
  "vid-20231223-wa0004.mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774312/VID-20231223-WA0004_rj4sf2.mp4",
  "vid-20231028-wa0001.mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774311/VID-20231028-WA0001_lkmfcs.mp4",
  "data point - philips version video full comp 04 (1).mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774308/Data_Point_-_Philips_Version_Video_Full_Comp_04_1_oub16k.mp4",
  "data point - philips version video full comp 04 1.mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774308/Data_Point_-_Philips_Version_Video_Full_Comp_04_1_oub16k.mp4",
  "vid-20230903-wa0002.mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774306/VID-20230903-WA0002_c8vtbg.mp4",
  "fusion treats ad.mp4":
    "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774305/Fusion_treats_Ad_q0trpr.mp4",
};

export const VIDEO_CATALOG = [
  { fileName: "Python Promo Final out.mp4" },
  { fileName: "canadian final mix.mp4" },
  { fileName: "The graphite homes - HD 1080p.mov" },
  { fileName: "VID-20231223-WA0004.mp4" },
  { fileName: "VID-20231028-WA0001.mp4" },
  { fileName: "Data Point - Philips Version Video Full Comp 04 1.mp4" },
  { fileName: "VID-20230903-WA0002.mp4" },
  { fileName: "Fusion treats Ad.mp4" },
] as const;

function normalizeFileName(fileName: string): string {
  return fileName.toLowerCase().trim();
}

export function resolveVideoSrc(fileName: string): string | null {
  return VIDEO_CLOUDINARY_BY_FILENAME[normalizeFileName(fileName)] ?? null;
}

export function isRemoteVideoSrc(src: string): boolean {
  return src.startsWith("https://res.cloudinary.com/");
}

export function buildCloudinaryVideoAsset(
  fileName: string,
  order = 0
): MediaAsset | null {
  const src = resolveVideoSrc(fileName);
  if (!src) return null;

  return {
    id: slugify(fileName),
    kind: "video",
    src,
    fileName,
    orientation: "landscape",
    order,
  };
}

/** Video category projects — sourced from Cloudinary, not local files. */
export function buildVideoProjectsFromCloudinary(
  category: CategoryDefinition
): Project[] {
  const projects: Project[] = [];

  for (const entry of VIDEO_CATALOG) {
    const asset = buildCloudinaryVideoAsset(entry.fileName, 0);
    if (!asset) continue;

    const title = titleFromFileName(entry.fileName);
    const projectSlug = slugify(title);

    projects.push({
      slug: projectSlug,
      title,
      categorySlug: category.slug,
      categoryTitle: category.title,
      layout: "video",
      cover: asset,
      mediaCount: 1,
      description: `Cinematic piece — ${title}.`,
      tags: buildTags(category, "video", title),
      media: [asset],
    });
  }

  return projects.sort((a, b) => a.title.localeCompare(b.title));
}
