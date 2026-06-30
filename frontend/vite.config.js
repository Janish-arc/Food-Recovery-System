import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://food-recovery-system-backend.onrender.com/",
        changeOrigin: true,
      },
    },
  },
})
