"use client"

import React, { useRef, useState, Suspense } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const passRef = useRef(null)
  const confirmRef = useRef(null)

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const password = passRef.current.value
    const confirm = confirmRef.current.value

    if (password !== confirm) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        token,
        newPassword: password,
      })

      setSuccess("Password updated! Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EFFFFE] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-100">

        <h1 className="text-3xl font-bold text-center mb-2">
          Reset <span className="text-[#0D9488]">Password</span>
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
            {success}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* New password */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">New Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type={show ? "text" : "password"}
                ref={passRef}
                placeholder="Enter your new password"
                className="w-full text-sm bg-transparent outline-none"
              />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type={showConfirm ? "text" : "password"}
                ref={confirmRef}
                placeholder="Confirm password"
                className="w-full text-sm bg-transparent outline-none"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="bg-[#0D9488] text-white py-2 rounded-md font-semibold 
                       hover:bg-[#0b7d73] transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
