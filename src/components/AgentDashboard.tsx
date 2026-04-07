import { useState } from 'react'
import { Play, Plus, Check } from 'lucide-react'

type TabKey = 'models' | 'add-fruit' | 'add-disease' | 'test'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'models',      label: 'Trained Models' },
  { key: 'add-fruit',   label: 'Add Fruit Entry' },
  { key: 'add-disease', label: 'Add Disease Profile' },
  { key: 'test',        label: 'Test Prediction' },
]

const models = [
  { name: 'Fruit Identifier v2',  type: 'Vision',     accuracy: '99.2%', samples: '50,000', status: 'Active'   },
  { name: 'Ripeness Analyzer v1', type: 'Color',      accuracy: '94.8%', samples: '12,000', status: 'Active'   },
  { name: 'Disease Mapper v3',    type: 'Rule+ML',    accuracy: '97.1%', samples: '8,500',  status: 'Active'   },
  { name: 'Nutrient Estimator v1',type: 'Regression', accuracy: '91.3%', samples: '25,000', status: 'Training' },
]

const colorOptions = ['Green', 'Yellow', 'Orange', 'Red', 'Purple']
const seasonOptions = ['Spring', 'Summer', 'Autumn', 'Winter']
const recommendedFruitOptions = ['Apple', 'Pear', 'Blueberry', 'Watermelon']
const modelOptions = ['Fruit Identifier v2', 'Ripeness Analyzer v1', 'Disease Mapper v3', 'Nutrient Estimator v1']

function Toast({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 mt-4 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
      <Check size={16} className="text-green-600" />
      {message}
    </div>
  )
}

/* ─── Models Tab ─── */
function ModelsTab() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 font-semibold">
          <tr>
            {['Model', 'Type', 'Accuracy', 'Samples', 'Status'].map((h) => (
              <th key={h} className="px-5 py-3 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {models.map((m) => (
            <tr key={m.name} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3 font-medium text-gray-900">{m.name}</td>
              <td className="px-5 py-3 text-gray-600">{m.type}</td>
              <td className="px-5 py-3 text-green-600 font-semibold">{m.accuracy}</td>
              <td className="px-5 py-3 text-gray-600">{m.samples}</td>
              <td className="px-5 py-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  m.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {m.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Add Fruit Tab ─── */
function AddFruitTab() {
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [seasons, setSeasons] = useState<string[]>([])
  const [calories, setCalories] = useState('')
  const [vitaminC, setVitaminC] = useState('')
  const [potassium, setPotassium] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function toggleSeason(s: string) {
    setSeasons((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !color || seasons.length === 0 || !calories || !vitaminC || !potassium) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setName(''); setColor(''); setSeasons([]); setCalories(''); setVitaminC(''); setPotassium('')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Fruit Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Papaya"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Color Profile *</label>
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select color…</option>
          {colorOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Season *</label>
        <div className="flex flex-wrap gap-3">
          {seasonOptions.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={seasons.includes(s)}
                onChange={() => toggleSeason(s)}
                className="accent-green-500 w-4 h-4"
              />
              {s}
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Calories / 100g *</label>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="89"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vitamin C (mg) *</label>
          <input type="number" value={vitaminC} onChange={(e) => setVitaminC(e.target.value)} placeholder="8.7"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Potassium (mg) *</label>
          <input type="number" value={potassium} onChange={(e) => setPotassium(e.target.value)} placeholder="358"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
        <Plus size={16} /> Add Fruit
      </button>
      {submitted && <Toast message="Fruit entry added successfully!" />}
    </form>
  )
}

/* ─── Add Disease Tab ─── */
function AddDiseaseTab() {
  const [name, setName] = useState('')
  const [highPotassium, setHighPotassium] = useState('allow')
  const [highSugar, setHighSugar] = useState('allow')
  const [recommended, setRecommended] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function toggleFruit(f: string) {
    setRecommended((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) { setError('Disease name is required.'); return }
    setError('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setName(''); setHighPotassium('allow'); setHighSugar('allow'); setRecommended([]); setNotes('')
  }

  const radioClass = 'flex items-center gap-2 text-sm text-gray-700 cursor-pointer'

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Disease Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hypertension"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">High Potassium Foods</label>
        <div className="flex gap-6">
          <label className={radioClass}><input type="radio" name="potassium" value="allow" checked={highPotassium === 'allow'} onChange={() => setHighPotassium('allow')} className="accent-green-500" /> Allow</label>
          <label className={radioClass}><input type="radio" name="potassium" value="restrict" checked={highPotassium === 'restrict'} onChange={() => setHighPotassium('restrict')} className="accent-green-500" /> Restrict</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">High Sugar Foods</label>
        <div className="flex gap-6">
          <label className={radioClass}><input type="radio" name="sugar" value="allow" checked={highSugar === 'allow'} onChange={() => setHighSugar('allow')} className="accent-green-500" /> Allow</label>
          <label className={radioClass}><input type="radio" name="sugar" value="restrict" checked={highSugar === 'restrict'} onChange={() => setHighSugar('restrict')} className="accent-green-500" /> Restrict</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Recommended Fruits</label>
        <div className="flex flex-wrap gap-3">
          {recommendedFruitOptions.map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={recommended.includes(f)} onChange={() => toggleFruit(f)} className="accent-green-500 w-4 h-4" />
              {f}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Restriction Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add any additional dietary restrictions…"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
        <Plus size={16} /> Add Disease Profile
      </button>
      {submitted && <Toast message="Disease profile added successfully!" />}
    </form>
  )
}

/* ─── Test Prediction Tab ─── */
function TestPredictionTab() {
  const [model, setModel] = useState(modelOptions[0])
  const [ran, setRan] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleRun() {
    setLoading(true)
    setRan(false)
    setTimeout(() => { setLoading(false); setRan(true) }, 1500)
  }

  return (
    <div className="max-w-xl space-y-5">
      {/* Upload placeholder */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-400 transition-colors">
        <span className="text-4xl">📸</span>
        <p className="text-sm text-gray-500">Click to upload or drag image here</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Select Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
          {modelOptions.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      <button onClick={handleRun} disabled={loading}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
        <Play size={16} />
        {loading ? 'Running…' : 'Run Prediction'}
      </button>

      {ran && (
        <div className="bg-gray-900 rounded-xl p-5 text-sm font-mono">
          <p className="text-green-400 mb-1">// Prediction Result</p>
          <p className="text-white">Detected: <span className="text-yellow-300">Banana 🍌</span></p>
          <p className="text-white">Confidence: <span className="text-green-300">98.7%</span></p>
          <p className="text-white">Ripeness: <span className="text-amber-300">85%</span></p>
          <p className="text-white">Model: <span className="text-blue-300">{model}</span></p>
        </div>
      )}
    </div>
  )
}

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('models')

  return (
    <section id="dashboard" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Agent Dashboard</h2>
          <p className="text-gray-500 text-lg">
            Manage models, data entries, and run predictions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'models'      && <ModelsTab />}
            {activeTab === 'add-fruit'   && <AddFruitTab />}
            {activeTab === 'add-disease' && <AddDiseaseTab />}
            {activeTab === 'test'        && <TestPredictionTab />}
          </div>
        </div>
      </div>
    </section>
  )
}
