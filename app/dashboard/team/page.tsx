"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TeamPage() {
  const { user, updateUser } = useAuth()
  const [successMessage, setSuccessMessage] = useState("")
  const [teamPoints, setTeamPoints] = useState(0)

  useEffect(() => {
    // Calculate team points if team is complete
    if (user?.team?.length === 11) {
      const points = user.team.reduce((total, player) => total + player.points, 0)
      setTeamPoints(points)

      // Only update if the points have changed
      if (user.teamPoints !== points) {
        updateUser({ teamPoints: points })
      }
    } else {
      setTeamPoints(0)

      // Only update if teamPoints is not already 0
      if (user?.teamPoints !== 0) {
        updateUser({ teamPoints: 0 })
      }
    }
  }, [user?.team, user?.teamPoints, updateUser])

  // Remove player from team
  const removePlayerFromTeam = (playerId: string) => {
    const player = user?.team?.find((p) => p.id === playerId)

    if (player && user) {
      // Remove player from team
      const updatedTeam = user.team.filter((p) => p.id !== playerId)

      // Refund player value to budget
      const updatedBudget = user.budget + player.value

      // Update user
      updateUser({
        team: updatedTeam,
        budget: updatedBudget,
      })

      setSuccessMessage(`${player.name} removed from your team`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }
  }

  // Group players by role
  const batsmen = user?.team?.filter((player) => player.role === "Batsman") || []
  const bowlers = user?.team?.filter((player) => player.role === "Bowler") || []
  const allRounders = user?.team?.filter((player) => player.role === "All-Rounder") || []
  const wicketKeepers = user?.team?.filter((player) => player.role === "Wicket Keeper") || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Team</h1>
        <p className="text-muted-foreground">View and manage your selected fantasy team</p>
      </div>

      {successMessage && (
        <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Team Status: {user?.team?.length || 0}/11 Players</h2>
          {user?.team?.length === 11 && (
            <p className="text-green-600 dark:text-green-400">Team Complete! Total Points: {teamPoints}</p>
          )}
        </div>
        <div>
          <p className="text-sm">Remaining Budget: Rs. {user?.budget?.toLocaleString() || 0}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Selected Players</CardTitle>
          <CardDescription>Your fantasy cricket team roster</CardDescription>
        </CardHeader>
        <CardContent>
          {user?.team?.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You haven't selected any players yet. Go to the "Select Team" tab to build your team.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {/* Batsmen */}
              <div>
                <h3 className="mb-2 text-lg font-medium">Batsmen ({batsmen.length})</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead className="text-right">Value (Rs.)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batsmen.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-12 text-center">
                            No batsmen selected
                          </TableCell>
                        </TableRow>
                      ) : (
                        batsmen.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.university}</TableCell>
                            <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => removePlayerFromTeam(player.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Bowlers */}
              <div>
                <h3 className="mb-2 text-lg font-medium">Bowlers ({bowlers.length})</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead className="text-right">Value (Rs.)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bowlers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-12 text-center">
                            No bowlers selected
                          </TableCell>
                        </TableRow>
                      ) : (
                        bowlers.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.university}</TableCell>
                            <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => removePlayerFromTeam(player.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* All-Rounders */}
              <div>
                <h3 className="mb-2 text-lg font-medium">All-Rounders ({allRounders.length})</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead className="text-right">Value (Rs.)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allRounders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-12 text-center">
                            No all-rounders selected
                          </TableCell>
                        </TableRow>
                      ) : (
                        allRounders.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.university}</TableCell>
                            <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => removePlayerFromTeam(player.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Wicket Keepers */}
              <div>
                <h3 className="mb-2 text-lg font-medium">Wicket Keepers ({wicketKeepers.length})</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead className="text-right">Value (Rs.)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wicketKeepers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-12 text-center">
                            No wicket keepers selected
                          </TableCell>
                        </TableRow>
                      ) : (
                        wicketKeepers.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.university}</TableCell>
                            <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => removePlayerFromTeam(player.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

