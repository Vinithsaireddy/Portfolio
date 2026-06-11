"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function StickyNav() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])
  const y = useTransform(scrollYProgress, [0.5, 0.7], [10, 0])

  return (
    <motion.header
      ref={ref}
      style={{ opacity, y }}
      className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm pointer-events-auto"
    >
      <div className="absolute left-8 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#ff1e00]">
        G Vinith.
      </div>
      <div className="absolute right-8 flex gap-8 text-[11px] font-medium tracking-[0.08em] uppercase text-white/60">
        <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white/90 transition-colors cursor-pointer">WORK</button>
        <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white/90 transition-colors cursor-pointer">INFO</button>
        <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white/90 transition-colors cursor-pointer">CONTACT</button>
      </div>
    </motion.header>
  )
}
