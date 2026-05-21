"use client";

import React from "react";
import { motion } from "framer-motion";

const experiences = [
  {
    company: "Lean Transition Solutions",
    period: "2024 – Present",
    roles: ["Graphic Designer", "Editor", "UI/UX Designer", "UI Developer"],
  },
  {
    company: "Orisys India Consultancy Services",
    period: "2024",
    roles: [
      "Senior Graphic Designer",
      "Editor",
      "UI/UX Designer",
      "Digital Content Developer",
      "UI Developer",
    ],
  },
  {
    company: "Bazani India Pvt Ltd",
    period: "2023 – 2024",
    roles: ["Senior Graphic Designer", "Editor", "Digital Content Developer"],
  },
  {
    company: "Wideframe Studio",
    period: "2021 – 2023",
    roles: ["Video Editor", "Graphic Designer", "Motion Graphics Artist"],
  },
  {
    company: "Pixello Media",
    period: "2020 – 2021",
    roles: ["Video Editor", "Graphic Designer"],
  },
];

export default function Experience() {
  return (
    <section id="case-studies" className="py-32 px-6 md:px-24 bg-[#121212] relative z-20 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience
          </h2>
          <div className="w-20 h-1 bg-white/20 rounded-full" />
        </motion.div>

        <div className="relative border-l border-white/10 ml-4 md:ml-0">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="mb-16 ml-8 md:ml-12 relative group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-4 h-4 rounded-full bg-[#121212] border-2 border-white/20 group-hover:border-blue-400 group-hover:bg-blue-400/20 transition-colors duration-500 shadow-[0_0_10px_rgba(255,255,255,0)] group-hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]" />

              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4 gap-2 md:gap-8">
                <h3 className="text-2xl font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">
                  {exp.company}
                </h3>
                <span className="text-sm font-light text-white/50 tracking-wider whitespace-nowrap">
                  {exp.period}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {exp.roles.map((role, rIndex) => (
                  <span
                    key={rIndex}
                    className="text-sm font-medium px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white/90 border border-white/10 transition-colors duration-300"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
