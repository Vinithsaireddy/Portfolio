"use client"

import { Github, Linkedin, Mail, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Contact() {
  const links = [
    { name: "Email", icon: Mail, href: "mailto:gvinith2005@gmail.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/vinith-g-523104302/" },
    { name: "GitHub", icon: Github, href: "https://github.com/Vinithsaireddy" },
    { name: "Resume", icon: FileText, href: "/vini_resume.pdf" },
  ]

  return (
    <section id="contact" className="py-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Let&apos;s Build Something <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
            Great Together
          </span>
        </h2>
        <p className="text-xl text-secondary-foreground mb-16 max-w-2xl mx-auto">
          I&apos;m currently open for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-secondary-foreground transition-colors duration-300 group-hover:text-primary" />
                <span className="font-medium transition-colors duration-300 group-hover:text-white">
                  {link.name}
                </span>
                <ArrowRight className="w-4 h-4 transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
