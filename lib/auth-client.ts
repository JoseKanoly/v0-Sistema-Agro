'use client'

import { createAuthClient } from 'better-auth/react'

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // In the browser, always call the API on the same origin the page is served from
    return window.location.origin
  }
  // Server-side fallback (used during SSR)
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL
  return 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

export const { signIn, signUp, signOut, useSession } = authClient
