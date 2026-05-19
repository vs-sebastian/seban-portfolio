"use client";

import { motion } from "framer-motion";

const skills = [
  "Figma", "UI/UX Design", "Graphic Design", "Frontend Development",
  "HTML", "CSS", "Bootstrap", "JavaScript", "jQuery", "Git",
  "Photoshop", "Illustrator", "Premiere Pro", "After Effects",
  "Motion Graphics", "Responsive Design", "Wireframing"
];

export default function Skills() {
  return (
    <section className="py-32 px-6 md:px-24 bg-[#121212] relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Tools & Technologies</h2>
          <div className="w-20 h-1 bg-white/20 rounded-full mx-auto" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto">
          {skills.map((skill, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                animate={{
                  y: [0, isEven ? -5 : 5, 0],
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: index * 0.05 },
                  scale: { duration: 0.6, delay: index * 0.05, type: "spring", stiffness: 100 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }
                }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 rounded-full" />
                <div className="relative px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-full hover:border-white/30 transition-colors duration-300 cursor-default">
                  <span className="text-white/80 font-medium text-sm md:text-base group-hover:text-white transition-colors duration-300">
                    {skill}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
