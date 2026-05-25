import React from "react";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import { getFeaturedProjects } from "@/lib/projects";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Creative from "@/components/Creative";
import Footer from "@/components/Footer";

export default function Home() {
  const featured = getFeaturedProjects(6);

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
      <Projects featured={featured} />
      <About />
      <Experience />
      <Skills />
      <Creative />
      <Footer />

    </main>
  );
}
