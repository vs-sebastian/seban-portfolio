export interface CloudinaryVideoEntry {
  /** Stable project slug under /projects/videos/[slug] */
  slug: string;
  title: string;
  url: string;
  /** Optional local filenames (aliases) that resolve to this URL elsewhere */
  fileNames?: string[];
}

/**
 * Canonical Videos catalog — exactly one gallery entry per Cloudinary URL.
 * Add new videos here; optional fileNames keep folder-based resolution in sync.
 */
export const CLOUDINARY_VIDEO_CATALOG: readonly CloudinaryVideoEntry[] = [
  {
    slug: "python-promo-final-out",
    title: "Orisys Academy Python Course Promo",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774315/Python_Promo_Final_out_kwwrd4.mp4",
    fileNames: ["python promo final out.mp4"],
  },
  {
    slug: "canadian-final-mix",
    title: "Canadian JobBank Promo Video",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774314/canadian_final_mix_oxkan6.mp4",
    fileNames: ["canadian final mix.mp4"],
  },
  {
    slug: "the-graphite-homes-hd-1080p",
    title: "The Graphite Homes Promo",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774311/The_graphite_homes_-_HD_1080p_stfmqo.mov",
    fileNames: ["the graphite homes - hd 1080p.mov"],
  },
  {
    slug: "vid-20231223-wa0004",
    title: "Score Academy rank Holder Capcut Video",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774312/VID-20231223-WA0004_rj4sf2.mp4",
    fileNames: ["vid-20231223-wa0004.mp4"],
  },
  {
    slug: "vid-20231028-wa0001",
    title: "Bazzani Advertising Promo video",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774311/VID-20231028-WA0001_lkmfcs.mp4",
    fileNames: ["vid-20231028-wa0001.mp4"],
  },
  {
    slug: "data-point-philips-version-video-full-comp-04-1",
    title: "Data Point Product promo - intro video",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774308/Data_Point_-_Philips_Version_Video_Full_Comp_04_1_oub16k.mp4",
    fileNames: ["data point - philips version video full comp 04 1.mp4",],
  },
  {
    slug: "vid-20230903-wa0002",
    title: "Bazzani Grand Opening Promo Video",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774306/VID-20230903-WA0002_c8vtbg.mp4",
    fileNames: ["vid-20230903-wa0002.mp4"],
  },
  {
    slug: "fusion-treats-ad",
    title: "Fusion Treats Advertisement",
    url: "https://res.cloudinary.com/djjhthjvz/video/upload/v1779774305/Fusion_treats_Ad_q0trpr.mp4",
    fileNames: ["fusion treats ad.mp4"],
  },
] as const;

const videoUrlByFileName = new Map<string, string>();

for (const entry of CLOUDINARY_VIDEO_CATALOG) {
  for (const name of entry.fileNames ?? []) {
    videoUrlByFileName.set(normalizeFileName(name), entry.url);
  }
}

function normalizeFileName(fileName: string): string {
  return fileName.toLowerCase().trim();
}

export function resolveVideoSrc(fileName: string): string | null {
  return videoUrlByFileName.get(normalizeFileName(fileName)) ?? null;
}

export function isRemoteVideoSrc(src: string): boolean {
  return src.startsWith("https://res.cloudinary.com/");
}

/** Lookup catalog entry by Cloudinary URL (deduplication). */
export function getCloudinaryVideoByUrl(
  url: string
): CloudinaryVideoEntry | undefined {
  return CLOUDINARY_VIDEO_CATALOG.find((e) => e.url === url);
}
