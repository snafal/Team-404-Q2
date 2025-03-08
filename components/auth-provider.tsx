"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  username: string
  isAuthenticated: boolean
  budget: number
  team: any[]
  teamPoints: number
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const defaultUser: User = {
  username: "",
  isAuthenticated: false,
  budget: 9000000,
  team: [],
  teamPoints: 0,
}

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
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
      } else if (user?.isAuthenticated && isAuthRoute) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, pathname, router])

  const login = async (username: string, password: string) => {
    // In a real app, this would validate credentials with an API
    const newUser: User = {
      username,
      isAuthenticated: true,
      budget: 9000000,
      team: [],
      teamPoints: 0,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    router.push("/dashboard")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{!loading && children}</AuthContext.Provider>
}

