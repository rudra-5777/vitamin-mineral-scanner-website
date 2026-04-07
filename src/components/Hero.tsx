const floatingFruits = [
  { emoji: '🍎', style: 'top-[12%] left-[8%] text-4xl' },
  { emoji: '🍌', style: 'top-[20%] right-[10%] text-5xl' },
  { emoji: '🥭', style: 'top-[55%] left-[5%] text-3xl' },
  { emoji: '🍊', style: 'top-[70%] right-[8%] text-4xl' },
  { emoji: '🍇', style: 'top-[35%] left-[15%] text-3xl' },
  { emoji: '🍓', style: 'top-[80%] left-[25%] text-4xl' },
  { emoji: '🫐', style: 'top-[25%] right-[22%] text-3xl' },
]

const stats = [
  { value: '50+', label: 'Fruits Analyzed' },
  { value: '99.2%', label: 'Accuracy' },
  { value: '12', label: 'Disease Profiles' },
  { value: 'Real-time', label: 'Analysis' },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #14532d 0%, #059669 100%)' }}
    >
      {/* Floating fruits */}
      {floatingFruits.map((f, i) => (
        <span
          key={i}
          className={`absolute select-none opacity-20 animate-bounce ${f.style}`}
          style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${2.5 + i * 0.3}s` }}
        >
          {f.emoji}
        </span>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="mb-4 inline-block bg-green-700 bg-opacity-50 text-green-200 text-sm font-medium px-4 py-1.5 rounded-full">
          AI-Powered Nutrition Analysis
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Scan. Analyze.{' '}
          <span className="text-emerald-300">Nourish.</span>
        </h1>
        <p className="text-lg sm:text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          AI-powered vitamin &amp; mineral analysis for every fruit. Know exactly what you're eating with precision nutrition data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('scanner')}
            className="px-8 py-4 bg-green-400 hover:bg-green-300 text-green-900 font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-green-400/30 hover:-translate-y-0.5"
          >
            Try Scanner Demo
          </button>
          <button
            onClick={() => scrollToSection('api-docs')}
            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-900 font-bold rounded-xl text-lg transition-all"
          >
            View API Docs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-20 w-full max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-green-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
