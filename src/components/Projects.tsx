"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, LayoutGroup, useInView } from "framer-motion"
import { ArrowUpRight, X, ExternalLink, Github, Star, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  category: string
  featured: boolean
  description: string
  outcome: string
  tech: string[]
  flow: string
  github: string | null
  link: string | null
  images?: string[]
  image: string
  filter: string[]
}

const projects: Project[] = [
  {
    id: "keliri-app",
    title: "Keliri",
    category: "Cross-Platform Application",
    featured: true,
    description: "Shipped a geo-targeted ad platform in 6 weeks — React Native mobile app + full admin portal, live in Bengaluru with real publisher accounts.",
    outcome: "Built during internship at Vinidra Softtech · Deployed to AWS EC2 · S3 media storage",
    tech: ["React Native", "Next.js", "AWS EC2", "Amazon S3", "Spring Boot"],
    flow: "React Native → Next.js API → Spring Boot → AWS EC2 → Amazon S3",
    github: null,
    link: null,
    images: ["/projects/keliri-1.jpeg", "/projects/keliri-2.jpeg", "/projects/keliri-3.jpeg"],
    image: "/projects/keliri-1.jpeg",
    filter: ["Mobile", "Fullstack"],
  },
  {
    id: "shopchipzo",
    title: "ShopChipzo",
    category: "E-Commerce Platform",
    featured: true,
    description: "E-commerce platform with WhatsApp-native checkout — handles cart, payments, and order tracking for 90-minute electronic component delivery.",
    outcome: "Live on Vercel · WhatsApp API integrated · Full vendor dashboard",
    tech: ["React", "Node.js", "MongoDB", "Cloudflare R2", "WhatsApp API"],
    flow: "Frontend (React) → Node.js API → MongoDB → Cloudflare R2 → WhatsApp",
    github: null,
    link: "https://chipzo-frontend.vercel.app",
    images: ["/projects/chipzo-1.png", "/projects/chipzo-2.png", "/projects/chipzo-3.png"],
    image: "/projects/chipzo-1.png",
    filter: ["Frontend", "Fullstack"],
  },
  {
    id: "forensic",
    title: "Forensic Analyzer",
    category: "Hackathon Project",
    featured: false,
    description: "Media authenticity detection tool built at a hackathon — verifies images and videos using deep learning and computer vision in real time.",
    outcome: "Built in 24 hrs at hackathon · Deep learning pipeline · OpenCV feature extraction",
    tech: ["Next.js", "Node.js", "Deep Learning", "OpenCV"],
    flow: "Media Input → Feature Extraction → Deep Learning Analysis → Forensics Report",
    github: null,
    link: null,
    images: ["/projects/forensic-1.jpeg", "/projects/forensic-2.jpeg", "/projects/forensic-3.jpeg"],
    image: "/projects/forensic-1.jpeg",
    filter: ["AI/ML", "Fullstack"],
  },
  {
    id: "leaf-disease",
    title: "Leaf Disease Detection",
    category: "Deep Learning & AI",
    featured: false,
    description: "Two-stage deep learning pipeline (YOLOv8 + DenseNet121 + EfficientNet-B0 ensemble) achieving 98% classification accuracy on the PlantVillage dataset.",
    outcome: "98% accuracy · Published on Hugging Face Spaces · PlantVillage dataset",
    tech: ["TensorFlow", "YOLOv8", "DenseNet121", "OpenCV", "Python"],
    flow: "Dataset → YOLOv8 (ROI) → Ensemble Model → Hugging Face Space",
    github: null,
    link: null,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop",
    filter: ["AI/ML"],
  },
  {
    id: "docquery",
    title: "DocQuery — PDF Analyzer",
    category: "Generative AI",
    featured: false,
    description: "Chat with any PDF using RAG architecture — upload a document and get instant, cited answers via a clean chat interface powered by OpenAI.",
    outcome: "RAG pipeline · OpenAI API · Vector DB retrieval · Full chat UI",
    tech: ["LangChain", "RAG", "OpenAI API", "Python", "Next.js"],
    flow: "PDF Upload → Text Extraction → Vector DB → LLM Query → Chat Interface",
    github: null,
    link: null,
    image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2000&auto=format&fit=crop",
    filter: ["AI/ML", "Frontend"],
  },
  {
    id: "heart-disease",
    title: "Heart Disease Prediction",
    category: "Machine Learning",
    featured: false,
    description: "ML model for early detection of heart disease using clinical parameters — trained on patient health data with Scikit-learn pipelines.",
    outcome: "Early detection model · Clinical parameter analysis · Scikit-learn pipeline",
    tech: ["Python", "Scikit-learn", "Pandas", "Machine Learning"],
    flow: "Patient Data → Preprocessing → ML Model → Prediction",
    github: "https://github.com/Vinithsaireddy/Al-Heart-Disease-Prediction",
    link: null,
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2000&auto=format&fit=crop",
    filter: ["AI/ML"],
  },
]

const FILTERS = ["All", "Frontend", "Fullstack", "Mobile", "AI/ML"]
const INITIAL_COMPACT_SHOW = 4

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
}

const compactCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" as const } },
}

// ─── Featured (large) card ───────────────────────────────────────────────────
function FeaturedCard({
  project,
  isSelected,
  onToggle,
  onClose,
}: {
  project: Project
  isSelected: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const [activeImage, setActiveImage] = useState(0)
  const currentImage =
    project.images && project.images.length > 0 ? project.images[activeImage] : project.image

  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={onToggle}
      variants={cardVariants}
      className={`
        relative cursor-pointer group rounded-3xl overflow-hidden glass border border-white/10 
        transition-all duration-500 ease-out origin-center
        ${isSelected ? "h-auto" : "h-[480px] hover:border-primary/50"}
      `}
      style={{ perspective: 1000 }}
      whileHover={
        isSelected
          ? {}
          : { rotateX: -1.5, rotateY: 1.5, scale: 1.005, transition: { duration: 0.3 } }
      }
    >
      {/* Background Image */}
      <motion.div layoutId={`image-${project.id}`} className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity duration-500 ${
            isSelected ? "opacity-90" : "group-hover:opacity-40"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
      </motion.div>

      {/* Featured Badge */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-xs font-semibold text-white border border-primary/50 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
        <Star className="w-3 h-3 fill-white" />
        Featured
      </div>

      {/* Quick Action Buttons */}
      {!isSelected && (
        <div className="absolute top-6 left-6 z-20 flex gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-white border border-white/10 hover:bg-white/20 transition-colors"
            >
              <Github className="w-3 h-3" /> GitHub
            </Link>
          )}
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/80 backdrop-blur-md text-xs font-medium text-white border border-primary/30 hover:bg-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Live Demo
            </Link>
          )}
        </div>
      )}

      {/* Content */}
      <motion.div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
        <motion.div layoutId={`content-${project.id}`}>
          <p className="text-primary font-mono text-sm mb-4 uppercase tracking-wider">
            {project.category}
          </p>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center gap-4 transition-transform duration-500 group-hover:-translate-y-2">
            {project.title}
            {!isSelected && (
              <ArrowUpRight className="w-8 h-8 opacity-0 -translate-x-4 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
            )}
          </h3>

          <div
            className={`flex flex-wrap gap-2 transition-all duration-500 ${
              isSelected
                ? "opacity-100 mb-8"
                : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
            }`}
          >
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white/80 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="border-t border-white/10 pt-8 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Project Overview</h4>
                  <p className="text-secondary-foreground text-lg leading-relaxed mb-4">
                    {project.description}
                  </p>
                  {project.outcome && (
                    <p className="text-primary/80 text-sm font-mono mb-8 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      {project.outcome}
                    </p>
                  )}

                  {project.images && project.images.length > 1 && (
                    <div className="flex gap-2 mb-6">
                      {project.images.map((img, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={img}
                          alt={`${project.title} screenshot ${i + 1}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImage(i)
                          }}
                          className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                            activeImage === i
                              ? "border-primary scale-105"
                              : "border-white/10 opacity-60 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </Link>
                    )}
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Source Code
                      </Link>
                    )}
                    {!project.link && !project.github && (
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white/40 font-medium rounded-full border border-white/10 text-sm">
                        GitHub link coming soon
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-sm font-mono text-secondary-foreground mb-6 uppercase tracking-wider">
                    Architecture Flow
                  </h4>
                  <div className="flex flex-col gap-4">
                    {project.flow.split("→").map((step, stepIdx, arr) => (
                      <div key={stepIdx} className="relative pl-6">
                        <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                        {stepIdx !== arr.length - 1 && (
                          <div className="absolute left-[3px] top-4 bottom-[-16px] w-px bg-gradient-to-b from-primary/50 to-transparent" />
                        )}
                        <span className="text-white font-medium">{step.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Compact card ─────────────────────────────────────────────────────────────
function CompactCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={compactCardVariants}
      className="group relative rounded-2xl glass border border-white/10 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(79,70,229,0.15)]"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />

        {/* Hover action links */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Github className="w-3 h-3" /> GitHub
            </Link>
          )}
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary/80 backdrop-blur-md text-xs font-medium text-white border border-primary/30 hover:bg-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Demo
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-primary font-mono text-xs mb-1 uppercase tracking-wider">
          {project.category}
        </p>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-sm text-secondary-foreground leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 font-mono"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/40 font-mono">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function Projects() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [showMore, setShowMore] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

  const filteredProjects = projects.filter(
    (p) => activeFilter === "All" || p.filter.includes(activeFilter)
  )

  const featuredProjects = filteredProjects.filter((p) => p.featured)
  const otherProjects = filteredProjects.filter((p) => !p.featured)
  const visibleOthers = showMore ? otherProjects : otherProjects.slice(0, INITIAL_COMPACT_SHOW)

  return (
    <section id="projects" className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Cinematic Showcase</h2>
          <p className="text-xl text-secondary-foreground max-w-2xl">
            A collection of production apps, AI pipelines, and systems I&apos;ve shipped.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-16"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter)
                setShowMore(false)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        <LayoutGroup>
          <div ref={ref}>
            {/* Featured Projects — Large Cards */}
            {featuredProjects.length > 0 && (
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
              >
                {featuredProjects.map((project) => (
                  <FeaturedCard
                    key={project.id}
                    project={project}
                    isSelected={selectedId === project.id}
                    onToggle={() => setSelectedId(selectedId === project.id ? null : project.id)}
                    onClose={() => setSelectedId(null)}
                  />
                ))}
              </motion.div>
            )}

            {/* Compact grid divider */}
            {otherProjects.length > 0 && featuredProjects.length > 0 && (
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/30">
                  More Projects
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
            )}

            {/* Compact Grid */}
            {otherProjects.length > 0 && (
              <>
                <motion.div
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  initial="hidden"
                  animate={isInView ? "show" : "hidden"}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleOthers.map((project) => (
                      <CompactCard key={project.id} project={project} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Show More / Less */}
                {otherProjects.length > INITIAL_COMPACT_SHOW && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-200"
                    >
                      {showMore ? (
                        <>
                          Show Less <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                        </>
                      ) : (
                        <>
                          Show {otherProjects.length - INITIAL_COMPACT_SHOW} More{" "}
                          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 text-secondary-foreground"
              >
                <p className="text-lg">No projects match this filter.</p>
              </motion.div>
            )}
          </div>
        </LayoutGroup>
      </div>
    </section>
  )
}
