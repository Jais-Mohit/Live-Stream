import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Yeh line "global" variable ko browser ke "window" se replace kar degi
    global: 'window', 
  },
})