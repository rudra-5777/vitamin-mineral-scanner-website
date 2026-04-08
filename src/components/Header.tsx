import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

const NAV_LINKS = ['Recognizer', 'Scanner', 'Ripeness', 'Nutrition', 'About']

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            <span className="text-lg font-bold text-gradient">AgroScan AI</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#scanner"
              className="px-4 py-2 text-sm font-semibold bg-green-500 hover:bg-green-400 text-white rounded-lg transition-colors"
            >
              Try Free
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-gray-900 px-4 py-4 space-y-2">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block py-2 text-sm text-gray-400 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <a
            href="#scanner"
            className="block mt-2 text-center px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg"
            onClick={() => setOpen(false)}
          >
            Try Free
          </a>
        </div>
      )}
    </header>
  )
}
