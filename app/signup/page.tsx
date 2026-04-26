"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [message, setMessage] = useState("")

  const handleGoogle = async () => {
    try {
      setLoadingGoogle(true)
      setMessage("")

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://careerhelper-two.vercel.app/auth/callback",
        },
      })

      if (error) {
        setMessage(error.message)
        return
      }

      if (data?.url) {
        window.location.href = data.url
      } else {
        setMessage("Google sign-in did not return a redirect URL.")
      }
    } catch (err) {
      setMessage("Something went wrong starting Google sign-in.")
      console.error(err)
    } finally {
      setLoadingGoogle(false)
    }
  }

  const handleEmail = async () => {
    try {
      setLoadingEmail(true)
      setMessage("")

      if (!email || !password) {
        setMessage("Please enter both email and password.")
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://careerhelper-two.vercel.app/auth/callback",
        },
      })

      if (error) {
        setMessage(error.message)
        return
      }

      setMessage("Check your email to continue.")
    } catch (err) {
      setMessage("Something went wrong during sign up.")
      console.error(err)
    } finally {
      setLoadingEmail(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-6 text-2xl font-bold">Create account</h1>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loadingGoogle}
          className="mb-4 w-full rounded-lg bg-white py-2 text-black disabled:opacity-60"
        >
          {loadingGoogle ? "Redirecting..." : "Continue with Google"}
        </button>

        <input
          placeholder="Email"
          className="mb-3 w-full rounded border border-white/10 bg-black/50 px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded border border-white/10 bg-black/50 px-4 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={handleEmail}
          disabled={loadingEmail}
          className="w-full rounded-lg bg-white py-2 text-black disabled:opacity-60"
        >
          {loadingEmail ? "Signing up..." : "Sign up"}
        </button>

        {message ? (
          <p className="mt-4 text-sm text-white/70">{message}</p>
        ) : null}
      </div>
    </main>
  )
}