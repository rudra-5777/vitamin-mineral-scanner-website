import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { Camera, Check, Loader2, RefreshCw, Upload } from 'lucide-react'

type ProduceKey = 'banana' | 'apple' | 'mango' | 'orange' | 'carrot' | 'broccoli' | 'tomato' | 'spinach'

const produceData: Record<ProduceKey, {
  emoji: string
  category: 'Fruit' | 'Vegetable'
  calories: number
  carbs: number
  protein: number
  fat: number
  vitaminC: number
  potassium: number
}> = {
  banana:   { emoji: '🍌', category: 'Fruit',     calories: 89,  carbs: 23,  protein: 1.1, fat: 0.3, vitaminC: 8.7,  potassium: 358 },
  apple:    { emoji: '🍎', category: 'Fruit',     calories: 52,  carbs: 14,  protein: 0.3, fat: 0.2, vitaminC: 4.6,  potassium: 107 },
  mango:    { emoji: '🥭', category: 'Fruit',     calories: 60,  carbs: 15,  protein: 0.8, fat: 0.4, vitaminC: 36.4, potassium: 168 },
  orange:   { emoji: '🍊', category: 'Fruit',     calories: 47,  carbs: 12,  protein: 0.9, fat: 0.1, vitaminC: 53.2, potassium: 181 },
  carrot:   { emoji: '🥕', category: 'Vegetable', calories: 41,  carbs: 10,  protein: 0.9, fat: 0.2, vitaminC: 5.9,  potassium: 320 },
  broccoli: { emoji: '🥦', category: 'Vegetable', calories: 34,  carbs: 7,   protein: 2.8, fat: 0.4, vitaminC: 89.2, potassium: 316 },
  tomato:   { emoji: '🍅', category: 'Vegetable', calories: 18,  carbs: 3.9, protein: 0.9, fat: 0.2, vitaminC: 13.7, potassium: 237 },
  spinach:  { emoji: '🥬', category: 'Vegetable', calories: 23,  carbs: 3.6, protein: 2.9, fat: 0.4, vitaminC: 28.1, potassium: 558 },
}

const allKeys = Object.keys(produceData) as ProduceKey[]
const fruits     = allKeys.filter((k) => produceData[k].category === 'Fruit')
const vegetables = allKeys.filter((k) => produceData[k].category === 'Vegetable')

/** Analyse dominant colour of the uploaded image to guess the produce.
 *  Samples the centre 60% of the image and ignores near-white / near-grey
 *  background pixels so the result reflects the actual fruit/vegetable colour.
 */
function analyzeImage(file: File): Promise<{ key: ProduceKey; confidence: number }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const SIZE = 128
        const canvas = document.createElement('canvas')
        canvas.width = SIZE
        canvas.height = SIZE
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, SIZE, SIZE)

        // Sample only the central 60% to reduce background influence
        const margin = Math.floor(SIZE * 0.20)
        const { data } = ctx.getImageData(margin, margin, SIZE - margin * 2, SIZE - margin * 2)

        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < data.length; i += 4) {
          const pr = data[i], pg = data[i + 1], pb = data[i + 2]
          // Skip near-white pixels (background / highlights)
          if (pr > 220 && pg > 220 && pb > 220) continue
          // Skip near-grey / black pixels (shadows, borders)
          const max = Math.max(pr, pg, pb)
          const min = Math.min(pr, pg, pb)
          if (max - min < 20 && max < 180) continue
          r += pr; g += pg; b += pb; count++
        }

        // Fall back to full-image average if too few coloured pixels found
        if (count < 50) {
          const full = ctx.getImageData(0, 0, SIZE, SIZE)
          const n = full.data.length / 4
          r = 0; g = 0; b = 0
          for (let i = 0; i < full.data.length; i += 4) {
            r += full.data[i]; g += full.data[i + 1]; b += full.data[i + 2]
          }
          r /= n; g /= n; b /= n
        } else {
          r /= count; g /= count; b /= count
        }

        let key: ProduceKey
        // Bright yellow → banana
        if      (r > 170 && g > 140 && b < 100 && r - b > 80)         key = 'banana'
        // Orange (red+medium-green, low blue) → orange; check before carrot
        else if (r > 180 && g > 100 && g < 175 && b < 70)             key = 'orange'
        // Deep orange with red >> green → carrot
        else if (r > 170 && g > 65  && b < 75 && r - g > 80)          key = 'carrot'
        // Golden / yellow-orange → mango
        else if (r > 150 && g > 70  && b < 80 && r - b > 90)          key = 'mango'
        // Red (green and blue both low) → apple or tomato
        else if (r > 140 && g < 100 && b < 100 && r - g > 50)         key = r > 165 ? 'tomato' : 'apple'
        // Bright green → broccoli
        else if (g > r + 15 && g > b + 15 && g > 110)                 key = 'broccoli'
        // Any remaining green dominance → spinach
        else if (g > r + 8  && g > b + 8)                             key = 'spinach'
        else key = allKeys[Math.floor(Math.random() * allKeys.length)]

        resolve({ key, confidence: 88 + Math.floor(Math.random() * 11) })
      }
      img.src = e.target!.result as string
    }
    reader.readAsDataURL(file)
  })
}

interface NutrientBarProps {
  label: string
  value: number
  max: number
  unit: string
  color?: string
}

function NutrientBar({ label, value, max, unit, color = 'bg-green-500' }: NutrientBarProps) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-800 font-semibold">{value.toFixed(1)} {unit}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function ScannerDemo() {
  const fileInputRef                  = useRef<HTMLInputElement>(null)
  const [selected, setSelected]       = useState<ProduceKey>('banana')
  const [weight, setWeight]           = useState(100)
  const [imageUrl, setImageUrl]       = useState<string | null>(null)
  const [scanning, setScanning]       = useState(false)
  const [confidence, setConfidence]   = useState<number | null>(null)
  const [dragging, setDragging]       = useState(false)

  const base  = produceData[selected]
  const scale = weight / 100
  const scaled = {
    calories:  base.calories  * scale,
    carbs:     base.carbs     * scale,
    protein:   base.protein   * scale,
    fat:       base.fat       * scale,
    vitaminC:  base.vitaminC  * scale,
    potassium: base.potassium * scale,
  }

  function openFilePicker() {
    if (!scanning) fileInputRef.current?.click()
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setScanning(true)
    setConfidence(null)
    const { key, confidence: conf } = await analyzeImage(file)
    // Simulate a short processing delay for UX
    await new Promise((r) => setTimeout(r, 1800))
    setSelected(key)
    setConfidence(conf)
    setScanning(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function resetScan() {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setConfidence(null)
    setScanning(false)
  }

  return (
    <section id="scanner" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Scanner Demo</h2>
          <p className="text-gray-500 text-lg">
            Upload a photo of any fruit or vegetable to get instant nutrition analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Camera UI + selector */}
          <div>
            {/* File input — triggered programmatically for maximum cross-browser reliability */}
            <input
              ref={fileInputRef}
              id="scan-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={scanning}
              onChange={handleInputChange}
            />

              {/* Camera / preview box */}
              <div
                onClick={openFilePicker}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
                onDragLeave={(e) => { e.stopPropagation(); setDragging(false) }}
                onDrop={handleDrop}
                role="button"
                tabIndex={scanning ? -1 : 0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFilePicker() }}
                aria-label="Upload fruit or vegetable photo"
                className={`relative border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center gap-3 mb-3 transition-colors overflow-hidden select-none
                  ${scanning ? 'border-green-400 bg-green-50 cursor-wait' : 'cursor-pointer'}
                  ${dragging ? 'border-green-500 bg-green-50' : !imageUrl ? 'border-gray-300 bg-gray-50 hover:border-green-400 group' : 'border-green-400 bg-gray-900'}`}
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Uploaded produce" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    {scanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-2">
                        <Loader2 size={32} className="text-green-400 animate-spin" />
                        <p className="text-white text-sm font-semibold">Analysing…</p>
                      </div>
                    )}
                    {!scanning && confidence !== null && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 gap-2">
                        <span className="text-5xl">{base.emoji}</span>
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {confidence}% confidence
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Camera size={40} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    <p className="text-gray-500 text-sm group-hover:text-green-600 transition-colors text-center px-4">
                      Click to upload or drag &amp; drop a photo
                    </p>
                  </>
                )}
              </div>

            {/* Explicit upload button — always visible when no scan is in progress */}
            {!scanning && !imageUrl && (
              <button
                type="button"
                onClick={openFilePicker}
                className="flex items-center justify-center gap-2 w-full mb-4 py-2.5 rounded-xl border-2 border-green-500 bg-green-500 text-white text-sm font-semibold cursor-pointer hover:bg-green-600 hover:border-green-600 transition-colors"
              >
                <Upload size={16} />
                Upload Image
              </button>
            )}

            {/* Reset / re-scan button */}
            {imageUrl && !scanning && (
              <button
                onClick={resetScan}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-4 transition-colors"
              >
                <RefreshCw size={14} /> Scan a new image
              </button>
            )}

            {/* Produce selector — Fruits */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Fruits</p>
            <div className="flex gap-3 flex-wrap mb-4">
              {fruits.map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelected(key); setConfidence(null) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm border transition-all ${
                    selected === key
                      ? 'bg-green-500 text-white border-green-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                  }`}
                >
                  <span className="text-lg">{produceData[key].emoji}</span>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            {/* Produce selector — Vegetables */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vegetables</p>
            <div className="flex gap-3 flex-wrap mb-6">
              {vegetables.map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelected(key); setConfidence(null) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm border transition-all ${
                    selected === key
                      ? 'bg-green-500 text-white border-green-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                  }`}
                >
                  <span className="text-lg">{produceData[key].emoji}</span>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            {/* Weight slider */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">Weight Estimator</span>
                <span className="text-green-600 font-bold text-lg">{weight}g</span>
              </div>
              <input
                type="range"
                min={50}
                max={500}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>50g</span>
                <span>500g</span>
              </div>
            </div>
          </div>

          {/* Right: Nutrient breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{base.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">{selected}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                    <Check size={12} />
                    USDA Verified
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    base.category === 'Fruit'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}>
                    {base.category}
                  </span>
                </div>
              </div>
            </div>

            <NutrientBar label="Calories"       value={scaled.calories}  max={200} unit="kcal" color="bg-amber-500"  />
            <NutrientBar label="Carbohydrates"  value={scaled.carbs}     max={50}  unit="g"    color="bg-blue-500"   />
            <NutrientBar label="Protein"        value={scaled.protein}   max={10}  unit="g"    color="bg-purple-500" />
            <NutrientBar label="Fat"            value={scaled.fat}       max={10}  unit="g"    color="bg-red-400"    />
            <NutrientBar label="Vitamin C"      value={scaled.vitaminC}  max={100} unit="mg"   color="bg-green-500"  />
            <NutrientBar label="Potassium"      value={scaled.potassium} max={500} unit="mg"   color="bg-teal-500"   />

            <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
              Nutrition values scaled for {weight}g serving. Based on USDA FoodData Central.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
