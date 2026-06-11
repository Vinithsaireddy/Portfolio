"use client"

import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen py-32 px-8 md:px-16 flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#ff1e00] mb-16"
        >
          About
        </motion.p>

        <div className="space-y-8">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-white/80 leading-relaxed max-w-2xl"
          >
            I build interfaces that feel alive — blending real-time graphics with thoughtful interaction design.
          </motion.p>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="text-base text-white/40 leading-relaxed max-w-xl"
          >
            Currently based in Los Angeles, working at the intersection of creative development and systems engineering. I specialize in WebGL, shader programming, and building performant browser experiences that push the limits of what the web can render.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
          >
            {[
              { label: "Years Exp", value: "6+" },
              { label: "Projects", value: "40+" },
              { label: "Clients", value: "12" },
              { label: "OSS Repos", value: "18" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-black text-[#e8e8e0] mb-1">
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/30">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
