"use client";

import type { LayoutVariant, ProjectSummary } from "@/lib/projects/types";
import ProjectCard from "./ProjectCard";
import VideoPreviewCard from "./VideoPreviewCard";

interface CategoryGalleryProps {
  projects: ProjectSummary[];
  layout: LayoutVariant;
}

export default function CategoryGallery({
  projects,
  layout,
}: CategoryGalleryProps) {
  if (layout === "video") {
    return (
      <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin">
        {projects.map((project, i) => (
          <VideoPreviewCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    );
  }

  if (layout === "ui-showcase") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            priority={i < 2}
          />
        ))}
      </div>
    );
  }

  if (layout === "editorial") {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {projects.map((project, i) => (
          <div key={project.slug} className="break-inside-avoid">
            <ProjectCard project={project} index={i} priority={i < 3} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={i}
          priority={i < 3}
        />
      ))}
    </div>
  );
}
