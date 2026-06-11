"use client"

import { motion } from "framer-motion"

const phases = [
  {
    title: "App Developer & Full Stack Intern",
    location: "Vinidra Softtech",
    date: "Mar 2025 – Apr 2025",
    badge: "Internship",
    description: "Shipped Keliri in 6 weeks — React Native mobile app + full admin portal with role-based access control (Super Admin & Admin tiers), deployed to AWS EC2 with S3 media storage. Served live publishers in Bengaluru.",
    highlights: ["React Native", "Next.js", "Spring Boot", "AWS EC2", "Amazon S3"],
  },
  {
    title: "B.E. in Computer Science",
    location: "Bangalore Institute of Technology",
    date: "2023 – 2027",
    badge: "Education",
    description: "CGPA: 8.2 / 10. Focus on deep learning, mobile app development, and modern web architectures. Built production-grade AI/ML projects including a 98%-accurate plant disease detection pipeline.",
    highlights: ["Deep Learning", "Mobile Dev", "Web Architecture", "CGPA 8.2"],
  },
  {
    title: "Pre-University Science",
    location: "Vidyaniketan PU Science College",
    date: "2021 – 2023",
    badge: "Education",
    description: "Completed with 82.6%. Developed foundational interest in programming and engineering.",
    highlights: ["82.6%"],
  },
]

const badgeColor: Record<string, string> = {
  Internship: "bg-primary/20 text-primary border-primary/30",
  Education: "bg-white/5 text-white/50 border-white/10",
}

export function Experience() {
  return (
    <section id="experience" className="py-32 px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Experience &amp; Education</h2>
          <p className="text-xl text-secondary-foreground">
            My professional journey and academic background.
          </p>
        </motion.div>

        <div className="relative border-l border-white/10 ml-4 md:ml-0 md:border-none">
          {phases.map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="mb-12 relative md:flex md:items-start md:justify-between group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[21px] md:left-1/2 md:-ml-[6px] top-1 md:top-3 w-3 h-3 rounded-full bg-white/20 transition-all duration-300 z-10 group-hover:bg-primary group-hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] group-hover:scale-125" />

              {/* Center line for desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -z-10" />

              {/* Left side */}
              <div className={`pl-8 md:pl-0 md:w-5/12 ${idx % 2 === 0 ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"}`}>
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border mb-3 ${badgeColor[phase.badge]}`}>
                  {phase.badge}
                </span>
                <h3 className="text-2xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                  {phase.title}
                </h3>
                <p className="text-sm font-medium text-white/60 mb-1">{phase.location}</p>
                <p className="text-xs font-mono text-primary/80">{phase.date}</p>
              </div>

              {/* Right side */}
              <div className={`pl-8 md:pl-0 md:w-5/12 mt-3 md:mt-0 ${idx % 2 === 0 ? "md:order-2 md:pl-12" : "md:text-right md:pr-12"}`}>
                <p className="text-secondary-foreground leading-relaxed mb-4">{phase.description}</p>
                <div className={`flex flex-wrap gap-2 ${idx % 2 !== 0 ? "md:justify-end" : ""}`}>
                  {phase.highlights.map((h) => (
                    <span key={h} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 font-mono">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
