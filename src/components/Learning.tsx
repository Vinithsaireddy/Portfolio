"use client"

import { motion } from "framer-motion"
import { BookOpen, Layers, Terminal, TrendingUp } from "lucide-react"

const learningItems = [
  {
    icon: Layers,
    topic: "System Design",
    detail: "Distributed systems, CAP theorem, load balancing, caching patterns",
    color: "from-indigo-500/20 to-indigo-500/5",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: Terminal,
    topic: "Kubernetes & DevOps",
    detail: "Container orchestration, CI/CD pipelines, Helm charts, monitoring",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: TrendingUp,
    topic: "DSA & Competitive Programming",
    detail: "LeetCode grind — graphs, DP, trees · Building problem-solving intuition",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: BookOpen,
    topic: "Advanced AI / LLM Engineering",
    detail: "Fine-tuning, RAG pipelines, agents, prompt engineering at scale",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export function Learning() {
  return (
    <section id="learning" className="py-32 px-6 bg-[#050505] relative z-10 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -right-40 top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Growth Mindset
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">What I&apos;m Learning</h2>
          <p className="text-xl text-secondary-foreground max-w-2xl">
            Constantly pushing beyond the stack. Here&apos;s what I&apos;m exploring right now.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {learningItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.topic}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-sm group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${item.iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.topic}</h3>
                    <p className="text-sm text-secondary-foreground leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* GitHub Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl glass border border-white/10 text-center"
        >
          <p className="text-sm text-secondary-foreground uppercase tracking-wider font-mono mb-6">GitHub Activity</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ghchart.ssh.surf/Vinithsaireddy"
            alt="Vinith's GitHub contribution graph"
            className="mx-auto rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300 max-w-full"
            style={{ filter: "hue-rotate(220deg) saturate(1.5)" }}
          />
          <p className="text-xs text-white/30 mt-4 font-mono">@Vinithsaireddy on GitHub</p>
        </motion.div>
      </div>
    </section>
  )
}
