import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Features', id: 'features' },
  { label: 'Scanner', id: 'scanner' },
  { label: 'Ripeness', id: 'ripeness' },
  { label: 'Disease', id: 'disease' },
  { label: 'AI Dashboard', id: 'dashboard' },
  { label: 'Tech Stack', id: 'tech-stack' },
  { label: 'API Docs', id: 'api-docs' },
  { label: 'Get Started', id: 'getting-started' },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 text-xl font-bold text-green-400 hover:text-green-300 transition-colors"
          >
            🍎 VitaScan
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                scrollToSection(link.id)
                setMobileOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
