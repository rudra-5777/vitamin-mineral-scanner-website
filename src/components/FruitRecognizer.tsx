import { useState, useRef, useCallback } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'

// ---------------------------------------------------------------------------
// Nutritional data mapped from ImageNet class labels MobileNet uses
// ---------------------------------------------------------------------------
interface FruitNutrition {
  name: string
  emoji: string
  calories: number
  servingSize: string
  nutrients: { label: string; value: string; dv: number; color: string }[]
  description: string
}

const FRUIT_DATA: Record<string, FruitNutrition> = {
  banana: {
    name: 'Banana', emoji: '🍌', calories: 89, servingSize: '100g (1 medium)',
    description: 'Naturally sweet and energy-dense, rich in potassium and B6.',
    nutrients: [
      { label: 'Potassium', value: '358 mg', dv: 8, color: 'bg-yellow-400' },
      { label: 'Vitamin B6', value: '0.37 mg', dv: 22, color: 'bg-orange-400' },
      { label: 'Vitamin C', value: '8.7 mg', dv: 10, color: 'bg-amber-400' },
      { label: 'Magnesium', value: '27 mg', dv: 6, color: 'bg-teal-400' },
      { label: 'Folate', value: '20 mcg', dv: 5, color: 'bg-blue-400' },
      { label: 'Fiber', value: '2.6 g', dv: 9, color: 'bg-green-400' },
    ],
  },
  'granny smith': {
    name: 'Apple (Granny Smith)', emoji: '🍎', calories: 58, servingSize: '100g',
    description: 'Tart green apple packed with fibre and antioxidants.',
    nutrients: [
      { label: 'Vitamin C', value: '7.8 mg', dv: 9, color: 'bg-orange-400' },
      { label: 'Potassium', value: '107 mg', dv: 2, color: 'bg-yellow-400' },
      { label: 'Fiber', value: '2.8 g', dv: 10, color: 'bg-green-400' },
      { label: 'Vitamin K', value: '2.2 mcg', dv: 2, color: 'bg-teal-400' },
      { label: 'Folate', value: '3 mcg', dv: 1, color: 'bg-blue-400' },
      { label: 'Calcium', value: '6 mg', dv: 1, color: 'bg-cyan-400' },
    ],
  },
  lemon: {
    name: 'Lemon', emoji: '🍋', calories: 29, servingSize: '100g',
    description: 'Highly acidic citrus fruit, excellent source of Vitamin C.',
    nutrients: [
      { label: 'Vitamin C', value: '53 mg', dv: 59, color: 'bg-orange-400' },
      { label: 'Potassium', value: '138 mg', dv: 3, color: 'bg-yellow-400' },
      { label: 'Folate', value: '11 mcg', dv: 3, color: 'bg-blue-400' },
      { label: 'Calcium', value: '26 mg', dv: 2, color: 'bg-cyan-400' },
      { label: 'Magnesium', value: '8 mg', dv: 2, color: 'bg-teal-400' },
      { label: 'Fiber', value: '2.8 g', dv: 10, color: 'bg-green-400' },
    ],
  },
  orange: {
    name: 'Orange', emoji: '🍊', calories: 47, servingSize: '100g',
    description: 'Classic citrus with nearly a full day of Vitamin C.',
    nutrients: [
      { label: 'Vitamin C', value: '53 mg', dv: 59, color: 'bg-orange-400' },
      { label: 'Folate', value: '30 mcg', dv: 8, color: 'bg-blue-400' },
      { label: 'Potassium', value: '181 mg', dv: 4, color: 'bg-yellow-400' },
      { label: 'Calcium', value: '40 mg', dv: 3, color: 'bg-cyan-400' },
      { label: 'Fiber', value: '2.4 g', dv: 9, color: 'bg-green-400' },
      { label: 'Thiamine (B1)', value: '0.09 mg', dv: 8, color: 'bg-amber-400' },
    ],
  },
  pineapple: {
    name: 'Pineapple', emoji: '🍍', calories: 50, servingSize: '100g',
    description: 'Tropical fruit with bromelain enzyme and high Vitamin C.',
    nutrients: [
      { label: 'Vitamin C', value: '47.8 mg', dv: 53, color: 'bg-orange-400' },
      { label: 'Manganese', value: '0.93 mg', dv: 40, color: 'bg-amber-400' },
      { label: 'Potassium', value: '109 mg', dv: 2, color: 'bg-yellow-400' },
      { label: 'Folate', value: '18 mcg', dv: 5, color: 'bg-blue-400' },
      { label: 'Fiber', value: '1.4 g', dv: 5, color: 'bg-green-400' },
      { label: 'Vitamin B6', value: '0.11 mg', dv: 6, color: 'bg-teal-400' },
    ],
  },
  strawberry: {
    name: 'Strawberry', emoji: '🍓', calories: 32, servingSize: '100g',
    description: 'Low-calorie berry bursting with Vitamin C and antioxidants.',
    nutrients: [
      { label: 'Vitamin C', value: '58.8 mg', dv: 65, color: 'bg-orange-400' },
      { label: 'Manganese', value: '0.39 mg', dv: 17, color: 'bg-amber-400' },
      { label: 'Folate', value: '24 mcg', dv: 6, color: 'bg-blue-400' },
      { label: 'Potassium', value: '153 mg', dv: 3, color: 'bg-yellow-400' },
      { label: 'Fiber', value: '2.0 g', dv: 7, color: 'bg-green-400' },
      { label: 'Vitamin K', value: '2.2 mcg', dv: 2, color: 'bg-teal-400' },
    ],
  },
  fig: {
    name: 'Fig', emoji: '🍑', calories: 74, servingSize: '100g',
    description: 'Sweet fig rich in calcium, potassium and dietary fibre.',
    nutrients: [
      { label: 'Calcium', value: '35 mg', dv: 3, color: 'bg-cyan-400' },
      { label: 'Potassium', value: '232 mg', dv: 5, color: 'bg-yellow-400' },
      { label: 'Fiber', value: '2.9 g', dv: 10, color: 'bg-green-400' },
      { label: 'Vitamin B6', value: '0.11 mg', dv: 6, color: 'bg-orange-400' },
      { label: 'Magnesium', value: '17 mg', dv: 4, color: 'bg-teal-400' },
      { label: 'Vitamin K', value: '4.7 mcg', dv: 4, color: 'bg-purple-400' },
    ],
  },
  jackfruit: {
    name: 'Jackfruit', emoji: '🍈', calories: 95, servingSize: '100g',
    description: 'Large tropical fruit high in B vitamins and antioxidants.',
    nutrients: [
      { label: 'Vitamin C', value: '13.7 mg', dv: 15, color: 'bg-orange-400' },
      { label: 'Vitamin B6', value: '0.33 mg', dv: 19, color: 'bg-amber-400' },
      { label: 'Potassium', value: '448 mg', dv: 10, color: 'bg-yellow-400' },
      { label: 'Magnesium', value: '37 mg', dv: 9, color: 'bg-teal-400' },
      { label: 'Fiber', value: '1.5 g', dv: 5, color: 'bg-green-400' },
      { label: 'Calcium', value: '24 mg', dv: 2, color: 'bg-cyan-400' },
    ],
  },
  pomegranate: {
    name: 'Pomegranate', emoji: '🍎', calories: 83, servingSize: '100g',
    description: 'Antioxidant powerhouse with strong anti-inflammatory properties.',
    nutrients: [
      { label: 'Vitamin C', value: '10.2 mg', dv: 11, color: 'bg-orange-400' },
      { label: 'Folate', value: '38 mcg', dv: 10, color: 'bg-blue-400' },
      { label: 'Potassium', value: '236 mg', dv: 5, color: 'bg-yellow-400' },
      { label: 'Fiber', value: '4.0 g', dv: 14, color: 'bg-green-400' },
      { label: 'Vitamin K', value: '16.4 mcg', dv: 14, color: 'bg-teal-400' },
      { label: 'Copper', value: '0.16 mg', dv: 18, color: 'bg-amber-400' },
    ],
  },
  mango: {
    name: 'Mango', emoji: '🥭', calories: 60, servingSize: '100g',
    description: 'King of fruits, loaded with Vitamin A and immune-boosting Vitamin C.',
    nutrients: [
      { label: 'Vitamin A', value: '54 mcg', dv: 6, color: 'bg-orange-400' },
      { label: 'Vitamin C', value: '36 mg', dv: 40, color: 'bg-amber-400' },
      { label: 'Folate', value: '43 mcg', dv: 11, color: 'bg-blue-400' },
      { label: 'Potassium', value: '168 mg', dv: 4, color: 'bg-yellow-400' },
      { label: 'Vitamin B6', value: '0.12 mg', dv: 7, color: 'bg-teal-400' },
      { label: 'Fiber', value: '1.6 g', dv: 6, color: 'bg-green-400' },
    ],
  },
  avocado: {
    name: 'Avocado', emoji: '🥑', calories: 160, servingSize: '100g',
    description: 'Creamy nutrient-dense fruit rich in healthy fats and potassium.',
    nutrients: [
      { label: 'Potassium', value: '485 mg', dv: 10, color: 'bg-yellow-400' },
      { label: 'Vitamin K', value: '21 mcg', dv: 18, color: 'bg-teal-400' },
      { label: 'Folate', value: '81 mcg', dv: 20, color: 'bg-blue-400' },
      { label: 'Vitamin C', value: '10 mg', dv: 11, color: 'bg-orange-400' },
      { label: 'Vitamin B6', value: '0.26 mg', dv: 15, color: 'bg-amber-400' },
      { label: 'Fiber', value: '6.7 g', dv: 24, color: 'bg-green-400' },
    ],
  },
  grape: {
    name: 'Grapes', emoji: '🍇', calories: 69, servingSize: '100g',
    description: 'Rich in resveratrol antioxidants and a good source of Vitamin K.',
    nutrients: [
      { label: 'Vitamin K', value: '14.6 mcg', dv: 12, color: 'bg-teal-400' },
      { label: 'Vitamin C', value: '3.2 mg', dv: 4, color: 'bg-orange-400' },
      { label: 'Potassium', value: '191 mg', dv: 4, color: 'bg-yellow-400' },
      { label: 'Copper', value: '0.13 mg', dv: 14, color: 'bg-amber-400' },
      { label: 'Fiber', value: '0.9 g', dv: 3, color: 'bg-green-400' },
      { label: 'Thiamine (B1)', value: '0.07 mg', dv: 6, color: 'bg-purple-400' },
    ],
  },
  watermelon: {
    name: 'Watermelon', emoji: '🍉', calories: 30, servingSize: '100g',
    description: 'Hydrating summer fruit with lycopene and citrulline.',
    nutrients: [
      { label: 'Vitamin C', value: '8.1 mg', dv: 9, color: 'bg-orange-400' },
      { label: 'Vitamin A', value: '28 mcg', dv: 3, color: 'bg-amber-400' },
      { label: 'Potassium', value: '112 mg', dv: 2, color: 'bg-yellow-400' },
      { label: 'Lycopene', value: '4532 mcg', dv: 0, color: 'bg-red-400' },
      { label: 'Vitamin B6', value: '0.04 mg', dv: 3, color: 'bg-teal-400' },
      { label: 'Magnesium', value: '10 mg', dv: 2, color: 'bg-green-400' },
    ],
  },
  peach: {
    name: 'Peach', emoji: '🍑', calories: 39, servingSize: '100g',
    description: 'Juicy stone fruit high in Vitamin C and beta-carotene.',
    nutrients: [
      { label: 'Vitamin C', value: '6.6 mg', dv: 7, color: 'bg-orange-400' },
      { label: 'Vitamin A', value: '16 mcg', dv: 2, color: 'bg-amber-400' },
      { label: 'Potassium', value: '190 mg', dv: 4, color: 'bg-yellow-400' },
      { label: 'Niacin (B3)', value: '0.81 mg', dv: 5, color: 'bg-teal-400' },
      { label: 'Fiber', value: '1.5 g', dv: 5, color: 'bg-green-400' },
      { label: 'Vitamin E', value: '0.73 mg', dv: 5, color: 'bg-cyan-400' },
    ],
  },
}

// Match an ImageNet class string to a fruit key
function matchFruit(className: string): FruitNutrition | null {
  const lower = className.toLowerCase()
  for (const key of Object.keys(FRUIT_DATA)) {
    if (lower.includes(key)) return FRUIT_DATA[key]
  }
  // Extra aliases
  if (lower.includes('apple')) return FRUIT_DATA['granny smith']
  if (lower.includes('citrus') || lower.includes('mandarin') || lower.includes('clementine')) return FRUIT_DATA['orange']
  if (lower.includes('berry') || lower.includes('blueberry') || lower.includes('raspberry')) return FRUIT_DATA['strawberry']
  if (lower.includes('melon')) return FRUIT_DATA['watermelon']
  if (lower.includes('plum') || lower.includes('nectarine') || lower.includes('apricot')) return FRUIT_DATA['peach']
  return null
}

// Model singleton
let modelCache: mobilenet.MobileNet | null = null
async function getModel() {
  if (!modelCache) modelCache = await mobilenet.load({ version: 2, alpha: 1 })
  return modelCache
}

interface Prediction {
  className: string
  probability: number
}

export default function FruitRecognizer() {
  const [dragging, setDragging] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading-model' | 'classifying' | 'done' | 'error'>('idle')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [matched, setMatched] = useState<FruitNutrition | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const classify = useCallback(async (imgEl: HTMLImageElement) => {
    try {
      setStatus('loading-model')
      const model = await getModel()
      setStatus('classifying')
      const preds = await model.classify(imgEl, 5)
      setPredictions(preds)
      const fruit = preds.reduce<FruitNutrition | null>((found, p) => found ?? matchFruit(p.className), null)
      setMatched(fruit)
      setStatus('done')
    } catch (e) {
      console.error(e)
      setErrorMsg('Classification failed. Please try another image.')
      setStatus('error')
    }
  }, [])

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setPredictions([])
      setMatched(null)
      setStatus('loading-model')
    }
    reader.readAsDataURL(file)
  }, [])

  // Trigger classification once the <img> has loaded
  const handleImgLoad = useCallback(() => {
    if (imgRef.current) classify(imgRef.current)
  }, [classify])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const reset = () => {
    setImage(null)
    setPredictions([])
    setMatched(null)
    setStatus('idle')
    setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const isLoading = status === 'loading-model' || status === 'classifying'

  return (
    <section id="recognizer" className="py-20 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20 mb-4">
            AI Fruit Recognition
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Identify Any Fruit Instantly
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload a fruit photo and our on-device AI model will identify it and show its full nutritional profile — no server, no signup, completely private.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            Powered by MobileNetV2 trained on 1,000 classes including 40+ fruits &amp; vegetables.
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
                  ${dragging ? 'border-violet-400 bg-violet-500/5' : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'}`}
              >
                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                  <span className="text-4xl">🍑🍋🍌</span>
                </div>
                <p className="text-gray-300 font-medium mb-1">Drop a fruit image here</p>
                <p className="text-gray-500 text-sm">or click to browse · PNG, JPG, WEBP</p>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden h-64">
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Fruit to identify"
                    className="w-full h-full object-contain bg-black/20"
                    onLoad={handleImgLoad}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full border-4 border-violet-400 border-t-transparent animate-spin" />
                      <span className="text-violet-300 text-sm font-medium animate-pulse">
                        {status === 'loading-model' ? 'Loading AI model…' : 'Identifying fruit…'}
                      </span>
                    </div>
                  )}
                  {status === 'done' && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-violet-500 text-white text-xs font-semibold rounded-full">
                        ✓ Identified
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

                {/* Top predictions list */}
                {predictions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Predictions</p>
                    {predictions.map((p, i) => (
                      <div key={p.className} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-4">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-300 capitalize">{p.className.split(',')[0]}</span>
                            <span className="text-gray-500">{(p.probability * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-400 rounded-full transition-all duration-700"
                              style={{ width: `${p.probability * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results panel */}
          <div className="bg-gray-900 rounded-2xl border border-white/5 p-6 min-h-[360px] flex flex-col">
            {status === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-5xl">🔬</span>
                <p className="text-gray-400 font-medium">Upload a fruit photo to begin</p>
                <p className="text-gray-600 text-sm max-w-xs">
                  The AI model runs entirely in your browser — your photos are never uploaded anywhere.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-400 text-sm">Preparing nutritional data…</p>
                <div className="w-full space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-4xl">⚠️</span>
                <p className="text-red-400 font-medium">{errorMsg}</p>
                <button onClick={reset} className="text-sm text-gray-500 hover:text-white transition-colors underline">
                  Try again
                </button>
              </div>
            )}

            {status === 'done' && (
              <div className="flex-1 flex flex-col gap-4">
                {matched ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{matched.emoji}</span>
                      <div>
                        <h3 className="font-bold text-xl">{matched.name}</h3>
                        <p className="text-gray-500 text-sm">{matched.servingSize} · {matched.calories} kcal</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{matched.description}</p>

                    <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1">
                      {matched.nutrients.map((n) => (
                        <div key={n.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{n.label}</span>
                            <span className="text-gray-400">
                              {n.value}
                              {n.dv > 0 && <span className="text-gray-600 ml-1">({n.dv}% DV)</span>}
                            </span>
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
                    <p className="text-xs text-gray-600 pt-2 border-t border-white/5">
                      * % Daily Values based on a 2,000 calorie diet. Results are estimates.
                    </p>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="text-4xl">🤔</span>
                    <p className="text-gray-300 font-medium">Fruit not in database</p>
                    <p className="text-gray-500 text-sm max-w-xs">
                      The model detected:{' '}
                      <span className="text-gray-300 font-medium">
                        {predictions[0]?.className.split(',')[0] ?? 'unknown'}
                      </span>
                      . Try a clearer photo with better lighting.
                    </p>
                    <button onClick={reset} className="text-sm text-violet-400 hover:text-violet-300 transition-colors underline">
                      Try another image
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
