"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://careerhelper-two.vercel.app/auth/callback",
      },
    })

    if (data?.url) window.location.href = data.url
  }

  const handleEmail = async () => {
    setLoading(true)

    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    })

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl">
        <h1 className="text-2xl font-bold mb-6">Create account</h1>

        <button
          onClick={handleGoogle}
          className="w-full bg-white text-black py-2 rounded-lg mb-4"
        >
          Continue with Google
        </button>

        <input
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 bg-black/50 border border-white/10 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 bg-black/50 border border-white/10 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleEmail}
          className="w-full bg-white text-black py-2 rounded-lg"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
      </div>
    </main>
  )
}