'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// Set axios defaults for all requests
axios.defaults.withCredentials = true

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        })
        if (response.data) {
          setUser(response.data)
        } else {
          setUser(null)
        }
      } catch (err) {
        // Only treat 401 as authentication failure
        // Ignore other errors (404, 500, etc.) during auth check
        if (err.response?.status === 401) {
          // Not authenticated - this is expected
          setUser(null)
        } else if (err.response?.status && err.response.status !== 404) {
          // Log other errors (except 404 which is unrelated)
          console.error('Auth check error:', err.message)
          setUser(null)
        } else if (!err.response) {
          // Network error
          console.error('Auth check error:', err.message)
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const setUserData = (userData) => {
    if (userData && typeof userData === 'object') {
      setUser(userData)
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
