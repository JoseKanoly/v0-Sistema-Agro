import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL
  return 'http://localhost:3000'
}

const baseURL = getBaseURL()

const trustedOrigins: string[] = []
if (process.env.V0_RUNTIME_URL) trustedOrigins.push(process.env.V0_RUNTIME_URL)
if (process.env.VERCEL_URL) trustedOrigins.push(`https://${process.env.VERCEL_URL}`)
if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
  trustedOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
// Always trust the base URL itself
if (baseURL && !trustedOrigins.includes(baseURL)) trustedOrigins.push(baseURL)

export const auth = betterAuth({
  database: pool,
  baseURL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none' as const,
      secure: true,
    },
  },
})
