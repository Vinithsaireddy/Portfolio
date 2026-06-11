"use client"

import { motion } from "framer-motion"
import { Terminal, User, Code2, Server, Cloud, Cpu } from "lucide-react"

const terminalLines = [
  { cmd: "whoami", res: "Vinith Sai Reddy" },
  { cmd: "role", res: "Full Stack & App Developer" },
  { cmd: "focus", res: "Building scalable web and mobile applications" },
  { cmd: "current_project", res: "Keliri" },
]

const skillGroups = [
  {
    icon: Code2,
    label: "Languages",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    skills: ["JavaScript", "TypeScript", "Python", "Java"],
  },
  {
    icon: Server,
    label: "Frameworks",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    skills: ["React", "Next.js", "React Native", "Spring Boot", "Node.js", "Express"],
  },
  {
    icon: Cpu,
    label: "AI & ML",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    skills: ["TensorFlow", "YOLOv8", "LangChain", "OpenCV", "Scikit-learn"],
  },
  {
    icon: Cloud,
    label: "Cloud & Tools",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    skills: ["AWS EC2", "Amazon S3", "Docker", "Git", "MongoDB", "PostgreSQL"],
  },
]

const highlights = [
  { label: "CGPA", value: "8.2 / 10" },
  { label: "Internship", value: "6 months" },
  { label: "Apps Shipped", value: "7 live" },
  { label: "API Integrations", value: "15+" },
]

export function About() {
  return (
    <section id="about" className="py-32 px-6 bg-[#050505] relative z-10 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -left-40 top-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 bottom-40 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">About Me</h2>
          <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
            Bridging the gap between design and engineering.
          </p>
        </motion.div>

        {/* Top: Terminal + Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative rounded-2xl glass border border-white/10 overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                  <Terminal className="w-3 h-3" />
                  vinith@portfolio ~
                </div>
                <div className="w-16" />
              </div>

              {/* Terminal Content */}
              <div className="p-6 md:p-8 font-mono text-sm md:text-base min-h-[280px]">
                {terminalLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                    viewport={{ once: true }}
                    className="mb-6 last:mb-0"
                  >
                    <div className="flex gap-3 text-primary/90 font-medium">
                      <span>❯</span>
                      <span className="text-white/90">{line.cmd}</span>
                    </div>
                    <div className="text-secondary-foreground mt-2 ml-6 leading-relaxed">
                      &quot;{line.res}&quot;
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex gap-3 text-primary/90 mt-6"
                >
                  <span>❯</span>
                  <span className="w-2.5 h-5 bg-primary/60 block rounded-sm" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Personal Intro + Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <User className="w-4 h-4" />
                Who I Am
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Engineering{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Digital Experiences
                </span>
              </h3>
              <p className="text-lg text-secondary-foreground leading-relaxed mb-4">
                I&apos;m a Full Stack Developer who gets excited about building things that actually ship.
                From cross-platform mobile apps to AI-powered backends, I focus on clean code, real outcomes, and products people enjoy using.
              </p>
              <p className="text-base text-secondary-foreground leading-relaxed">
                Currently pursuing my B.E. in Computer Science at Bangalore Institute of Technology and actively looking for my next challenge — internship or full-time.
              </p>
            </div>

            {/* Highlight stats */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h, idx) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + idx * 0.07 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <p className="text-2xl font-bold text-white mb-1">{h.value}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-mono">{h.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom: Skill Groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/30">
              Skills & Stack
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillGroups.map((group, idx) => {
              const Icon = group.icon
              return (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                  viewport={{ once: true }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${group.bg} border ${group.border} hover:scale-[1.02] transition-transform duration-300`}
                >
                  <div className={`flex items-center gap-2 ${group.color} mb-4`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{group.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
