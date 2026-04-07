import { useState } from 'react'
import { Camera, Check } from 'lucide-react'

type FruitKey = 'banana' | 'apple' | 'mango' | 'orange'

const fruitData = {
  banana: { emoji: '🍌', calories: 89, carbs: 23, protein: 1.1, fat: 0.3, vitaminC: 8.7, potassium: 358, ripeness: 85, daysLeft: 3 },
  apple:  { emoji: '🍎', calories: 52, carbs: 14, protein: 0.3, fat: 0.2, vitaminC: 4.6, potassium: 107, ripeness: 70, daysLeft: 7 },
  mango:  { emoji: '🥭', calories: 60, carbs: 15, protein: 0.8, fat: 0.4, vitaminC: 36.4, potassium: 168, ripeness: 60, daysLeft: 5 },
  orange: { emoji: '🍊', calories: 47, carbs: 12, protein: 0.9, fat: 0.1, vitaminC: 53.2, potassium: 181, ripeness: 90, daysLeft: 2 },
}

const fruits: FruitKey[] = ['banana', 'apple', 'mango', 'orange']

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
        <span className="text-gray-800 font-semibold">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function ScannerDemo() {
  const [selected, setSelected] = useState<FruitKey>('banana')
  const [weight, setWeight] = useState(100)

  const base = fruitData[selected]
  const scale = weight / 100

  const scaled = {
    calories:  base.calories  * scale,
    carbs:     base.carbs     * scale,
    protein:   base.protein   * scale,
    fat:       base.fat       * scale,
    vitaminC:  base.vitaminC  * scale,
    potassium: base.potassium * scale,
  }

  return (
    <section id="scanner" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Scanner Demo</h2>
          <p className="text-gray-500 text-lg">
            Select a fruit below to see real-time nutrition analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Camera UI + fruit selector */}
          <div>
            {/* Fake camera box */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 h-56 flex flex-col items-center justify-center gap-3 mb-6 cursor-pointer hover:border-green-400 transition-colors group">
              <Camera size={40} className="text-gray-400 group-hover:text-green-500 transition-colors" />
              <p className="text-gray-500 text-sm group-hover:text-green-600 transition-colors">
                Click to scan or drag photo
              </p>
            </div>

            {/* Fruit selector */}
            <div className="flex gap-3 flex-wrap mb-6">
              {fruits.map((fruit) => (
                <button
                  key={fruit}
                  onClick={() => setSelected(fruit)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm border transition-all ${
                    selected === fruit
                      ? 'bg-green-500 text-white border-green-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                  }`}
                >
                  <span className="text-lg">{fruitData[fruit].emoji}</span>
                  {fruit.charAt(0).toUpperCase() + fruit.slice(1)}
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
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                  <Check size={12} />
                  USDA Verified
                </span>
              </div>
            </div>

            <NutrientBar label="Calories" value={scaled.calories} max={200} unit="kcal" color="bg-amber-500" />
            <NutrientBar label="Carbohydrates" value={scaled.carbs} max={50} unit="g" color="bg-blue-500" />
            <NutrientBar label="Protein" value={scaled.protein} max={10} unit="g" color="bg-purple-500" />
            <NutrientBar label="Fat" value={scaled.fat} max={10} unit="g" color="bg-red-400" />
            <NutrientBar label="Vitamin C" value={scaled.vitaminC} max={100} unit="mg" color="bg-green-500" />
            <NutrientBar label="Potassium" value={scaled.potassium} max={500} unit="mg" color="bg-teal-500" />

            <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
              Nutrition values scaled for {weight}g serving. Based on USDA FoodData Central.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
