"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Vinith delivered the entire Keliri platform — React Native app plus the admin portal — in just 6 weeks. The code quality, attention to deployment details, and proactive communication were outstanding for someone at his stage.",
    author: "Mentor, Vinidra Softtech",
    role: "Internship Supervisor",
    initials: "VS",
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
  },
  {
    quote:
      "Vinith's leaf disease detection pipeline was one of the most technically rigorous submissions in our course. The 98% accuracy on PlantVillage using an ensemble approach shows real depth of understanding in deep learning.",
    author: "Faculty, BIT Bangalore",
    role: "Deep Learning Course",
    initials: "FB",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    quote:
      "Working with Vinith on ShopChipzo was a great experience — he understood the full-stack requirements quickly, integrated the WhatsApp API cleanly, and shipped a production-ready vendor dashboard with minimal back-and-forth.",
    author: "Collaborator, ShopChipzo",
    role: "Product Partner",
    initials: "SC",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-32 px-6 relative z-10 overflow-hidden">
      {/* Decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -right-40 top-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Quote className="w-4 h-4" />
            Social Proof
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            What people{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
              say
            </span>
          </h2>
          <p className="text-xl text-secondary-foreground max-w-2xl">
            From internship supervisors to project collaborators and academic faculty.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${t.color} border ${t.border} flex flex-col gap-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-shadow duration-300`}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-white/10 absolute top-6 right-6" />

              {/* Quote text */}
              <p className="text-base text-secondary-foreground leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-white/40 font-mono">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
