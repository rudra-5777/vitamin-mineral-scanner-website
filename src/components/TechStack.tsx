import { Database, Cpu, Code, Shield } from 'lucide-react'

const layers = [
  {
    icon: <Code size={22} className="text-blue-600" />,
    title: 'Frontend Layer',
    color: 'bg-blue-50 border-blue-200',
    titleColor: 'text-blue-800',
    items: ['React + TypeScript', 'Tailwind CSS v4', 'lucide-react', 'react-router-dom v7'],
  },
  {
    icon: <Shield size={22} className="text-purple-600" />,
    title: 'Backend Layer',
    color: 'bg-purple-50 border-purple-200',
    titleColor: 'text-purple-800',
    items: ['Supabase', 'PostgreSQL', 'Edge Functions', 'Row Level Security'],
  },
  {
    icon: <Cpu size={22} className="text-green-600" />,
    title: 'AI Layer',
    color: 'bg-green-50 border-green-200',
    titleColor: 'text-green-800',
    items: ['Claude API', 'OpenAI Vision', 'Custom ML Models', 'Colorimetric Analysis'],
  },
  {
    icon: <Database size={22} className="text-amber-600" />,
    title: 'Data Layer',
    color: 'bg-amber-50 border-amber-200',
    titleColor: 'text-amber-800',
    items: ['USDA FoodData Central', 'Custom Training Data', 'Disease Profiles DB', 'Real-time Sync'],
  },
]

const schemas = [
  {
    table: 'fruits',
    columns: [
      { name: 'id',            type: 'uuid' },
      { name: 'name',          type: 'text' },
      { name: 'color_profile', type: 'text' },
      { name: 'calories',      type: 'numeric' },
      { name: 'vitamins',      type: 'jsonb' },
      { name: 'seasons',       type: 'text[]' },
    ],
  },
  {
    table: 'diseases',
    columns: [
      { name: 'id',              type: 'uuid' },
      { name: 'name',            type: 'text' },
      { name: 'restrictions',    type: 'jsonb' },
      { name: 'recommendations', type: 'text[]' },
    ],
  },
  {
    table: 'scan_results',
    columns: [
      { name: 'id',             type: 'uuid' },
      { name: 'fruit_id',       type: 'uuid → fruits' },
      { name: 'ripeness_score', type: 'numeric' },
      { name: 'scanned_at',     type: 'timestamptz' },
      { name: 'user_id',        type: 'uuid' },
    ],
  },
]

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tech Stack</h2>
          <p className="text-gray-500 text-lg">
            Modern, scalable architecture built for production.
          </p>
        </div>

        {/* Architecture layers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {layers.map((layer) => (
            <div key={layer.title} className={`${layer.color} border rounded-2xl p-5`}>
              <div className="flex items-center gap-2 mb-4">
                {layer.icon}
                <h3 className={`font-bold text-sm ${layer.titleColor}`}>{layer.title}</h3>
              </div>
              <ul className="space-y-2">
                {layer.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Database schema */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">Database Schema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {schemas.map((schema) => (
            <div key={schema.table} className="bg-gray-900 rounded-2xl overflow-hidden">
              <div className="bg-gray-800 px-5 py-3 flex items-center gap-2">
                <Database size={14} className="text-green-400" />
                <span className="text-green-400 font-mono text-sm font-semibold">{schema.table}</span>
              </div>
              <div className="p-5 space-y-2">
                {schema.columns.map((col) => (
                  <div key={col.name} className="flex justify-between items-center font-mono text-xs">
                    <span className="text-blue-300">{col.name}</span>
                    <span className="text-amber-300">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
