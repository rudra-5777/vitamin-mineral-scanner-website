interface Vitamin {
  name: string
  symbol: string
  benefits: string[]
  sources: string[]
  color: string
  emoji: string
}

interface Mineral {
  name: string
  benefits: string[]
  sources: string[]
  color: string
  emoji: string
}

const VITAMINS: Vitamin[] = [
  {
    name: 'Vitamin A',
    symbol: 'A',
    benefits: ['Vision health', 'Immune function', 'Skin & cell growth'],
    sources: ['Carrots', 'Sweet potato', 'Spinach', 'Liver'],
    color: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    emoji: '🥕',
  },
  {
    name: 'Vitamin C',
    symbol: 'C',
    benefits: ['Antioxidant protection', 'Collagen synthesis', 'Immune support'],
    sources: ['Oranges', 'Bell peppers', 'Strawberries', 'Broccoli'],
    color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    emoji: '🍊',
  },
  {
    name: 'Vitamin D',
    symbol: 'D',
    benefits: ['Bone health', 'Calcium absorption', 'Immune regulation'],
    sources: ['Sunlight', 'Fatty fish', 'Egg yolks', 'Fortified milk'],
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    emoji: '☀️',
  },
  {
    name: 'Vitamin E',
    symbol: 'E',
    benefits: ['Antioxidant', 'Skin protection', 'Cell signalling'],
    sources: ['Almonds', 'Sunflower seeds', 'Avocado', 'Olive oil'],
    color: 'bg-green-500/10 border-green-500/20 text-green-400',
    emoji: '🥑',
  },
  {
    name: 'Vitamin K',
    symbol: 'K',
    benefits: ['Blood clotting', 'Bone metabolism', 'Heart health'],
    sources: ['Kale', 'Spinach', 'Broccoli', 'Brussels sprouts'],
    color: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    emoji: '🥦',
  },
  {
    name: 'Vitamin B12',
    symbol: 'B12',
    benefits: ['Nerve function', 'Red blood cells', 'DNA synthesis'],
    sources: ['Beef', 'Clams', 'Dairy', 'Eggs'],
    color: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    emoji: '🥩',
  },
]

const MINERALS: Mineral[] = [
  {
    name: 'Calcium',
    benefits: ['Bone & teeth strength', 'Muscle contraction', 'Nerve signalling'],
    sources: ['Dairy', 'Tofu', 'Kale', 'Almonds'],
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emoji: '🦷',
  },
  {
    name: 'Iron',
    benefits: ['Oxygen transport', 'Energy metabolism', 'Immune support'],
    sources: ['Red meat', 'Lentils', 'Spinach', 'Pumpkin seeds'],
    color: 'bg-red-500/10 border-red-500/20 text-red-400',
    emoji: '🩸',
  },
  {
    name: 'Magnesium',
    benefits: ['Muscle relaxation', 'Energy production', 'Bone health'],
    sources: ['Dark chocolate', 'Avocado', 'Nuts', 'Legumes'],
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    emoji: '🍫',
  },
  {
    name: 'Potassium',
    benefits: ['Heart rhythm', 'Fluid balance', 'Muscle function'],
    sources: ['Bananas', 'Potatoes', 'Beans', 'Yogurt'],
    color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    emoji: '🍌',
  },
  {
    name: 'Zinc',
    benefits: ['Wound healing', 'Immune defence', 'Protein synthesis'],
    sources: ['Oysters', 'Beef', 'Chickpeas', 'Pumpkin seeds'],
    color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    emoji: '🦪',
  },
  {
    name: 'Selenium',
    benefits: ['Thyroid function', 'Antioxidant defence', 'DNA repair'],
    sources: ['Brazil nuts', 'Tuna', 'Sunflower seeds', 'Mushrooms'],
    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    emoji: '🥜',
  },
]

function Card({ emoji, name, badge, color, benefits, sources }: {
  emoji: string
  name: string
  badge: string
  color: string
  benefits: string[]
  sources: string[]
}) {
  return (
    <div className={`rounded-2xl border p-5 ${color} bg-opacity-10 transition-all hover:scale-[1.02]`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="font-bold text-white">{name}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>{badge}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Benefits</p>
          <ul className="space-y-0.5">
            {benefits.map((b) => (
              <li key={b} className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Top Sources</p>
          <div className="flex flex-wrap gap-1">
            {sources.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-white/5 rounded-md text-xs text-gray-400">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NutritionInfo() {
  return (
    <section id="nutrition" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 mb-4">
            Nutrition Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Vitamins &amp; Minerals Reference
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A quick reference guide to essential micronutrients, their health benefits, and the best dietary sources.
          </p>
        </div>

        {/* Vitamins */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">V</span>
            Vitamins
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VITAMINS.map((v) => (
              <Card
                key={v.name}
                emoji={v.emoji}
                name={v.name}
                badge={`Vitamin ${v.symbol}`}
                color={v.color}
                benefits={v.benefits}
                sources={v.sources}
              />
            ))}
          </div>
        </div>

        {/* Minerals */}
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">M</span>
            Minerals
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MINERALS.map((m) => (
              <Card
                key={m.name}
                emoji={m.emoji}
                name={m.name}
                badge="Mineral"
                color={m.color}
                benefits={m.benefits}
                sources={m.sources}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
