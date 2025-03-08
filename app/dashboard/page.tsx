"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, UserCheck, DollarSign, Trophy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { fetchAndParseCSVData } from "@/lib/data"

export default function Dashboard() {
  const { user } = useAuth()
  const [playerCount, setPlayerCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { players } = await fetchAndParseCSVData()
        setPlayerCount(players.length)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const cards = [
    {
      title: "Players",
      description: "Browse all players in the tournament",
      icon: <Users className="h-8 w-8" />,
      href: "/dashboard/players",
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Select Team",
      description: "Choose players for your fantasy team",
      icon: <UserPlus className="h-8 w-8" />,
      href: "/dashboard/select-team",
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
    },
    {
      title: "My Team",
      description: "View your selected fantasy team",
      icon: <UserCheck className="h-8 w-8" />,
      href: "/dashboard/team",
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
    },
    {
      title: "Budget",
      description: "Track your remaining budget",
      icon: <DollarSign className="h-8 w-8" />,
      href: "/dashboard/budget",
      color: "bg-amber-100 dark:bg-amber-900",
      textColor: "text-amber-600 dark:text-amber-300",
    },
    {
      title: "Leaderboard",
      description: "See how you rank against other players",
      icon: <Trophy className="h-8 w-8" />,
      href: "/dashboard/leaderboard",
      color: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-600 dark:text-red-300",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.username}</h1>
        <p className="text-muted-foreground">Manage your Spirit11 fantasy cricket team</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="h-full cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">{card.title}</CardTitle>
                <div className={`rounded-full p-2 ${card.color}`}>
                  <div className={card.textColor}>{card.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{card.description}</CardDescription>
                {card.title === "Players" && !isLoading && (
                  <p className="mt-2 text-sm font-medium">{playerCount} players available</p>
                )}
                {card.title === "My Team" && (
                  <p className="mt-2 text-sm font-medium">{user?.team?.length || 0}/11 players selected</p>
                )}
                {card.title === "Budget" && (
                  <p className="mt-2 text-sm font-medium">
                    Rs. {user?.budget?.toLocaleString() || "9,000,000"} available
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get started with managing your Spirit11 fantasy cricket team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-medium">1. Browse Players</h3>
              <p className="text-sm text-muted-foreground">View all available players and their detailed statistics.</p>
              <Button variant="link" className="mt-2 px-0" asChild>
                <Link href="/dashboard/players">Browse Players</Link>
              </Button>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-medium">2. Select Your Team</h3>
              <p className="text-sm text-muted-foreground">
                Choose players by category to build your fantasy team within your budget.
              </p>
              <Button variant="link" className="mt-2 px-0" asChild>
                <Link href="/dashboard/select-team">Select Team</Link>
              </Button>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-medium">3. Check the Leaderboard</h3>
              <p className="text-sm text-muted-foreground">See how your team ranks against other fantasy managers.</p>
              <Button variant="link" className="mt-2 px-0" asChild>
                <Link href="/dashboard/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

