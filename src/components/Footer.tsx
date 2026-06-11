import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { icon: Github, href: "https://github.com/Vinithsaireddy", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/vinith-g-523104302/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:gvinith2005@gmail.com", label: "Email" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 relative z-10 mt-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-white/30 order-2 md:order-1">
            © {new Date().getFullYear()} Vinith Sai Reddy. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 order-1 md:order-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <Icon className="w-4 h-4 group-hover:text-primary transition-colors duration-200" />
                <span className="text-xs font-medium hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>

          {/* Built with */}
          <p className="text-xs text-white/20 font-mono order-3">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
