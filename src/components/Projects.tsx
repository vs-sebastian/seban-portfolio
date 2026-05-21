"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Lean Transition Solutions",
    description: "Enterprise UI/UX design and frontend development for comprehensive transition workflows.",
    tags: ["UI/UX Design", "React", "Tailwind CSS"],
  },
  {
    title: "Hitachi Datapoint Website Redesign",
    description: "A complete visual and structural overhaul to modernize the digital presence and improve user journeys.",
    tags: ["Web Design", "Figma", "Frontend"],
  },
  {
    title: "Symphony UI Development",
    description: "Crafting scalable, accessible, and high-performance user interfaces for complex data dashboards.",
    tags: ["UI Development", "TypeScript", "Next.js"],
  },
  {
    title: "Digital Content & Motion",
    description: "Cinematic video editing and motion graphics to drive engagement and tell compelling brand stories.",
    tags: ["Premiere Pro", "After Effects", "Motion"],
  },
  {
    title: "UI/UX Product Interfaces",
    description: "Iterative design processes, wireframing, and prototyping for various SAAS applications.",
    tags: ["Product Design", "Wireframing", "Prototyping"],
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 md:px-24 bg-[#121212] relative z-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Selected Work</h2>
          <div className="w-20 h-1 bg-white/20 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              <div className="relative h-full bg-[#161616] backdrop-blur-xl rounded-2xl p-8 flex flex-col z-10 border border-white/5 group-hover:border-white/10 transition-colors duration-500">
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed mb-8">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full text-white/70 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="flex items-center text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300 mt-auto w-fit">
                  <span>View Project</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
