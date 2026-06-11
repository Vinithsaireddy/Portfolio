"use client"

import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"
import { useCountUp } from "@/lib/useCountUp"

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React.js", "React Native", "Next.js", "Tailwind CSS"],
    position: "md:top-[5%] md:left-[5%]",
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "Spring Boot", "REST APIs"],
    position: "md:top-[5%] md:right-[5%]",
  },
  {
    title: "AI & ML",
    skills: ["TensorFlow", "YOLOv8", "LangChain", "OpenCV", "Pandas"],
    position: "md:top-[45%] md:left-[2%]",
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS (EC2, S3)", "Docker", "Git", "GitHub"],
    position: "md:top-[45%] md:right-[2%]",
  },
  {
    title: "Databases",
    skills: ["MongoDB", "Firebase", "SQL", "PostgreSQL"],
    position: "md:bottom-[5%] md:left-1/2 md:-translate-x-1/2",
  },
]

const stats = [
  { label: "Production Apps", value: 7, suffix: "", decimals: undefined },
  { label: "CGPA", value: 8.2, suffix: "", decimals: 1 },
  { label: "API Integrations", value: 15, suffix: "+", decimals: undefined },
  { label: "Months Internship", value: 6, suffix: "", decimals: undefined },
]

function AnimatedStat({
  stat,
  inView,
}: {
  stat: { label: string; value: number; suffix: string; decimals: number | undefined }
  inView: boolean
}) {
  const count = useCountUp(stat.value, inView, stat.decimals)
  return (
    <div className="text-center">
      <h4 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter tabular-nums">
        {stat.decimals !== undefined ? count.toFixed(1) : Math.floor(count)}
        {stat.suffix}
      </h4>
      <p className="text-sm text-secondary-foreground uppercase tracking-wider font-medium">
        {stat.label}
      </p>
    </div>
  )
}

export function Skills() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-20% 0px" })
  const skillsInView = useInView(skillsRef, { once: true, margin: "-10% 0px" })

  return (
    <section id="skills" className="py-32 px-6 bg-[#050505] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Technical Arsenal</h2>
          <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
            A dynamic ecosystem of technologies I use to build scalable products.
          </p>
        </motion.div>

        {/* Animated Statistics */}
        <div ref={statsRef} className="flex flex-wrap justify-center gap-8 md:gap-16 mb-24 relative z-20">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <AnimatedStat stat={stat} inView={statsInView} />
            </motion.div>
          ))}
        </div>

        {/* Technology Command Center */}
        <div
          ref={skillsRef}
          className="relative min-h-[800px] md:min-h-[700px] flex flex-col md:block items-center justify-center gap-6"
        >
          {/* Central Core */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md items-center justify-center z-10 shadow-[0_0_50px_rgba(79,70,229,0.2)]">
            <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse flex items-center justify-center text-center p-4">
              <span className="text-white font-bold tracking-widest text-sm drop-shadow-lg">
                FULL STACK
                <br /> ENGINEER
              </span>
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl -z-10" />
          </div>

          {/* Floating Clusters */}
          {skillCategories.map((category, idx) => {
            const isHovered = hoveredCategory === category.title

            // Build animate target based on hover + inView state
            const floatAnimate = skillsInView
              ? isHovered
                ? { opacity: 1, y: -10, x: 0, scale: 1 }
                : {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    y: [0, -10, 0] as number[],
                    transition: {
                      opacity: { duration: 0.45, delay: idx * 0.06 },
                      x: { duration: 0.45, delay: idx * 0.06 },
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                        delay: idx * 0.5,
                      },
                    },
                  }
              : { opacity: 0, y: 20, x: 0 }

            return (
              <motion.div
                key={category.title}
                className={`relative md:absolute w-full md:w-auto z-20 ${category.position}`}
                initial={{ opacity: 0, y: 20 }}
                animate={floatAnimate}
                onMouseEnter={() => setHoveredCategory(category.title)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className={`
                    p-6 rounded-2xl glass transition-all duration-500 min-w-[280px]
                    ${isHovered
                      ? "bg-white/10 border-primary/50 shadow-[0_0_30px_rgba(79,70,229,0.3)] scale-105"
                      : "border-white/10 hover:border-white/20"
                    }
                  `}
                >
                  <h3 className={`text-xl font-semibold mb-6 flex items-center gap-3 transition-colors duration-300 ${isHovered ? "text-primary" : "text-white"}`}>
                    <span className={`w-2 h-2 rounded-full ${isHovered ? "bg-primary shadow-[0_0_10px_rgba(79,70,229,0.8)]" : "bg-white/30"}`} />
                    {category.title}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {category.skills.map((skill, skillIdx) => (
                      <motion.div
                        key={skill}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={skillsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: idx * 0.06 + skillIdx * 0.05, duration: 0.4 }}
                      >
                        <div className={`h-px bg-gradient-to-r transition-all duration-300 ${isHovered ? "from-primary/50 to-transparent w-6" : "from-white/10 to-transparent w-3"}`} />
                        <span className={`text-sm transition-colors duration-300 ${isHovered ? "text-white" : "text-secondary-foreground"}`}>
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
