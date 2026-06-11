"use client"

import { CelestialSphere } from "./celestial-sphere"

export function ShaderHeroBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <CelestialSphere
        hue={210.0}
        speed={0.4}
        zoom={1.2}
        particleSize={4.0}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-[#050505]/60" />
    </div>
  )
}
