"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, LayoutGroup, useInView } from "framer-motion"
import { ArrowUpRight, X, ExternalLink, Github, Star } from "lucide-react"
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
  },
  {
    id: "shopchipzo",
    title: "ShopChipzo",
    category: "E-Commerce Platform",
    featured: false,
    description: "E-commerce platform with WhatsApp-native checkout — handles cart, payments, and order tracking for 90-minute electronic component delivery.",
    outcome: "Live on Vercel · WhatsApp API integrated · Full vendor dashboard",
    tech: ["React", "Node.js", "MongoDB", "Cloudflare R2", "WhatsApp API"],
    flow: "Frontend (React) → Node.js API → MongoDB → Cloudflare R2 → WhatsApp",
    github: null,
    link: "https://chipzo-frontend.vercel.app",
    images: ["/projects/chipzo-1.png", "/projects/chipzo-2.png", "/projects/chipzo-3.png"],
    image: "/projects/chipzo-1.png",
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
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
}

function ProjectCard({
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
    project.images && project.images.length > 0
      ? project.images[activeImage]
      : project.image

  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={onToggle}
      variants={cardVariants}
      className={`
        relative cursor-pointer group rounded-3xl overflow-hidden glass border border-white/10 
        transition-all duration-500 ease-out origin-center
        ${isSelected ? "h-auto" : "h-[420px] hover:border-primary/50"}
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
      {project.featured && (
        <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-xs font-semibold text-white border border-primary/50 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          <Star className="w-3 h-3 fill-white" />
          Featured
        </div>
      )}

      {/* Quick Action Buttons (visible on hover, not when selected) */}
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

      {/* Content Container */}
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

          {/* Tech Pills */}
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

                  {/* Image Switcher */}
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

              {/* Close button */}
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

export function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <section id="projects" className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Cinematic Showcase</h2>
          <p className="text-xl text-secondary-foreground max-w-2xl">
            A collection of production apps, AI pipelines, and systems I&apos;ve shipped — click any card to explore.
          </p>
        </motion.div>

        <LayoutGroup>
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="flex flex-col gap-12"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedId === project.id}
                onToggle={() =>
                  setSelectedId(selectedId === project.id ? null : project.id)
                }
                onClose={() => setSelectedId(null)}
              />
            ))}
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  )
}
