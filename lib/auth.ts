import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

// Force recompile - v1
const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL
  return 'http://localhost:3000'
}

const baseURL = getBaseURL()

// Build trusted origins - always include baseURL + all environment URLs
// In development/v0 preview, also trust localhost for local testing
const trustedOrigins = new Set<string>([baseURL])
if (process.env.V0_RUNTIME_URL) trustedOrigins.add(process.env.V0_RUNTIME_URL)
if (process.env.VERCEL_URL) trustedOrigins.add(`https://${process.env.VERCEL_URL}`)
if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
  trustedOrigins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
// Always trust localhost for development
trustedOrigins.add('http://localhost:3000')
trustedOrigins.add('https://localhost:3000')

export const auth = betterAuth({
  database: pool,
  baseURL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: Array.from(trustedOrigins),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
