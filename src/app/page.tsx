import React from "react";
import ScrollyCanvas from "@/components/home/ScrollyCanvasDynamic";
import Projects from "@/components/Projects";
import { getAllCategories, getFeaturedProjects } from "@/lib/projects";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Creative from "@/components/Creative";
import Footer from "@/components/Footer";

export default function Home() {
  const featured = getFeaturedProjects(6);
  const categoryLinks = getAllCategories().map((c) => ({
    label: c.title,
    href: `/projects/${c.slug}`,
  }));

  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white/20">
      
      {/* 
        The ScrollyCanvas component contains the 500vh scroll section 
        and the text overlay components.
      */}
      <ScrollyCanvas />

      {/* 
        The rest of the sections flow naturally below the canvas section. 
        They all have a relative z-index higher than the canvas to scroll over it.
      */}
      <Projects featured={featured} categoryLinks={categoryLinks} />
      <About />
      <Experience />
      <Skills />
      <Creative />
      <Footer />

    </main>
  );
}
