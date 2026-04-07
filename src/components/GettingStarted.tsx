import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  code: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Clone & Install',
    description: 'Clone the VitaScan repository and install dependencies.',
    code: 'git clone https://github.com/your-org/vitascan\ncd vitascan\nnpm install',
  },
  {
    number: 2,
    title: 'Configure Supabase',
    description: 'Create a Supabase project and add your credentials to the environment file.',
    code: 'VITE_SUPABASE_URL=your-project-url\nVITE_SUPABASE_ANON_KEY=your-anon-key\nVITE_CLAUDE_API_KEY=your-claude-key',
  },
  {
    number: 3,
    title: 'Run Database Migrations',
    description: 'Apply the database schema and seed data to your Supabase project.',
    code: 'npx supabase db push',
  },
  {
    number: 4,
    title: 'Start Development Server',
    description: 'Launch the local development server and open VitaScan in your browser.',
    code: 'npm run dev',
  },
]

export default function GettingStarted() {
  const [openStep, setOpenStep] = useState<number | null>(1)

  function toggle(n: number) {
    setOpenStep((prev) => (prev === n ? null : n))
  }

  return (
    <section id="getting-started" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <p className="text-gray-500 text-lg">
            Up and running in minutes. Follow these steps to set up VitaScan locally.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => {
            const isOpen = openStep === step.number
            return (
              <div
                key={step.number}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggle(step.number)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Step number circle */}
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-green-500 text-white font-bold text-sm flex items-center justify-center">
                    {step.number}
                  </span>
                  <span className="flex-1 font-semibold text-gray-900">{step.title}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-500 text-sm mb-3">{step.description}</p>
                    <pre className="bg-gray-900 text-green-300 font-mono text-sm rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all">
                      {step.code}
                    </pre>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
