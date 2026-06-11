import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a] text-[#f0f0f0]">
      <div className="text-center">
        <h1 className="text-6xl font-black text-[#ff1e00]">404</h1>
        <p className="mt-4 text-white/60">Page not found</p>
        <Link href="/" className="mt-6 inline-block text-sm text-[#8ff0e0] hover:underline">
          Return home
        </Link>
      </div>
    </div>
  )
}
