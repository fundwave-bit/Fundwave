import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  // Client build (frontend React app)
  if (mode === 'client') {
    return {
      plugins: [react()],
      build: {
        outDir: 'dist/client',
        emptyOutDir: true,
        rollupOptions: {
          input: resolve(process.cwd(), 'index.html'),
        },
      },
    }
  }

  // Server build (Hono backend)
  return {
    plugins: [react()],
    build: {
      outDir: 'dist/server',
      emptyOutDir: false, // Don't wipe the client build
      ssr: true,
      rollupOptions: {
        input: resolve(process.cwd(), 'server/index.ts'),
        output: {
          format: 'esm',
          entryFileNames: 'index.js',
        },
        external: [
          // Node built-ins (don't bundle these)
          'node:fs', 'node:fs/promises', 'node:path', 'node:http',
          'node:https', 'node:stream', 'node:util', 'node:url',
          'node:crypto', 'node:events', 'node:buffer', 'node:querystring',
          'node:zlib', 'node:net', 'node:tls', 'node:os',
          'node:child_process', 'node:cluster', 'node:dgram',
          'node:dns', 'node:readline', 'node:perf_hooks',
          'node:async_hooks', 'node:worker_threads',
          // External dependencies (keep as require/import)
          'mysql2', 'drizzle-orm', 'drizzle-kit',
        ],
      },
    },
    resolve: {
      alias: {
        '@': resolve(process.cwd(), 'src'),
      },
    },
  }
})
