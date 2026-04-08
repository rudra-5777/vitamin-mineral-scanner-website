import { useState } from 'react'
import { Check, AlertTriangle, X } from 'lucide-react'

type FruitKey = 'banana' | 'apple' | 'mango' | 'orange'
type DiseaseKey = 'diabetes' | 'ckd' | 'fasting'
type Status = 'green' | 'yellow' | 'red'

const fruitData: Record<FruitKey, { emoji: string }> = {
  banana: { emoji: '🍌' },
  apple:  { emoji: '🍎' },
  mango:  { emoji: '🥭' },
  orange: { emoji: '🍊' },
}

const diseaseCompatibility: Record<DiseaseKey, Record<FruitKey, Status>> = {
  diabetes: { banana: 'yellow', apple: 'green', mango: 'yellow', orange: 'yellow' },
  ckd:      { banana: 'red',    apple: 'green', mango: 'yellow', orange: 'yellow' },
  fasting:  { banana: 'green',  apple: 'green', mango: 'green',  orange: 'green'  },
}

const explanations: Record<DiseaseKey, Record<FruitKey, string>> = {
  diabetes: {
    banana: 'High GI, moderate portions only',
    apple:  'Low GI, fiber-rich, excellent choice',
    mango:  'High natural sugar, limit portions',
    orange: 'Moderate GI, eat whole not juiced',
  },
  ckd: {
    banana: 'High potassium – avoid with CKD',
    apple:  'Low potassium, kidney-friendly',
    mango:  'Moderate potassium, consume cautiously',
    orange: 'Moderate potassium, small portions',
  },
  fasting: {
    banana: 'Provides energy and nutrients during fast',
    apple:  'Provides energy and nutrients during fast',
    mango:  'Provides energy and nutrients during fast',
    orange: 'Provides energy and nutrients during fast',
  },
}

const diseases: { key: DiseaseKey; label: string }[] = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'ckd',      label: 'CKD (Kidney Disease)' },
  { key: 'fasting',  label: 'Fasting' },
]

const fruits: FruitKey[] = ['banana', 'apple', 'mango', 'orange']

interface StatusCardProps {
  status: Status
  fruit: FruitKey
  disease: DiseaseKey
}

function StatusCard({ status, fruit, disease }: StatusCardProps) {
  const config = {
    green:  { bg: 'bg-green-50',  border: 'border-green-200', badge: 'bg-green-100 text-green-800',  icon: <Check size={14} />,          label: 'Safe' },
    yellow: { bg: 'bg-amber-50',  border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800',  icon: <AlertTriangle size={14} />, label: 'Moderate' },
    red:    { bg: 'bg-red-50',    border: 'border-red-200',   badge: 'bg-red-100 text-red-800',       icon: <X size={14} />,             label: 'Avoid' },
  }[status]

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-3xl">{fruitData[fruit].emoji}</span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${config.badge}`}>
          {config.icon}
          {config.label}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-800 capitalize">{fruit}</p>
      <p className="text-xs text-gray-500">{explanations[disease][fruit]}</p>
    </div>
  )
}

export default function DiseaseCompatibility() {
  const [activeDisease, setActiveDisease] = useState<DiseaseKey>('diabetes')

  return (
    <section id="disease" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Disease Compatibility</h2>
          <p className="text-gray-500 text-lg">
            Personalized fruit recommendations based on your health profile.
          </p>
        </div>

        {/* Disease tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {diseases.map((d) => (
            <button
              key={d.key}
              onClick={() => setActiveDisease(d.key)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
                activeDisease === d.key
                  ? 'bg-green-500 text-white border-green-500 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Fruit cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fruits.map((fruit) => (
            <StatusCard
              key={fruit}
              status={diseaseCompatibility[activeDisease][fruit]}
              fruit={fruit}
              disease={activeDisease}
            />
          ))}
        </div>

        {/* Fasting special note */}
        {activeDisease === 'fasting' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-green-800 font-semibold text-sm">
              🌿 Energy Foods — All fruits provide sustained energy for fasting periods.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
