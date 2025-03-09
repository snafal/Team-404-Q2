"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" 
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user")
    if (user && JSON.parse(user).isAuthenticated) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-5 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Spirit11 Fantasy Cricket
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Create your dream team for the Inter-University Cricket Tournament and compete with other fantasy
                    managers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button onClick={() => router.push("/auth/login")}>
                    Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/auth/signup")}>
                    Sign Up
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/backgroundImag.png"
                  alt="Spirit11 Fantasy Cricket"
                  width={550}
                  height={410}
                  className="aspect-[4/5] overflow-hidden rounded-xl object-fill object-center"
                  priority // Add priority to load the image faster
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

