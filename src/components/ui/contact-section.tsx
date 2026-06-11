"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, MapPin } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export function ContactSection() {
  const [sent, setSent] = useState(false)

  return (
    <section id="contact" className="min-h-screen py-32 px-8 md:px-16 flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#ff1e00] mb-16"
        >
          Contact
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#e8e8e0] leading-tight mb-6">
              Let&apos;s build something together.
            </h2>
            <p className="text-sm text-white/40 leading-relaxed mb-10 max-w-sm">
              Available for freelance projects, collaborations, and full-time roles. I typically respond within 24 hours.
            </p>

            <div className="space-y-4 text-sm text-white/50">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#ff1e00]" />
                <span>hello@gvinith.dev</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#ff1e00]" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
              setTimeout(() => setSent(false), 3000)
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-none px-4 py-3 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-white/20 transition-colors"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-none px-4 py-3 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-white/20 transition-colors"
            />
            <textarea
              rows={4}
              placeholder="Tell me about your project"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-none px-4 py-3 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-white/20 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full bg-[#ff1e00] text-[#0a0a0a] font-semibold text-sm py-3 px-6 flex items-center justify-center gap-2 hover:bg-[#ff3b14] transition-colors disabled:opacity-50"
            >
              {sent ? (
                "Message Sent"
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-medium tracking-[0.08em] uppercase text-white/20"
        >
          <span>© {new Date().getFullYear()} G Vinith. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Behance</span>
            <span>LinkedIn</span>
            <span>GitHub</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
