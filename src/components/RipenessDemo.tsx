import { useState } from 'react'
import { Bell } from 'lucide-react'

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
  const [selected, setSelected]         = useState<ProduceKey>('banana')
  const [mangoVariety, setMangoVariety] = useState('Alphonso')

  const item   = produceData[selected]
  const colors = getRipenessColor(item.ripeness)

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
