import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    https: {
      key: path.resolve(__dirname, '.certs/key.pem'),
      cert: path.resolve(__dirname, '.certs/cert.pem'),
    },
  },
})