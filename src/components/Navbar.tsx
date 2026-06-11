"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-40% 0px -55% 0px" },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="#home" className="text-xl font-bold tracking-tighter transition-colors duration-200 hover:text-primary">
          VINITH
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 text-sm transition-colors duration-200 ${
                  isActive ? "text-white" : "text-secondary-foreground hover:text-white"
                }`}
              >
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
        <a
          href="/vini_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-all duration-200 active:scale-95"
        >
          Download Resume
        </a>
      </div>
    </nav>
  )
}
