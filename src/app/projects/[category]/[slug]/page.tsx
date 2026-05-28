import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllProjectParams,
  getCategory,
  getProject,
} from "@/lib/projects";
import PageShell from "@/components/gallery/PageShell";
import ProjectDetail from "@/components/project/ProjectDetail";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const project = getProject(category, slug);
  if (!project) return { title: "Project" };
  return {
    title: `${project.title} | Sebastian VS`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const category = getCategory(categorySlug);
  const project = getProject(categorySlug, slug);

  if (!category || !project) notFound();

  return (
    <PageShell
      title={project.title}
      subtitle={project.description}
      backHref={`/projects/${categorySlug}`}
      backLabel={category.title}
    >
      <ProjectDetail project={project} />
    </PageShell>
  );
}
