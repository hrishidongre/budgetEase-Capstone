"use client"

import React, { useRef, useState, useEffect } from "react"
import { authService } from "../../api/authService"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await authService.verifyToken()
        if (user) router.push("/dashboard")
      } catch (err) {}
    }
    checkUser()
  }, [router])

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setEmailError("")
    setLoading(true)

    const email = emailRef.current.value
    const password = passwordRef.current.value

    // Email validation
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const response = await authService.login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EFFFFE] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-100">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-1">
          Welcome 
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your credentials to access your account
        </p>

        {/* General error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Email</label>
            <div
              className={`flex items-center border rounded-md px-3 py-2 bg-gray-50 ${
                emailError ? "border-red-400" : "border-gray-300"
              }`}
            >
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                ref={emailRef}
                placeholder="Enter your email"
                className="w-full text-sm bg-transparent outline-none"
                onBlur={(e) => {
                  if (!validateEmail(e.target.value)) setEmailError("Enter a valid email address")
                  else setEmailError("")
                }}
              />
            </div>
            {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                placeholder="Enter your password"
                className="w-full text-sm bg-transparent outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

           {/* Forgot Password Link */}
          <div className="flex justify-end -mt-2">
            <Link href="/forgot-password" className="text-sm text-[#0D9488] hover:underline">
              Forgot Password?
            </Link>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="bg-[#0D9488] text-white py-2 rounded-md font-semibold 
                     hover:bg-[#0b7d73] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-[#0D9488] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
