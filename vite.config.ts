import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vitamin-mineral-scanner-website/',
  build: {
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        manualChunks: {
          'tf-core': ['@tensorflow/tfjs'],
          'mobilenet': ['@tensorflow-models/mobilenet'],
          'knn-classifier': ['@tensorflow-models/knn-classifier'],
        },
      },
    },
  },
})
