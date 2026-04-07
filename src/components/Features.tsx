import { FlaskConical, Leaf, Heart } from 'lucide-react'

const features = [
  {
    icon: <FlaskConical size={28} className="text-green-600" />,
    title: 'Precision Scanning',
    description:
      'USDA-verified nutrition data with AI-powered fruit identification. Get accurate macro and micronutrient breakdowns instantly.',
  },
  {
    icon: <Leaf size={28} className="text-green-600" />,
    title: 'Ripeness Detection',
    description:
      'Colorimetric analysis determines ripeness and predicts shelf life. Never eat an overripe or underripe fruit again.',
  },
  {
    icon: <Heart size={28} className="text-green-600" />,
    title: 'Disease Compatible',
    description:
      'Personalized recommendations for 12+ medical conditions including diabetes, CKD, and various dietary restrictions.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why VitaScan?</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Combining cutting-edge AI with verified nutritional databases for unmatched accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-shadow p-8 flex flex-col items-start gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
