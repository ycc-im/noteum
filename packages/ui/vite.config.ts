import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'NoteumUI',
      fileName: (format) => `noteum-ui.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'reactflow'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'reactflow': 'ReactFlow'
        }
      }
    }
  }
})