"use client"

import { Canvas } from "@react-three/fiber"
import { ShaderPlane, EnergyRing } from "./shader-background"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <motion.div ref={ref} className="fixed inset-0 pointer-events-none z-0" style={{ opacity }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ShaderPlane
          position={[0, 0, -2]}
          color1="#ff1e00"
          color2="#0a0a0a"
          scale={6}
        />
        <ShaderPlane
          position={[-1.5, 0.8, -1]}
          color1="#ff3b14"
          color2="#e8e8e0"
          scale={3}
        />
        <ShaderPlane
          position={[1.2, -0.6, -1.5]}
          color1="#ff1e00"
          color2="#0a0a0a"
          scale={4}
        />
        <EnergyRing radius={2.5} position={[0, 0, -3]} />
        <EnergyRing radius={3.2} position={[0, 0, -3.5]} />
      </Canvas>
    </motion.div>
  )
}
