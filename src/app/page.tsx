import { Hero } from "@/components/Hero"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"
import { Experience } from "@/components/Experience"
import { Process } from "@/components/Process"
import { About } from "@/components/About"
import { Learning } from "@/components/Learning"
import { Contact } from "@/components/Contact"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <Process />
      <About />
      <Learning />
      <Contact />
    </main>
  )
}
