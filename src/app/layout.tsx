import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-ikye.vercel.app"),
  title: "Vinith Sai Reddy | Full Stack Developer",
  description: "Full Stack Developer building production apps — React Native, Spring Boot, AWS, and AI-powered systems.",
  keywords: ["Full Stack Developer", "React Native", "Next.js", "Spring Boot", "AWS", "AI", "Bangalore"],
  authors: [{ name: "Vinith Sai Reddy" }],
  openGraph: {
    type: "website",
    url: "https://portfolio-ikye.vercel.app",
    title: "Vinith Sai Reddy — Full Stack Developer",
    description: "Building scalable web, mobile & AI-powered apps. React Native · Spring Boot · AWS · TensorFlow.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Vinith Sai Reddy — Full Stack Developer Portfolio",
      },
    ],
    siteName: "Vinith Sai Reddy Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinith Sai Reddy — Full Stack Developer",
    description: "Building scalable web, mobile & AI-powered apps.",
    images: ["/og-preview.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
