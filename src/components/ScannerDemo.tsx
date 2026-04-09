import { useState, useRef, useCallback } from 'react'
import { identifyFood, normalizeFood } from '../services/aiService'

interface NutrientResult {
  name: string
  amount: string
  unit: string
  dv: number
  color: string
}

interface ScanResult {
  food: string
  emoji: string
  calories: number
  servingSize: string
  nutrients: NutrientResult[]
}

const FOOD_EMOJI: Record<string, string> = {
  apple: '🍎',
  banana: '🍌',
  orange: '🍊',
  broccoli: '🥦',
  carrot: '🥕',
  tomato: '🍅',
  strawberry: '🍓',
  grape: '🍇',
  mango: '🥭',
  pineapple: '🍍',
  spinach: '🥬',
  avocado: '🥑',
  blueberry: '🫐',
  lemon: '🍋',
  peach: '🍑',
  pear: '🍐',
  watermelon: '🍉',
  kiwi: '🥝',
  cherry: '🍒',
  potato: '🥔',
  default: '🥗',
}

type FoodData = Omit<ScanResult, 'food' | 'emoji'>

const FOOD_NUTRIENTS: Record<string, FoodData> = {
  apple: {
    calories: 52,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin C', amount: '4.6', unit: 'mg', dv: 5, color: 'bg-orange-400' },
      { name: 'Vitamin K', amount: '2.2', unit: 'mcg', dv: 2, color: 'bg-green-400' },
      { name: 'Potassium', amount: '107', unit: 'mg', dv: 2, color: 'bg-purple-400' },
      { name: 'Dietary Fiber', amount: '2.4', unit: 'g', dv: 9, color: 'bg-yellow-400' },
      { name: 'Iron', amount: '0.1', unit: 'mg', dv: 1, color: 'bg-red-400' },
      { name: 'Calcium', amount: '6', unit: 'mg', dv: 1, color: 'bg-cyan-400' },
    ],
  },
  banana: {
    calories: 89,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin B6', amount: '0.4', unit: 'mg', dv: 23, color: 'bg-yellow-400' },
      { name: 'Vitamin C', amount: '8.7', unit: 'mg', dv: 10, color: 'bg-orange-400' },
      { name: 'Potassium', amount: '358', unit: 'mg', dv: 8, color: 'bg-purple-400' },
      { name: 'Magnesium', amount: '27', unit: 'mg', dv: 6, color: 'bg-teal-400' },
      { name: 'Dietary Fiber', amount: '2.6', unit: 'g', dv: 10, color: 'bg-green-400' },
      { name: 'Iron', amount: '0.3', unit: 'mg', dv: 2, color: 'bg-red-400' },
    ],
  },
  orange: {
    calories: 47,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin C', amount: '53', unit: 'mg', dv: 59, color: 'bg-orange-400' },
      { name: 'Folate', amount: '30', unit: 'mcg', dv: 8, color: 'bg-blue-400' },
      { name: 'Potassium', amount: '181', unit: 'mg', dv: 4, color: 'bg-purple-400' },
      { name: 'Calcium', amount: '40', unit: 'mg', dv: 3, color: 'bg-cyan-400' },
      { name: 'Vitamin A', amount: '11', unit: 'mcg', dv: 1, color: 'bg-yellow-400' },
      { name: 'Dietary Fiber', amount: '2.4', unit: 'g', dv: 9, color: 'bg-green-400' },
    ],
  },
  broccoli: {
    calories: 34,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin C', amount: '89', unit: 'mg', dv: 99, color: 'bg-orange-400' },
      { name: 'Vitamin K', amount: '102', unit: 'mcg', dv: 85, color: 'bg-green-400' },
      { name: 'Folate', amount: '63', unit: 'mcg', dv: 16, color: 'bg-blue-400' },
      { name: 'Vitamin A', amount: '31', unit: 'mcg', dv: 3, color: 'bg-yellow-400' },
      { name: 'Potassium', amount: '316', unit: 'mg', dv: 7, color: 'bg-purple-400' },
      { name: 'Calcium', amount: '47', unit: 'mg', dv: 4, color: 'bg-cyan-400' },
      { name: 'Iron', amount: '0.7', unit: 'mg', dv: 4, color: 'bg-red-400' },
    ],
  },
  carrot: {
    calories: 41,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin A', amount: '835', unit: 'mcg', dv: 93, color: 'bg-yellow-400' },
      { name: 'Vitamin K', amount: '13', unit: 'mcg', dv: 11, color: 'bg-green-400' },
      { name: 'Vitamin C', amount: '5.9', unit: 'mg', dv: 7, color: 'bg-orange-400' },
      { name: 'Potassium', amount: '320', unit: 'mg', dv: 7, color: 'bg-purple-400' },
      { name: 'Dietary Fiber', amount: '2.8', unit: 'g', dv: 10, color: 'bg-blue-400' },
      { name: 'Calcium', amount: '33', unit: 'mg', dv: 3, color: 'bg-cyan-400' },
    ],
  },
  spinach: {
    calories: 23,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin K', amount: '483', unit: 'mcg', dv: 100, color: 'bg-green-400' },
      { name: 'Vitamin A', amount: '469', unit: 'mcg', dv: 52, color: 'bg-yellow-400' },
      { name: 'Folate', amount: '194', unit: 'mcg', dv: 49, color: 'bg-blue-400' },
      { name: 'Vitamin C', amount: '28', unit: 'mg', dv: 31, color: 'bg-orange-400' },
      { name: 'Iron', amount: '2.7', unit: 'mg', dv: 15, color: 'bg-red-400' },
      { name: 'Calcium', amount: '99', unit: 'mg', dv: 8, color: 'bg-cyan-400' },
      { name: 'Magnesium', amount: '79', unit: 'mg', dv: 19, color: 'bg-teal-400' },
    ],
  },
  avocado: {
    calories: 160,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin K', amount: '21', unit: 'mcg', dv: 18, color: 'bg-green-400' },
      { name: 'Folate', amount: '81', unit: 'mcg', dv: 20, color: 'bg-blue-400' },
      { name: 'Vitamin C', amount: '10', unit: 'mg', dv: 11, color: 'bg-orange-400' },
      { name: 'Potassium', amount: '485', unit: 'mg', dv: 10, color: 'bg-purple-400' },
      { name: 'Magnesium', amount: '29', unit: 'mg', dv: 7, color: 'bg-teal-400' },
      { name: 'Vitamin E', amount: '2.1', unit: 'mg', dv: 14, color: 'bg-yellow-400' },
    ],
  },
  mango: {
    calories: 60,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin C', amount: '36', unit: 'mg', dv: 40, color: 'bg-orange-400' },
      { name: 'Vitamin A', amount: '54', unit: 'mcg', dv: 6, color: 'bg-yellow-400' },
      { name: 'Folate', amount: '43', unit: 'mcg', dv: 11, color: 'bg-blue-400' },
      { name: 'Potassium', amount: '168', unit: 'mg', dv: 4, color: 'bg-purple-400' },
      { name: 'Vitamin B6', amount: '0.1', unit: 'mg', dv: 8, color: 'bg-teal-400' },
      { name: 'Dietary Fiber', amount: '1.6', unit: 'g', dv: 6, color: 'bg-green-400' },
    ],
  },
  tomato: {
    calories: 18,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin C', amount: '14', unit: 'mg', dv: 15, color: 'bg-orange-400' },
      { name: 'Vitamin K', amount: '7.9', unit: 'mcg', dv: 7, color: 'bg-green-400' },
      { name: 'Vitamin A', amount: '42', unit: 'mcg', dv: 5, color: 'bg-yellow-400' },
      { name: 'Potassium', amount: '237', unit: 'mg', dv: 5, color: 'bg-purple-400' },
      { name: 'Folate', amount: '15', unit: 'mcg', dv: 4, color: 'bg-blue-400' },
      { name: 'Lycopene', amount: '2573', unit: 'mcg', dv: 99, color: 'bg-red-400' },
    ],
  },
  strawberry: {
    calories: 32,
    servingSize: '100g',
    nutrients: [
      { name: 'Vitamin C', amount: '59', unit: 'mg', dv: 65, color: 'bg-orange-400' },
      { name: 'Folate', amount: '24', unit: 'mcg', dv: 6, color: 'bg-blue-400' },
      { name: 'Potassium', amount: '153', unit: 'mg', dv: 3, color: 'bg-purple-400' },
      { name: 'Manganese', amount: '0.4', unit: 'mg', dv: 16, color: 'bg-yellow-400' },
      { name: 'Dietary Fiber', amount: '2', unit: 'g', dv: 7, color: 'bg-green-400' },
      { name: 'Calcium', amount: '16', unit: 'mg', dv: 1, color: 'bg-cyan-400' },
    ],
  },
  default: {
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

function buildResult(name: string): ScanResult {
  const key = normalizeFood(name)
  const data = FOOD_NUTRIENTS[key] ?? FOOD_NUTRIENTS.default
  return { food: name, emoji: FOOD_EMOJI[key] ?? FOOD_EMOJI.default, ...data }
}

export default function ScannerDemo() {
  const [dragging, setDragging] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [editingFood, setEditingFood] = useState(false)
  const [editInput, setEditInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const commitFoodEdit = (name: string) => {
    const trimmed = name.trim()
    if (trimmed) setResult(buildResult(trimmed))
    setEditingFood(false)
  }

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setImage(dataUrl)
      setResult(null)
      setEditingFood(false)
      setScanning(true)
      try {
        const name = await identifyFood(dataUrl)
        setResult(buildResult(name))
      } finally {
        setScanning(false)
      }
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
    setEditingFood(false)
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
                    <span className="text-green-400 font-medium text-sm animate-pulse">Analysing…</span>
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
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl shrink-0">{result.emoji}</span>
                    <div className="min-w-0">
                      {editingFood ? (
                        <input
                          autoFocus
                          type="text"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          onBlur={() => commitFoodEdit(editInput)}
                          onKeyDown={(e) => { if (e.key === 'Enter') commitFoodEdit(editInput) }}
                          className="bg-transparent border-b border-green-400 font-bold text-lg focus:outline-none w-full text-white"
                        />
                      ) : (
                        <button
                          onClick={() => { setEditInput(result.food); setEditingFood(true) }}
                          title="Click to correct the detected food"
                          className="font-bold text-lg hover:text-green-400 transition-colors text-left truncate max-w-[180px] block"
                        >
                          {result.food}
                        </button>
                      )}
                      <p className="text-gray-500 text-sm">Per {result.servingSize} · {result.calories} kcal</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20 shrink-0">
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
