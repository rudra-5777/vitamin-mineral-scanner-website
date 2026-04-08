import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
              <ShieldCheck className="w-6 h-6 text-green-500" /> AgroScan AI
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              AI-powered vitamin, mineral, and ripeness analysis for fruits, vegetables, and packaged foods.
            </p>
          </div>

          {/* Features */}
          <div>
            <p className="text-sm font-semibold text-white mb-3">Features</p>
            <ul className="space-y-2">
              {['Vitamin Scanner', 'Mineral Analysis', 'Ripeness Detector', 'Nutrition Guide'].map((item) => (
                <li key={item}>
                  <a href="#scanner" className="text-sm text-gray-500 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-white mb-3">Info</p>
            <ul className="space-y-2">
              {['About', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#about" className="text-sm text-gray-500 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-gray-600">
            © {year} AgroScan AI. Built with Claude AI &amp; Supabase.
          </p>
          <p className="text-xs text-gray-600">
            Nutritional data is for informational purposes only. Consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
