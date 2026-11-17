
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: { dedupe: ['react', 'react-dom'] },
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ]
})
