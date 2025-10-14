// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // loads .env*, incl. .env.development.local

  // Only enable the proxy if you (locally) have a key
  const proxyRoutes = {}
  if (env.OPENROUTER_API_KEY) {
    proxyRoutes['/api/chat'] = {
      target: 'https://openrouter.ai',
      changeOrigin: true,
      rewrite: p => p.replace(/^\/api\/chat/, '/api/v1/chat/completions'),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Authorization', `Bearer ${env.OPENROUTER_API_KEY}`)
          proxyReq.setHeader('HTTP-Referer', 'http://localhost:5173')
          proxyReq.setHeader('X-Title', 'Peddit Dev')
          proxyReq.setHeader('Content-Type', 'application/json')
        })
      },
    }
    console.log('[chat-proxy] enabled')
  } else {
    console.log('[chat-proxy] disabled (no OPENROUTER_API_KEY)')
  }

  return {
    plugins: [
      vue(),
      vueDevTools(), // same as before
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // same as before
      },
    },
    server: { proxy: proxyRoutes },
  }
})
