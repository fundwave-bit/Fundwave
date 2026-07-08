import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Import your tRPC router here when ready
// import { appRouter } from './trpc/router'
// import { trpcServer } from '@trpc/server/adapters/hono'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.onrender.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))

// Health check (Render uses this to know your app is alive)
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API routes
app.get('/api/hello', (c) => c.json({ message: 'Hello from FundWave API!' }))

// tRPC setup (uncomment when ready)
// app.use('/trpc/*', trpcServer({ router: appRouter }))

// Serve static files from the Vite build output
app.use('/*', serveStatic({ root: './dist/client' }))

// Fallback: serve index.html for SPA routes (React Router)
app.get('/*', async (c) => {
  try {
    const html = await readFile(join(process.cwd(), 'dist/client/index.html'), 'utf-8')
    return c.html(html)
  } catch {
    return c.text('Build not found. Run npm run build first.', 500)
  }
})

// Render sets PORT automatically — NEVER hardcode it
const port = Number(process.env.PORT) || 3000

console.log(`🚀 FundWave server starting on port ${port}...`)

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`✅ Server running at http://localhost:${info.port}`)
})

// Graceful shutdown for Render
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  process.exit(0)
})
