export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden" id="about">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-400/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          AI-Powered Nutrition Analysis
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Scan Your Food,{' '}
          <span className="text-gradient">Know Your Nutrition</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
          Upload any photo of fruits, vegetables, or packaged food and instantly get a
          detailed breakdown of vitamins, minerals, ripeness level, and full nutritional content.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#scanner"
            className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
          >
            Start Scanning
          </a>
          <a
            href="#nutrition"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all text-center"
          >
            Learn More
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: '200+', label: 'Foods Supported' },
            { value: '50+', label: 'Nutrients Tracked' },
            { value: '99%', label: 'Accuracy Rate' },
            { value: '<2s', label: 'Scan Time' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/5 rounded-2xl p-5 border border-white/5 card-glow">
              <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">{value}</div>
              <div className="text-xs sm:text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
