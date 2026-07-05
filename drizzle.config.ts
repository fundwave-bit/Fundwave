import { defineConfig } from 'drizzle-kit'
import { config as dotenv } from 'dotenv'

dotenv()

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL || '',
  },
})
