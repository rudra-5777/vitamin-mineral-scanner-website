import { useRef, useState } from 'react'
import { Bell, Camera, Loader2, RefreshCw, Upload } from 'lucide-react'

type ProduceKey = 'banana' | 'apple' | 'mango' | 'orange' | 'carrot' | 'broccoli' | 'tomato' | 'spinach'

const produceData: Record<ProduceKey, { emoji: string; category: 'Fruit' | 'Vegetable'; ripeness: number; daysLeft: number }> = {
  banana:   { emoji: '🍌', category: 'Fruit',     ripeness: 85, daysLeft: 3  },
  apple:    { emoji: '🍎', category: 'Fruit',     ripeness: 70, daysLeft: 7  },
  mango:    { emoji: '🥭', category: 'Fruit',     ripeness: 60, daysLeft: 5  },
  orange:   { emoji: '🍊', category: 'Fruit',     ripeness: 90, daysLeft: 2  },
  carrot:   { emoji: '🥕', category: 'Vegetable', ripeness: 55, daysLeft: 10 },
  broccoli: { emoji: '🥦', category: 'Vegetable', ripeness: 65, daysLeft: 5  },
  tomato:   { emoji: '🍅', category: 'Vegetable', ripeness: 80, daysLeft: 4  },
  spinach:  { emoji: '🥬', category: 'Vegetable', ripeness: 45, daysLeft: 3  },
}

const allKeys     = Object.keys(produceData) as ProduceKey[]
const fruits      = allKeys.filter((k) => produceData[k].category === 'Fruit')
const vegetables  = allKeys.filter((k) => produceData[k].category === 'Vegetable')

const mangoVarieties = ['Alphonso', 'Kesar', 'Tommy Atkins']

function getRipenessColor(ripeness: number) {
  if (ripeness >= 80) return { bar: 'bg-red-500',   text: 'text-red-600',   badge: 'bg-red-100 text-red-700 border-red-200',     label: 'Overripe' }
  if (ripeness >= 50) return { bar: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Ripe'     }
  return               { bar: 'bg-green-500', text: 'text-green-600', badge: 'bg-green-100 text-green-700 border-green-200', label: 'Unripe'   }
}

export default function RipenessDemo() {
  const fileInputRef                      = useRef<HTMLInputElement>(null)
  const [selected, setSelected]           = useState<ProduceKey>('banana')
  const [mangoVariety, setMangoVariety]   = useState('Alphonso')
  const [imageUrl, setImageUrl]           = useState<string | null>(null)
  const [scanning, setScanning]           = useState(false)
  const [dragging, setDragging]           = useState(false)

  const item   = produceData[selected]
  const colors = getRipenessColor(item.ripeness)

  function openFilePicker() {
    if (!scanning) fileInputRef.current?.click()
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setScanning(true)

    // Determine dominant hue to guess the produce
    await new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const SIZE = 128
          const canvas = document.createElement('canvas')
          canvas.width = SIZE
          canvas.height = SIZE
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, SIZE, SIZE)
          const margin = Math.floor(SIZE * 0.2)
          const { data } = ctx.getImageData(margin, margin, SIZE - margin * 2, SIZE - margin * 2)
          let r = 0, g = 0, b = 0, count = 0
          for (let i = 0; i < data.length; i += 4) {
            const pr = data[i], pg = data[i + 1], pb = data[i + 2]
            if (pr > 220 && pg > 220 && pb > 220) continue
            if (Math.max(pr, pg, pb) - Math.min(pr, pg, pb) < 20 && Math.max(pr, pg, pb) < 180) continue
            r += pr; g += pg; b += pb; count++
          }
          if (count < 50) {
            const full = ctx.getImageData(0, 0, SIZE, SIZE)
            const n = full.data.length / 4
            r = 0; g = 0; b = 0
            for (let i = 0; i < full.data.length; i += 4) { r += full.data[i]; g += full.data[i + 1]; b += full.data[i + 2] }
            r /= n; g /= n; b /= n
          } else { r /= count; g /= count; b /= count }

          let key: ProduceKey
          if      (r > 170 && g > 140 && b < 100 && r - b > 80)        key = 'banana'
          else if (r > 180 && g > 100 && g < 175 && b < 70)            key = 'orange'
          else if (r > 170 && g > 65  && b < 75  && r - g > 80)        key = 'carrot'
          else if (r > 150 && g > 70  && b < 80  && r - b > 90)        key = 'mango'
          else if (r > 140 && g < 100 && b < 100 && r - g > 50)        key = r > 165 ? 'tomato' : 'apple'
          else if (g > r + 15 && g > b + 15 && g > 110)                key = 'broccoli'
          else if (g > r + 8  && g > b + 8)                            key = 'spinach'
          else key = allKeys[Math.floor(Math.random() * allKeys.length)]

          setSelected(key)
          resolve()
        }
        img.src = ev.target!.result as string
      }
      reader.readAsDataURL(file)
    })

    await new Promise((r) => setTimeout(r, 1600))
    setScanning(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function resetScan() {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setScanning(false)
  }

  function ProduceButton({ k }: { k: ProduceKey }) {
    return (
      <button
        onClick={() => setSelected(k)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm border transition-all ${
          selected === k
            ? 'bg-green-500 text-white border-green-500 shadow-md'
            : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
        }`}
      >
        <span className="text-lg">{produceData[k].emoji}</span>
        {k.charAt(0).toUpperCase() + k.slice(1)}
      </button>
    )
  }

  return (
    <section id="ripeness" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ripeness Detection</h2>
          <p className="text-gray-500 text-lg">
            Colorimetric analysis predicts freshness and shelf life for fruits &amp; vegetables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Controls */}
          <div>
            {/* Image upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={scanning}
              onChange={handleInputChange}
            />

            {/* Drop zone / preview */}
            <div
              onClick={openFilePicker}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
              onDragLeave={(e) => { e.stopPropagation(); setDragging(false) }}
              onDrop={handleDrop}
              role="button"
              tabIndex={scanning ? -1 : 0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFilePicker() }}
              aria-label="Upload fruit or vegetable photo for ripeness analysis"
              className={`relative border-2 border-dashed rounded-2xl h-44 flex flex-col items-center justify-center gap-3 mb-3 transition-colors overflow-hidden select-none
                ${scanning ? 'border-green-400 bg-green-50 cursor-wait' : 'cursor-pointer'}
                ${dragging ? 'border-green-500 bg-green-50' : !imageUrl ? 'border-gray-300 bg-gray-50 hover:border-green-400 group' : 'border-green-400 bg-gray-900'}`}
            >
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Uploaded produce" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  {scanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-2">
                      <Loader2 size={28} className="text-green-400 animate-spin" />
                      <p className="text-white text-sm font-semibold">Detecting ripeness…</p>
                    </div>
                  )}
                  {!scanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 gap-1">
                      <span className="text-4xl">{item.emoji}</span>
                      <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">{item.ripeness}% ripe</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Camera size={36} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                  <p className="text-gray-500 text-sm group-hover:text-green-600 transition-colors text-center px-4">
                    Click to upload or drag &amp; drop a photo
                  </p>
                </>
              )}
            </div>

            {!scanning && !imageUrl && (
              <button
                type="button"
                onClick={openFilePicker}
                className="flex items-center justify-center gap-2 w-full mb-5 py-2.5 rounded-xl border-2 border-green-500 bg-green-500 text-white text-sm font-semibold cursor-pointer hover:bg-green-600 hover:border-green-600 transition-colors"
              >
                <Upload size={16} />
                Upload Image
              </button>
            )}
            {imageUrl && !scanning && (
              <button
                onClick={resetScan}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-5 transition-colors"
              >
                <RefreshCw size={14} /> Scan a new image
              </button>
            )}

            {/* Fruit selector */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Fruits</p>
            <div className="flex gap-3 flex-wrap mb-4">
              {fruits.map((k) => <ProduceButton key={k} k={k} />)}
            </div>

            {/* Vegetable selector */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vegetables</p>
            <div className="flex gap-3 flex-wrap mb-8">
              {vegetables.map((k) => <ProduceButton key={k} k={k} />)}
            </div>

            {/* Mango variety */}
            {selected === 'mango' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Mango Variety</p>
                <div className="flex gap-2 flex-wrap">
                  {mangoVarieties.map((v) => (
                    <button
                      key={v}
                      onClick={() => setMangoVariety(v)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        mangoVariety === v
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colorimetric gradient bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Colorimetric Analysis</p>
              <div className="relative h-6 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #22c55e, #f59e0b, #ef4444)' }}>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-md rounded-full transition-all duration-500"
                  style={{ left: `calc(${item.ripeness}% - 2px)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>Unripe</span>
                <span>Ripe</span>
                <span>Overripe</span>
              </div>
            </div>

            {/* Push notification mockup */}
            <div className="bg-gray-900 rounded-2xl p-4 max-w-xs shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Bell size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">VitaScan Alert</p>
                  <p className="text-gray-300 text-xs mt-0.5">
                    ⚠️ {selected.charAt(0).toUpperCase() + selected.slice(1)} expiring in {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Ripeness meter */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 text-center">
            <span className="text-6xl block mb-4">{item.emoji}</span>
            <h3 className="text-2xl font-bold text-gray-900 capitalize mb-1">{selected}</h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border mb-5 inline-block ${
              item.category === 'Fruit'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-teal-50 text-teal-700 border-teal-200'
            }`}>
              {item.category}
            </span>

            {/* Big ripeness number */}
            <div className={`text-8xl font-extrabold mb-2 ${colors.text}`}>
              {item.ripeness}
              <span className="text-4xl">%</span>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${colors.badge} mb-6`}>
              {colors.label}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-4 mb-6">
              <div
                className={`${colors.bar} h-4 rounded-full transition-all duration-700`}
                style={{ width: `${item.ripeness}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{item.daysLeft}</div>
                <div className="text-sm text-gray-500">Days Remaining</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{item.ripeness}%</div>
                <div className="text-sm text-gray-500">Ripeness Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
