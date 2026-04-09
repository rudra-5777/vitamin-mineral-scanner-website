import { useState, useRef, useCallback } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as knnClassifier from '@tensorflow-models/knn-classifier'
import * as tf from '@tensorflow/tfjs'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TrainingClass {
  id: string
  label: string
  images: string[]   // data-URLs for preview
  count: number      // number of examples added to KNN
}

interface TestImage {
  id: string
  name: string
  dataUrl: string
  result: { label: string; confidence: number } | null
  status: 'pending' | 'predicting' | 'done' | 'error'
  errorMsg?: string
}

// ---------------------------------------------------------------------------
// Singleton model + classifier (shared across renders, reloaded once)
// ---------------------------------------------------------------------------
let mobileNetModel: mobilenet.MobileNet | null = null
let knn: knnClassifier.KNNClassifier | null = null

async function getModels() {
  if (!mobileNetModel) mobileNetModel = await mobilenet.load({ version: 2, alpha: 1 })
  if (!knn) knn = knnClassifier.create()
  return { mobileNetModel, knn }
}

function uid() {
  return Math.random().toString(36).slice(2)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TrainableClassifier() {
  const [tab, setTab] = useState<'train' | 'test'>('train')

  // --- Training state ---
  const [classes, setClasses] = useState<TrainingClass[]>([
    { id: uid(), label: 'Class 1', images: [], count: 0 },
  ])
  const [newClassName, setNewClassName] = useState('')
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'loading' | 'trained'>('idle')
  const [trainingMsg, setTrainingMsg] = useState('')

  // --- Test state ---
  const [testImages, setTestImages] = useState<TestImage[]>([])
  const [pendingTestName, setPendingTestName] = useState('')
  const testInputRef = useRef<HTMLInputElement>(null)
  const classInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // -------------------------------------------------------------------------
  // Training helpers
  // -------------------------------------------------------------------------
  const addClass = () => {
    const label = newClassName.trim() || `Class ${classes.length + 1}`
    setClasses((prev) => [...prev, { id: uid(), label, images: [], count: 0 }])
    setNewClassName('')
  }

  const removeClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id))
  }

  const updateClassName = (id: string, label: string) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)))
  }

  const addTrainingImages = useCallback(async (classId: string, files: FileList) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!imageFiles.length) return

    setTrainingMsg('Loading AI model…')
    setTrainingStatus('loading')

    let models: { mobileNetModel: mobilenet.MobileNet; knn: knnClassifier.KNNClassifier }
    try {
      models = await getModels()
    } catch {
      setTrainingMsg('Failed to load model. Please try again.')
      setTrainingStatus('idle')
      return
    }

    const { mobileNetModel: net, knn: classifier } = models

    // Find this class label
    const classLabel = classes.find((c) => c.id === classId)?.label ?? classId

    for (const file of imageFiles) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string

          // Create an img element to pass to MobileNet
          const img = new Image()
          img.src = dataUrl
          await new Promise<void>((res) => { img.onload = () => res() })

          try {
            // Get the embedding from MobileNet (no softmax — raw features)
            const activation = net.infer(img, true) as tf.Tensor
            classifier.addExample(activation, classLabel)

            // Add preview and increment count
            setClasses((prev) =>
              prev.map((c) =>
                c.id === classId
                  ? { ...c, images: [...c.images.slice(-3), dataUrl], count: c.count + 1 }
                  : c
              )
            )
          } catch (err) {
            console.error('Failed to add example:', err)
          }

          resolve()
        }
        reader.readAsDataURL(file)
      })
    }

    setTrainingMsg(`✓ Model updated with ${imageFiles.length} new image(s). Add more images or switch to Test tab.`)
    setTrainingStatus('trained')
  }, [classes])

  const handleClassFileChange = useCallback(
    (classId: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        await addTrainingImages(classId, e.target.files)
        e.target.value = ''
      }
    },
    [addTrainingImages]
  )

  // -------------------------------------------------------------------------
  // Test / Prediction helpers
  // -------------------------------------------------------------------------
  const addTestImage = useCallback((file: File, name: string) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const id = uid()
      const displayName = name.trim() || file.name
      setTestImages((prev) => [
        ...prev,
        { id, name: displayName, dataUrl, result: null, status: 'pending' },
      ])
    }
    reader.readAsDataURL(file)
  }, [])

  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addTestImage(file, pendingTestName)
      setPendingTestName('')
      e.target.value = ''
    }
  }

  const predictImage = useCallback(async (testId: string) => {
    const totalExamples = knn?.getNumClasses() ?? 0
    if (totalExamples === 0) {
      setTestImages((prev) =>
        prev.map((t) =>
          t.id === testId
            ? { ...t, status: 'error', errorMsg: 'No trained classes yet. Add training images first.' }
            : t
        )
      )
      return
    }

    setTestImages((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'predicting' } : t))
    )

    try {
      const { mobileNetModel: net, knn: classifier } = await getModels()
      const testEntry = testImages.find((t) => t.id === testId)
      if (!testEntry) return

      const img = new Image()
      img.src = testEntry.dataUrl
      await new Promise<void>((res) => { img.onload = () => res() })

      const activation = net.infer(img, true) as tf.Tensor
      const result = await classifier.predictClass(activation)

      setTestImages((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'done',
                result: {
                  label: result.label,
                  confidence: result.confidences[result.label] ?? 0,
                },
              }
            : t
        )
      )
    } catch (err) {
      console.error(err)
      setTestImages((prev) =>
        prev.map((t) =>
          t.id === testId
            ? { ...t, status: 'error', errorMsg: 'Prediction failed. Please try again.' }
            : t
        )
      )
    }
  }, [testImages])

  const removeTestImage = (id: string) => {
    setTestImages((prev) => prev.filter((t) => t.id !== id))
  }

  const totalTrained = classes.reduce((sum, c) => sum + c.count, 0)

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <section id="trainer" className="py-20 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 mb-4">
            Custom Training
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Train Your Own Classifier</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Add labeled image classes, upload training images, and the model learns — entirely in
            your browser using transfer learning on MobileNetV2. Then test predictions on new images
            with custom names.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setTab('train')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === 'train'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            🏋️ Train Model
            {totalTrained > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                {totalTrained}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('test')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === 'test'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            🔍 Test Predictions
            {testImages.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                {testImages.length}
              </span>
            )}
          </button>
        </div>

        {/* ================================================================
            TRAIN TAB
        ================================================================ */}
        {tab === 'train' && (
          <div className="space-y-6">
            {/* Status banner */}
            {trainingMsg && (
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  trainingStatus === 'trained'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                {trainingStatus === 'loading' && (
                  <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {trainingMsg}
              </div>
            )}

            {/* Class cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="bg-gray-900 rounded-2xl border border-white/5 p-5 flex flex-col gap-4">
                  {/* Class name input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cls.label}
                      onChange={(e) => updateClassName(cls.id, e.target.value)}
                      placeholder="Class name (e.g. Apple)"
                      className="flex-1 bg-white/5 text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
                    />
                    {classes.length > 1 && (
                      <button
                        onClick={() => removeClass(cls.id)}
                        className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center flex-shrink-0 transition-colors"
                        title="Remove class"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Image preview strip */}
                  {cls.images.length > 0 && (
                    <div className="flex gap-1.5">
                      {cls.images.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="w-14 h-14 object-cover rounded-lg border border-white/10"
                        />
                      ))}
                    </div>
                  )}

                  {/* Count badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {cls.count === 0
                        ? 'No images yet'
                        : `${cls.count} training image${cls.count !== 1 ? 's' : ''} added`}
                    </span>
                    {cls.count > 0 && (
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                        ✓ Trained
                      </span>
                    )}
                  </div>

                  {/* Upload button */}
                  <button
                    onClick={() => classInputRefs.current[cls.id]?.click()}
                    className="w-full py-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Add Training Images
                  </button>
                  <input
                    ref={(el) => { classInputRefs.current[cls.id] = el }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleClassFileChange(cls.id)}
                  />
                </div>
              ))}

              {/* Add class card */}
              <div className="bg-gray-900/50 rounded-2xl border border-dashed border-white/10 p-5 flex flex-col gap-3 justify-center items-center min-h-[200px]">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addClass() }}
                  placeholder="New class name…"
                  className="w-full bg-white/5 text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
                />
                <button
                  onClick={addClass}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  + Add Class
                </button>
              </div>
            </div>

            {/* Guide */}
            <div className="bg-gray-900/60 rounded-xl border border-white/5 p-5 text-sm text-gray-400 space-y-1">
              <p className="font-semibold text-gray-300 mb-2">How training works</p>
              <p>1. Create one class per category (e.g. "Apple", "Banana", "Orange").</p>
              <p>2. Upload <strong className="text-gray-300">at least 5–10 images</strong> per class for reliable results.</p>
              <p>3. Images are processed instantly — MobileNet extracts features, which are stored in a KNN classifier.</p>
              <p>4. Switch to the <strong className="text-gray-300">Test Predictions</strong> tab to classify new images.</p>
              <p className="pt-1 text-gray-600 text-xs">All processing is done locally in your browser. No data is uploaded to any server.</p>
            </div>
          </div>
        )}

        {/* ================================================================
            TEST TAB
        ================================================================ */}
        {tab === 'test' && (
          <div className="space-y-6">
            {/* Trained classes summary */}
            {totalTrained > 0 ? (
              <div className="flex flex-wrap gap-2">
                {classes.filter((c) => c.count > 0).map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                  >
                    {c.label} — {c.count} examples
                  </span>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-sm text-yellow-400">
                ⚠ No trained classes yet. Go to the <strong>Train Model</strong> tab and add images first.
              </div>
            )}

            {/* Add test image */}
            <div className="bg-gray-900 rounded-2xl border border-white/5 p-5">
              <p className="text-sm font-semibold text-gray-300 mb-3">Add a test image</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={pendingTestName}
                  onChange={(e) => setPendingTestName(e.target.value)}
                  placeholder="Image name / label (optional)"
                  className="flex-1 bg-white/5 text-white text-sm rounded-lg px-3 py-2.5 border border-white/10 focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
                />
                <button
                  onClick={() => testInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Choose Image
                </button>
                <input
                  ref={testInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTestFileChange}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Give the image a name, then click "Choose Image". You can add as many test images as you like.
              </p>
            </div>

            {/* Test image grid */}
            {testImages.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testImages.map((t) => (
                  <div key={t.id} className="bg-gray-900 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                    {/* Image */}
                    <div className="relative h-44">
                      <img src={t.dataUrl} alt={t.name} className="w-full h-full object-cover" />
                      {t.status === 'predicting' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border-4 border-blue-400 border-t-transparent animate-spin" />
                        </div>
                      )}
                      <button
                        onClick={() => removeTestImage(t.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {/* Name */}
                      <p className="text-sm font-semibold text-gray-200 truncate" title={t.name}>
                        {t.name}
                      </p>

                      {/* Result */}
                      {t.status === 'done' && t.result && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Predicted:</span>
                            <span className="text-blue-300 font-semibold">{t.result.label}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-400 rounded-full transition-all duration-700"
                              style={{ width: `${(t.result.confidence * 100).toFixed(0)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-right">
                            {(t.result.confidence * 100).toFixed(1)}% confidence
                          </p>
                        </div>
                      )}

                      {t.status === 'error' && (
                        <p className="text-xs text-red-400">{t.errorMsg}</p>
                      )}

                      {/* Predict button */}
                      {(t.status === 'pending' || t.status === 'done' || t.status === 'error') && (
                        <button
                          onClick={() => predictImage(t.id)}
                          disabled={totalTrained === 0}
                          className="mt-auto w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {t.status === 'done' ? '↺ Re-predict' : '▶ Predict'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-600">
                <p className="text-4xl mb-3">🖼️</p>
                <p className="text-sm">No test images yet. Add one above.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
