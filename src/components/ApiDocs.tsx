import { useState } from 'react'

type ApiTabKey = 'identify' | 'nutrition' | 'ripeness' | 'disease'

const tabs: { key: ApiTabKey; label: string }[] = [
  { key: 'identify',  label: 'Fruit Identification' },
  { key: 'nutrition', label: 'Nutrition Data' },
  { key: 'ripeness',  label: 'Ripeness Analysis' },
  { key: 'disease',   label: 'Disease Check' },
]

const codeBlocks: Record<ApiTabKey, string> = {
  identify: `// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Call Claude API for fruit identification
const response = await anthropic.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [{
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: imageBase64
      }
    }, {
      type: "text",
      text: "Identify this fruit and provide: name, ripeness (0-100%), estimated weight in grams"
    }]
  }]
});`,

  nutrition: `// Fetch USDA nutrition data
const { data: nutritionData } = await supabase
  .from('fruits')
  .select('*, vitamins, minerals')
  .eq('name', fruitName)
  .single();

// Calculate for actual weight
const scaledNutrition = scaleNutrition(nutritionData, weightGrams);`,

  ripeness: `// Analyze color profile for ripeness
const ripenessResult = await supabase.functions.invoke(
  'analyze-ripeness',
  {
    body: {
      imageData: base64Image,
      fruitType: 'banana',
      colorProfile: extractColorProfile(imageData)
    }
  }
);

// Returns:
// {
//   ripeness: 85,
//   daysRemaining: 3,
//   recommendation: 'Eat within 3 days'
// }`,

  disease: `// Check disease compatibility
const { data: compatibility } = await supabase
  .from('disease_compatibility')
  .select('status, notes, alternatives')
  .eq('disease_id', diseaseId)
  .eq('fruit_id', fruitId)
  .single();`,
}

function CodeBlock({ code }: { code: string }) {
  const lines = code.split('\n')
  return (
    <div className="bg-gray-900 rounded-xl overflow-auto p-5 text-sm font-mono leading-relaxed">
      {lines.map((line, i) => {
        let rendered: React.ReactNode = line

        if (line.trimStart().startsWith('//')) {
          rendered = <span className="text-gray-400 italic">{line}</span>
        } else {
          rendered = line
            .split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.*)/g)
            .map((part, j) => {
              if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                return <span key={j} className="text-amber-300">{part}</span>
              }
              if (part.startsWith('//')) {
                return <span key={j} className="text-gray-500 italic">{part}</span>
              }
              // Keywords
              const kw = /\b(const|await|async|function|return|import|from|type|interface)\b/g
              const parts = part.split(kw)
              return (
                <span key={j}>
                  {parts.map((p, k) =>
                    /^(const|await|async|function|return|import|from|type|interface)$/.test(p)
                      ? <span key={k} className="text-purple-400">{p}</span>
                      : <span key={k} className="text-gray-200">{p}</span>
                  )}
                </span>
              )
            })
        }

        return (
          <div key={i} className="flex">
            <span className="text-gray-600 select-none w-8 flex-shrink-0 text-right mr-4">{i + 1}</span>
            <span className="flex-1">{rendered}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState<ApiTabKey>('identify')

  return (
    <section id="api-docs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h2>
          <p className="text-gray-500 text-lg">
            Integrate VitaScan into your application with our simple API.
          </p>
        </div>

        <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
          {/* Tab bar */}
          <div className="flex border-b border-gray-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <CodeBlock code={codeBlocks[activeTab]} />
          </div>
        </div>
      </div>
    </section>
  )
}
