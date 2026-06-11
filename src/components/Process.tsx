"use client"

import { ArrowRight } from "lucide-react"

const steps = [
  "Discovery",
  "Research",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Optimization",
]

export function Process() {
  return (
    <section className="py-32 px-6 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">How I Build Products</h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4 md:gap-8">
              <span className="text-lg font-medium cursor-default">
                {step}
              </span>
              {idx < steps.length - 1 && (
                <div className="hidden md:block">
                  <ArrowRight className="w-6 h-6 text-white/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
