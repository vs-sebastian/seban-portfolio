import type { Metadata } from "next";
import { getAllCategories } from "@/lib/projects";
import PageShell from "@/components/gallery/PageShell";
import ProjectsHub from "@/components/gallery/ProjectsHub";

export const metadata: Metadata = {
  title: "Projects | Sebastian VS",
  description: "Cinematic project gallery — UI/UX, graphic design, video, and case studies.",
};

export default function ProjectsPage() {
  const categories = getAllCategories();

  return (
    <PageShell
      title="Project Gallery"
      subtitle="An immersive exhibition of product design, visual craft, motion, and strategic case studies — dynamically composed from the studio archive."
      backHref="/#home"
      backLabel="Back to Home"
    >
      <ProjectsHub categories={categories} />
    </PageShell>
  );
}
