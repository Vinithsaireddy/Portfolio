"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function Tagline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -30])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="fixed top-12 left-12 z-20 text-[14px] leading-[1.5] text-white/70 font-normal pointer-events-none select-none"
    >
      <p>
        Creative{" "}
        <em
          className="text-white/85 font-normal"
          style={{ fontStyle: "italic" }}
        >
          Developer
        </em>
      </p>
      <p>Los Angeles, CA</p>
    </motion.div>
  )
}
