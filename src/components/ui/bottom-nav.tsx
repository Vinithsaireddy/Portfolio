"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

export function BottomNav() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <>
      <motion.div
        ref={ref}
        style={{ opacity: heroOpacity }}
        className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
      >
        <nav className="h-16 flex items-center border-t border-white/10">
          <div className="absolute left-8 text-[11px] font-medium tracking-[0.08em] uppercase text-white/60">
            V3.0
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-[0.12em] uppercase text-white/60">
            BEHANCE &nbsp;/&nbsp; LINKEDIN &nbsp;/&nbsp; GITHUB
          </div>
          <div className="absolute right-8 flex gap-8 text-[11px] font-medium tracking-[0.08em] uppercase text-white/60">
            <span>WORK</span>
            <span>INFO</span>
            <span>CONTACT</span>
          </div>
        </nav>
      </motion.div>
    </>
  )
}
