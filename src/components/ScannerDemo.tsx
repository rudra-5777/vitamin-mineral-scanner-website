import { useState, useRef, useCallback } from 'react'

interface NutrientResult {
  name: string
  amount: string
  unit: string
  dv: number
  color: string
}

interface ScanResult {
  food: string
  calories: number
  servingSize: string
  nutrients: NutrientResult[]
}

const MOCK_RESULTS: Record<string, ScanResult> = {
  default: {
    food: 'Mixed Vegetables',
    calories: 85,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin C', amount: '89', unit: 'mg', dv: 99, color: 'bg-orange-400' },
      { name: 'Vitamin A', amount: '835', unit: 'mcg', dv: 93, color: 'bg-yellow-400' },
      { name: 'Vitamin K', amount: '110', unit: 'mcg', dv: 92, color: 'bg-green-400' },
      { name: 'Folate', amount: '65', unit: 'mcg', dv: 16, color: 'bg-blue-400' },
      { name: 'Potassium', amount: '443', unit: 'mg', dv: 9, color: 'bg-purple-400' },
      { name: 'Iron', amount: '1.0', unit: 'mg', dv: 6, color: 'bg-red-400' },
      { name: 'Calcium', amount: '99', unit: 'mg', dv: 8, color: 'bg-cyan-400' },
      { name: 'Magnesium', amount: '23', unit: 'mg', dv: 5, color: 'bg-teal-400' },
    ],
  },
}

export default function ScannerDemo() {
  const [dragging, setDragging] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
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
        setResult(MOCK_RESULTS.default)
      }, 2200)
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

  return (
    <section id="scanner" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-400 rounded-full border border-green-500/20 mb-4">
            Vitamin &amp; Mineral Scanner
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Analyze Nutritional Content
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload a photo of any food to get an instant, detailed breakdown of its vitamins and minerals.
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
                  ${dragging ? 'border-green-400 bg-green-500/5' : 'border-white/10 hover:border-green-500/50 hover:bg-white/5'}`}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium mb-1">Drop your food photo here</p>
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
                <img src={image} alt="Food to scan" className="w-full h-full object-cover" />
                {scanning && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
                    <span className="text-green-400 font-medium text-sm animate-pulse">Analyzing nutrients…</span>
                  </div>
                )}
                {!scanning && result && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      ✓ Scan Complete
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

            {/* Tip */}
            <p className="mt-4 text-xs text-gray-600 text-center">
              For best results, ensure the food is well-lit and clearly visible in the photo.
            </p>
          </div>

          {/* Results panel */}
          <div className="bg-gray-900 rounded-2xl border border-white/5 p-6 min-h-[360px] flex flex-col">
            {!result && !scanning && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Upload a photo to see nutritional analysis</p>
              </div>
            )}

            {scanning && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-400 text-sm">Identifying nutrients…</p>
                <div className="w-full space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{result.food}</h3>
                    <p className="text-gray-500 text-sm">Per {result.servingSize} · {result.calories} kcal</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
                    {result.nutrients.length} nutrients
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                  {result.nutrients.map((n) => (
                    <div key={n.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{n.name}</span>
                        <span className="text-gray-400">{n.amount}{n.unit} <span className="text-gray-600">({n.dv}% DV)</span></span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${n.color} transition-all duration-700`}
                          style={{ width: `${Math.min(n.dv, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-600 mt-auto pt-2 border-t border-white/5">
                  * % Daily Values based on a 2,000 calorie diet. Results are estimates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
