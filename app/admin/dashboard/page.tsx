"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BarChart3, Trophy, Loader } from "lucide-react"
import Link from "next/link"
import { fetchAndParseCSVData } from "@/lib/data"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [playerCount, setPlayerCount] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
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
      description: "Manage all players in the tournament",
      icon: <Users className="h-8 w-8" />,
      href: "/admin/dashboard/players",
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Player Stats",
      description: "View detailed statistics for each player",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/admin/dashboard/player-stats",
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
    },
    {
      title: "Tournament Summary",
      description: "Overall analysis of the tournament",
      icon: <Trophy className="h-8 w-8" />,
      href: "/admin/dashboard/tournament-summary",
      color: "bg-amber-100 dark:bg-amber-900",
      textColor: "text-amber-600 dark:text-amber-300",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Spirit11 Fantasy Cricket Admin Panel</p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading player data...</span>
        </div>
      ) : (
        <>
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
                    {card.title === "Players" && (
                      <p className="mt-2 text-sm font-medium">{playerCount} players loaded from dataset</p>
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
                <CardDescription>Get started with managing the Spirit11 fantasy cricket league</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">1. Manage Players</h3>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, or remove players from the tournament. Update their details and team affiliations.
                  </p>
                  <Button variant="link" className="mt-2 px-0" asChild>
                    <Link href="/admin/dashboard/players">Go to Players</Link>
                  </Button>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">2. Update Player Statistics</h3>
                  <p className="text-sm text-muted-foreground">
                    View and update detailed statistics for each player, including runs, wickets, and other performance
                    metrics.
                  </p>
                  <Button variant="link" className="mt-2 px-0" asChild>
                    <Link href="/admin/dashboard/player-stats">Go to Player Stats</Link>
                  </Button>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">3. Monitor Tournament Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Get an overview of the tournament with key statistics and performance indicators.
                  </p>
                  <Button variant="link" className="mt-2 px-0" asChild>
                    <Link href="/admin/dashboard/tournament-summary">Go to Tournament Summary</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

