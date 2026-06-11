"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function HeroName() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const firstNameX = useTransform(scrollYProgress, [0, 0.4], [0, -180])
  const lastNameX = useTransform(scrollYProgress, [0, 0.4], [0, 180])
  const firstNameY = useTransform(scrollYProgress, [0, 0.5], [0, -40])
  const lastNameY = useTransform(scrollYProgress, [0, 0.5], [0, -40])
  const opacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.85])

  return (
    <div ref={ref} className="h-screen w-screen sticky top-0 z-20 pointer-events-none overflow-hidden">
      <motion.div style={{ scale, opacity }} className="relative w-full h-full">
        <motion.span
          className="absolute bottom-[72px] left-8 font-[Inter] font-black text-[22vw] leading-none text-[#e8e8e0] whitespace-nowrap select-none"
          style={{ x: firstNameX, y: firstNameY, fontFamily: "var(--font-inter)" }}
        >
          G
        </motion.span>
        <motion.span
          className="absolute bottom-[72px] right-6 italic font-semibold text-[22vw] leading-none text-[#8ff0e0] whitespace-nowrap select-none"
          style={{ x: lastNameX, y: lastNameY, fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
        >
          Vinith.
        </motion.span>
      </motion.div>
    </div>
  )
}
