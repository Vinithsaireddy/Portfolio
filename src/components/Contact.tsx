"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, FileText, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  {
    name: "Email",
    handle: "gvinith2005@gmail.com",
    icon: Mail,
    href: "mailto:gvinith2005@gmail.com",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
    hoverBorder: "hover:border-orange-500/50",
    hoverGlow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
  },
  {
    name: "LinkedIn",
    handle: "vinith-g-523104302",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/vinith-g-523104302/",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/50",
    hoverGlow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  {
    name: "GitHub",
    handle: "Vinithsaireddy",
    icon: Github,
    href: "https://github.com/Vinithsaireddy",
    color: "from-white/10 to-white/5",
    border: "border-white/10",
    iconColor: "text-white/70",
    hoverBorder: "hover:border-white/30",
    hoverGlow: "hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]",
  },
  {
    name: "Resume",
    handle: "Download PDF",
    icon: FileText,
    href: "/vini_resume.pdf",
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
    iconColor: "text-primary",
    hoverBorder: "hover:border-primary/50",
    hoverGlow: "hover:shadow-[0_0_30px_rgba(79,70,229,0.2)]",
  },
]

type FormState = "idle" | "sending" | "sent" | "error"

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [formState, setFormState] = useState<FormState>("idle")
  const formRef = useRef<HTMLFormElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setFormState("sending")
    // Simulate sending — replace with real endpoint (e.g., formspree.io)
    await new Promise((res) => setTimeout(res, 1500))
    setFormState("sent")
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <section id="contact" className="py-32 px-6 relative z-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -left-40 bottom-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Open to opportunities
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Have a project in mind?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
              Let&apos;s talk.
            </span>
          </h2>
          <p className="text-xl text-secondary-foreground max-w-2xl flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary/70 shrink-0" />
            I typically reply within 24 hours. Currently available for internships and full-time roles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-white/60">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="px-4 py-3 rounded-xl glass border border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/60">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="px-4 py-3 rounded-xl glass border border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-white/60">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell me about your project, role, or just say hi..."
                  required
                  className="px-4 py-3 rounded-xl glass border border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200 text-sm resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={formState === "sending" || formState === "sent"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  formState === "sent"
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                    : formState === "error"
                    ? "bg-red-500/20 border border-red-500/30 text-red-400"
                    : "bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                }`}
              >
                {formState === "idle" && (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
                {formState === "sending" && (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                )}
                {formState === "sent" && (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Message Sent!
                  </>
                )}
                {formState === "error" && (
                  <>
                    <AlertCircle className="w-4 h-4" /> Failed — Try Email
                  </>
                )}
              </motion.button>

              {formState === "sent" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-emerald-400/80 text-center"
                >
                  Thanks! I&apos;ll get back to you within 24 hours.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Social Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <p className="text-sm font-mono uppercase tracking-wider text-white/30 mb-2">
              Or reach me directly
            </p>
            {socialLinks.map((link, idx) => {
              const Icon = link.icon
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${link.color} border ${link.border} ${link.hoverBorder} ${link.hoverGlow} transition-all duration-300`}
                  >
                    <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${link.iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-sm">{link.name}</span>
                      <span className="text-white/40 text-xs font-mono">{link.handle}</span>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs text-white/40 font-mono">→</span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}

            {/* Scheduling note */}
            <div className="mt-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <p className="text-sm text-white/40 leading-relaxed">
                💬 Prefer a call? Drop me an email and we can schedule a quick intro — I&apos;m happy to chat about roles, freelance projects, or collaborations.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
