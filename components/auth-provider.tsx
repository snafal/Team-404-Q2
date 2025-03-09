"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  username: string
  budget: number
  team: any[]
  teamPoints: number
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!loading) {
      const isAuthRoute = pathname?.startsWith("/auth") || pathname === "/"

      if (!user && !isAuthRoute) {
        router.push("/auth/login")
      } else if (user?.id && isAuthRoute) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, pathname, router])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Login failed")
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Signup failed")
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const updateUser = async (userData: Partial<User>) => {
    if (user?.id) {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Update failed")
        }

        const data = await response.json()
        const updatedUser = data.user
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } catch (error) {
        console.error("Update user error:", error)
        throw error
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

