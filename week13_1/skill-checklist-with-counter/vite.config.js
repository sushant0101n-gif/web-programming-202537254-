import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/web-programming-202537254-/week13_1/skill-checklist-with-counter/dist/',
})