"use client"
import { LogOut, House } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function dHeader() {
  const { user, logout } = useAuth()
  const [date, setDate] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const today = new Date()
    const formatted = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    setDate(formatted)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <header className="w-full bg-slate-100 shadow px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
      {/* Logo */}
      <div className="flex justify-center sm:justify-start">
        <img
          src="logo/BudgetEase logo.svg"
          alt="BudgetEase Logo"
          className="w-[120px] sm:w-[140px] md:w-[160px]"
        />
      </div>

      {/* Welcome and Date */}
      {mounted && (
        <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left gap-1 sm:gap-4">
          <p className="text-sm sm:text-md font-medium">
            Welcome, {user?.user_metadata?.full_name || 'User'}
          </p>
          <span className="text-xs sm:text-sm text-gray-600">{date}</span>
        </div>
      )}

      {/* Action Icons */}
      <div className="flex justify-center sm:justify-end items-center gap-6 sm:gap-4">
        <div className="relative group cursor-pointer" onClick={handleHome}>
          <House className="w-5 h-5 sm:w-4 sm:h-4 hover:text-blue-500 transition-colors" />
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 text-[10px] whitespace-nowrap rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            Home
          </span>
        </div>

        <div className="relative group cursor-pointer" onClick={handleLogout}>
          <LogOut className="w-5 h-5 sm:w-4 sm:h-4 hover:text-red-500 transition-colors" />
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 text-[10px] whitespace-nowrap rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            Log out
          </span>
        </div>
      </div>
    </header>
  )
}
