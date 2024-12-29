import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/yuanxinggongju/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  },
  server: {
    open: true,
    port: 5173
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 