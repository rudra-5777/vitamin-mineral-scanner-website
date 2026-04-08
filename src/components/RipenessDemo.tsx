import { useState, useRef, useCallback } from 'react'

interface RipenessResult {
  food: string
  stage: 'Unripe' | 'Nearly Ripe' | 'Ripe' | 'Overripe'
  confidence: number
  color: string
  emoji: string
  tips: string[]
  bestBefore: string
}

const RIPENESS_MOCK: RipenessResult = {
  food: 'Banana',
  stage: 'Ripe',
  confidence: 94,
  color: 'text-green-400',
  emoji: '🍌',
  tips: [
    'Best time to eat – sweetness and nutrients are at their peak.',
    'Store at room temperature away from direct sunlight.',
    'Ideal for smoothies, fruit salads, or eating fresh.',
    'Will start browning within 1–2 days.',
  ],
  bestBefore: '1–2 days',
}

const STAGE_COLORS: Record<string, string> = {
  Unripe: 'bg-blue-400',
  'Nearly Ripe': 'bg-yellow-400',
  Ripe: 'bg-green-400',
  Overripe: 'bg-red-400',
}

const STAGE_STEPS = ['Unripe', 'Nearly Ripe', 'Ripe', 'Overripe']

export default function RipenessDemo() {
  const [dragging, setDragging] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<RipenessResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setResult(null)
      setScanning(true)
      setTimeout(() => {
        setScanning(false)
        setResult(RIPENESS_MOCK)
      }, 2000)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const reset = () => {
    setImage(null)
    setResult(null)
    setScanning(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const stageIndex = result ? STAGE_STEPS.indexOf(result.stage) : -1

  return (
    <section id="ripeness" className="py-20 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-4">
            Ripeness Detector
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Check Fruit &amp; Veggie Freshness
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload a photo to instantly determine ripeness stage, storage tips, and how long your produce will last.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Upload panel */}
          <div className="bg-gray-900 rounded-2xl border border-white/5 p-6">
            {!image ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl h-72 flex flex-col items-center justify-center cursor-pointer transition-all
                  ${dragging ? 'border-emerald-400 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'}`}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <span className="text-4xl">🍎</span>
                </div>
                <p className="text-gray-300 font-medium mb-1">Drop a fruit or vegetable photo</p>
                <p className="text-gray-500 text-sm">or click to browse · PNG, JPG, WEBP</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden h-72">
                <img src={image} alt="Produce to analyse" className="w-full h-full object-cover" />
                {scanning && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
                    <span className="text-emerald-400 font-medium text-sm animate-pulse">Detecting ripeness…</span>
                  </div>
                )}
                {!scanning && result && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                      ✓ Analysis Complete
                    </span>
                  </div>
                )}
                <button
                  onClick={reset}
                  className="absolute top-3 left-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Results panel */}
          <div className="bg-gray-900 rounded-2xl border border-white/5 p-6 min-h-[360px] flex flex-col">
            {!result && !scanning && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-5xl">🔍</span>
                <p className="text-gray-500 text-sm">Upload a photo to detect ripeness stage</p>
              </div>
            )}

            {scanning && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-400 text-sm">Analysing produce…</p>
                <div className="w-full space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div className="flex-1 flex flex-col gap-5">
                {/* Headline */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{result.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{result.food}</h3>
                    <p className={`text-sm font-semibold ${result.color}`}>
                      {result.stage} · {result.confidence}% confidence
                    </p>
                  </div>
                </div>

                {/* Ripeness stepper */}
                <div className="flex items-center gap-1">
                  {STAGE_STEPS.map((s, i) => (
                    <div key={s} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`h-2 w-full rounded-full transition-all duration-500
                        ${i <= stageIndex ? STAGE_COLORS[result.stage] : 'bg-white/10'}`} />
                      <span className={`text-xs ${i === stageIndex ? 'text-white font-semibold' : 'text-gray-600'}`}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Best before */}
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/5">
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Best consumed within</p>
                    <p className="font-semibold text-white">{result.bestBefore}</p>
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Storage Tips</p>
                  <ul className="space-y-1.5">
                    {result.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
