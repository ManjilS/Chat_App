import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: false,
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  }
})
