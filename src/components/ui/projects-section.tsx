"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "Aether Engine",
    category: "Real-Time Rendering",
    description: "WebGL-based physically-based renderer with real-time GI, shadow mapping, and post-processing pipeline built on Three.js.",
    tags: ["TypeScript", "WebGL", "Three.js", "GLSL"],
  },
  {
    title: "Pulse Analytics",
    category: "Data Visualization",
    description: "Real-time analytics dashboard with D3.js force graphs, streaming data pipelines, and interactive map overlays for urban sentiment data.",
    tags: ["React", "D3.js", "WebSocket", "Node.js"],
  },
  {
    title: "Chroma Studio",
    category: "Creative Tooling",
    description: "Browser-based color grading suite with LUT import/export, waveform monitors, and collaborative review system for video post-production.",
    tags: ["Next.js", "Canvas API", "WebAssembly", "PostgreSQL"],
  },
  {
    title: "Drift Protocol",
    category: "Full-Stack",
    description: "Decentralized content platform with IPFS storage, on-chain identity verification, and a peer-to-peer discovery layer.",
    tags: ["Solidity", "IPFS", "GraphQL", "React"],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export function ProjectsSection() {
  return (
    <section id="projects" className="min-h-screen py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#ff1e00] mb-12"
        >
          Selected Work
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#0a0a0a] p-8 md:p-10 transition-colors hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/30">
                  {project.category}
                </span>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Github className="w-4 h-4 text-white/40 hover:text-white/80 transition-colors" />
                  <ExternalLink className="w-4 h-4 text-white/40 hover:text-white/80 transition-colors" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#e8e8e0] mb-3">
                {project.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-md">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium tracking-[0.06em] uppercase px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
