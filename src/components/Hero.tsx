"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Download, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"
import { ShaderHeroBackground } from "@/components/ui/shader-hero-background"

const roles = [
  "digital experiences",
  "native mobile apps",
  "scalable backends",
  "intelligent systems",
]

function TypewriterText({ texts }: { texts: string[] }) {
  const [displayed, setDisplayed] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        setCharIndex((c) => c + 1)
      }, 60)
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex((c) => c - 1)
      }, 35)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setTextIndex((i) => (i + 1) % texts.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, textIndex, texts])

  return (
    <span
      className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-emerald-400"
      style={{ whiteSpace: "nowrap" }}
    >
      {displayed}
      <span 
        className="inline-block ml-1.5 w-[3px] md:w-[5px] h-[0.85em] bg-primary align-middle shadow-[0_0_12px_var(--primary),0_0_4px_var(--primary)] animate-pulse"
        style={{ verticalAlign: "middle" }}
      />
    </span>
  )
}

const techTags = ["React", "React Native", "Next.js", "Spring Boot", "AWS", "TensorFlow"]

const tagVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
}

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const tagsRef = useRef<HTMLDivElement>(null)
  const tagsInView = useInView(tagsRef, { once: true })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-grid-pattern"
    >
      <ShaderHeroBackground />

      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.07), transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full z-10 relative">
        <div className="max-w-4xl">
          {/* Open to Work Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-medium text-emerald-400">Available</span>
              <span className="text-white/40">·</span>
              <Briefcase className="w-3.5 h-3.5 text-white/50" />
              Internships & Full-time
              <span className="text-white/40">·</span>
              <MapPin className="w-3.5 h-3.5 text-white/50" />
              Bangalore / Remote
            </span>
          </motion.div>

          {/* Sub-badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block text-xs font-medium tracking-wide uppercase text-white/40">
              Vinith Sai Reddy — Portfolio
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="font-black tracking-tighter leading-[0.9] mb-6 text-white flex flex-col"
            style={{ fontSize: "clamp(2.5rem, 9.5vw, 8.5rem)" }}
          >
            <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.2)] hover:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.85)] hover:text-white transition-all duration-500 cursor-default select-none uppercase">
              CRAFTING
            </span>
            {/* Single-line row — nowrap prevents wrapping, clamp() prevents overflow */}
            <span
              className="block"
              style={{ whiteSpace: "nowrap" }}
            >
              <TypewriterText texts={roles} />
            </span>
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-secondary-foreground font-light tracking-tight max-w-2xl mb-10"
          >
            I ship full-stack apps — from React Native to Spring Boot to AWS.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link
              href="#projects"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              View Projects
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="/vini_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 glass text-white font-medium rounded-full transition-all duration-200 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
            >
              Download Resume
              <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <a
              href="mailto:vinithsaireddy2003@gmail.com"
              className="group flex items-center gap-2 px-6 py-3 border border-white/10 text-white/70 font-medium rounded-full transition-all duration-200 hover:border-primary/50 hover:text-white hover:scale-[1.02] active:scale-95"
            >
              {"I'm open to opportunities — let's talk"}
            </a>
          </motion.div>

          {/* Tech stack bar — staggered */}
          <div
            ref={tagsRef}
            className="pt-8 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary-foreground font-mono"
          >
            {techTags.map((tech, i) => (
              <motion.span
                key={tech}
                custom={i}
                variants={tagVariants}
                initial="hidden"
                animate={tagsInView ? "show" : "hidden"}
                className="transition-colors duration-200 hover:text-white cursor-default"
              >
                {i > 0 && <span className="text-white/20 mr-6">•</span>}
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
