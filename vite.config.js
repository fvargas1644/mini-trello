import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Necesario para pruebas de componentes React
    setupFiles: './setupTests.js', // Opcional para configurar testing library
  },
});