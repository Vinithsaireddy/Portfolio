"use client"

import { useEffect, useState } from "react"
import { motion, useSpring } from "framer-motion"

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const scaleX = useSpring(scrollProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-gradient-to-r from-primary via-purple-400 to-emerald-400 origin-left"
      style={{ scaleX }}
    />
  )
}
