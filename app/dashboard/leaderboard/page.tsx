"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Loader } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Mock leaderboard data - in a real app, this would come from an API
interface LeaderboardEntry {
  username: string
  points: number
  rank: number
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo purposes, generating mock data
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        // Generate random users for the leaderboard
        const mockUsers = [
          { username: "cricket_master", points: 1250 },
          { username: "fantasy_king", points: 1180 },
          { username: "team_builder", points: 1120 },
          { username: "cricket_fan", points: 1050 },
          { username: "bowler_lover", points: 980 },
          { username: "batsman_pro", points: 920 },
          { username: "all_rounder", points: 870 },
          { username: "wicket_keeper", points: 820 },
          { username: "cricket_guru", points: 780 },
          { username: "fantasy_expert", points: 750 },
        ]

        // Add current user to the leaderboard if they have a complete team
        if (user && user.team?.length === 11) {
          mockUsers.push({ username: user.username, points: user.teamPoints })
        }

        // Sort by points and assign ranks
        const sortedLeaderboard = mockUsers
          .sort((a, b) => b.points - a.points)
          .map((entry, index) => ({
            ...entry,
            rank: index + 1,
          }))

        setLeaderboard(sortedLeaderboard)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [user])

  // Get medal for top 3 ranks
  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading leaderboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other fantasy cricket managers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fantasy Cricket Rankings</CardTitle>
          <CardDescription>Players ranked by total points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow
                    key={entry.username}
                    className={entry.username === user?.username ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getMedal(entry.rank)}
                        <span className={entry.rank <= 3 ? "ml-2" : ""}>{entry.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {entry.username}
                        {entry.username === user?.username && (
                          <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(You)</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{entry.points}</TableCell>
                  </TableRow>
                ))}

                {/* Show message if user is not on leaderboard */}
                {user && !leaderboard.some((entry) => entry.username === user.username) && (
                  <TableRow className="bg-blue-50 dark:bg-blue-900/20">
                    <TableCell colSpan={3} className="text-center py-4">
                      <p>You need to complete your team (11/11 players) to appear on the leaderboard.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Points Are Calculated</CardTitle>
          <CardDescription>Understanding the scoring system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Player Points Formula</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Player Points = ((Batting Strike Rate / 5) + (Batting Average × 0.8)) + ((500 / Bowling Strike Rate) +
                (140 / Economy Rate))
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium">Batting Component</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Batting Strike Rate = (Total Runs / Total Balls Faced) × 100</li>
                  <li>Batting Average = Total Runs / Innings Played</li>
                </ul>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium">Bowling Component</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Bowling Strike Rate = Total Balls Bowled / Total Wickets Taken</li>
                  <li>Economy Rate = (Total Runs Conceded / Total Balls Bowled) × 6</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Team Points</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your team's total points are the sum of all 11 players' individual points.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

