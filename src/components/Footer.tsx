import { GitBranch, MessageSquare } from 'lucide-react'

const footerLinks = [
  {
    heading: 'Product',
    links: ['Features', 'Scanner', 'API'],
  },
  {
    heading: 'Resources',
    links: ['Docs', 'GitHub', 'Community'],
  },
  {
    heading: 'Company',
    links: ['About', 'Blog', 'Contact'],
  },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const sectionMap: Record<string, string> = {
  Features: 'features',
  Scanner: 'scanner',
  API: 'api-docs',
  Docs: 'api-docs',
  GitHub: 'api-docs',
  Community: 'dashboard',
  About: 'hero',
  Blog: 'hero',
  Contact: 'hero',
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-white mb-3">🍎 VitaScan</div>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered vitamin &amp; mineral analysis for every fruit. Precision nutrition at your fingertips.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GitBranch size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(sectionMap[link] ?? 'hero')}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-600">
          © 2024 VitaScan. Built with Claude AI &amp; Supabase.
        </div>
      </div>
    </footer>
  )
}
