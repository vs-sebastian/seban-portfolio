import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getCategory,
  getProjectsByCategory,
} from "@/lib/projects";
import PageShell from "@/components/gallery/PageShell";
import CategoryGallery from "@/components/gallery/CategoryGallery";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Projects" };
  return {
    title: `${category.title} | Sebastian VS`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const projects = getProjectsByCategory(slug).map(({ media, ...summary }) => summary);

  return (
    <PageShell
      title={category.title}
      subtitle={category.description}
      backHref="/projects"
      backLabel="All Projects"
    >
      {projects.length === 0 ? (
        <p className="text-white/50 font-light">Projects coming soon.</p>
      ) : (
        <CategoryGallery projects={projects} layout={category.layout} />
      )}
    </PageShell>
  );
}
