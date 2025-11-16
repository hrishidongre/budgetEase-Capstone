"use client"

import React, { useState, useRef } from "react"
import { Mail } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function ForgotPassword() {
  const emailRef = useRef(null)
  const [emailError, setEmailError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError("")
    setSuccess("")
    setLoading(true)

    const email = emailRef.current.value

    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address")
      setLoading(false)
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email })
      setSuccess("A reset link has been sent to your email")
    } catch (err) {
      setEmailError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EFFFFE] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-100">

        <h1 className="text-3xl font-bold text-center mb-1">
          Forgot <span className="text-[#0D9488]">Password?</span>
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your email to reset your password
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
            {success}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Email</label>
            <div className={`flex items-center border rounded-md px-3 py-2 bg-gray-50 ${
                emailError ? "border-red-400" : "border-gray-300"
              }`}>
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input
                ref={emailRef}
                type="text"
                placeholder="Enter your email"
                className="w-full text-sm bg-transparent outline-none"
              />
            </div>
            {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
          </div>

          <button
            disabled={loading}
            className="bg-[#0D9488] text-white py-2 rounded-md font-semibold 
                     hover:bg-[#0b7d73] transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password?{" "}
          <Link href="/login" className="text-[#0D9488] hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}
