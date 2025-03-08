"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Eye, Save, Loader } from "lucide-react"
import {
  type Player,
  type PlayerStats,
  calculatePlayerPoints,
  calculatePlayerValue,
  calculateBattingStrikeRate,
  calculateBattingAverage,
  calculateBowlingStrikeRate,
  calculateBowlingEconomy,
  oversToBalls,
  fetchAndParseCSVData,
} from "@/lib/data"

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentStats, setCurrentStats] = useState<PlayerStats | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchAndParseCSVData()
        setPlayers(data.players)
        setPlayerStats(data.playerStats)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter players based on search term
  const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // View player stats
  const handleViewStats = (playerId: string) => {
    const stats = playerStats.find((stat) => stat.playerId === playerId)
    const player = players.find((p) => p.id === playerId)

    if (stats && player) {
      setCurrentStats(stats)
      setCurrentPlayer(player)
      setIsViewDialogOpen(true)
    }
  }

  // Edit player stats
  const handleEditStats = (playerId: string) => {
    const stats = playerStats.find((stat) => stat.playerId === playerId)
    const player = players.find((p) => p.id === playerId)

    if (stats && player) {
      setCurrentStats({ ...stats })
      setCurrentPlayer(player)
      setIsEditDialogOpen(true)
    }
  }

  // Save edited stats
  const handleSaveStats = () => {
    if (!currentStats || !currentPlayer) return

    // Recalculate derived stats
    const ballsBowled = oversToBalls(currentStats.oversBowled)

    const updatedStats: PlayerStats = {
      ...currentStats,
      battingStrikeRate: calculateBattingStrikeRate(currentStats.runs, currentStats.ballsFaced),
      battingAverage: calculateBattingAverage(currentStats.runs, currentStats.inningsPlayed),
      bowlingStrikeRate: calculateBowlingStrikeRate(ballsBowled, currentStats.wickets),
      bowlingEconomy: calculateBowlingEconomy(currentStats.runsConceded, ballsBowled),
    }

    // Update player stats
    const updatedPlayerStats = playerStats.map((stats) =>
      stats.playerId === updatedStats.playerId ? updatedStats : stats,
    )

    // Recalculate player points
    const newPoints = calculatePlayerPoints(updatedStats)

    // Recalculate player value
    const newValue = calculatePlayerValue(newPoints)

    // Update player with new value and points
    const updatedPlayers = players.map((player) =>
      player.id === currentPlayer.id ? { ...player, value: newValue, points: newPoints } : player,
    )

    // Update state
    setPlayerStats(updatedPlayerStats)
    setPlayers(updatedPlayers)
    setIsEditDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading player data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Player Statistics</h1>
        <p className="text-muted-foreground">View and update detailed statistics for each player</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Stats</CardTitle>
          <CardDescription>Select a player to view or update their statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search players..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Value (Rs.)</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No players found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.university}</TableCell>
                      <TableCell>{player.role}</TableCell>
                      <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{player.points}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewStats(player.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditStats(player.id)}>
                            <Save className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Stats Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Player Statistics</DialogTitle>
            <DialogDescription>Detailed statistics for {currentPlayer?.name}</DialogDescription>
          </DialogHeader>
          {currentStats && currentPlayer && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{currentPlayer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPlayer.university} - {currentPlayer.role}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Value: Rs. {currentPlayer.value.toLocaleString()}</p>
                  <p className="text-sm font-medium">Points: {currentPlayer.points}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Batting Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Matches</dt>
                        <dd className="font-medium">{currentStats.matches}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Runs</dt>
                        <dd className="font-medium">{currentStats.runs}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Balls Faced</dt>
                        <dd className="font-medium">{currentStats.ballsFaced}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Innings Played</dt>
                        <dd className="font-medium">{currentStats.inningsPlayed}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Strike Rate</dt>
                        <dd className="font-medium">{currentStats.battingStrikeRate.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Average</dt>
                        <dd className="font-medium">{currentStats.battingAverage.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Bowling Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Wickets</dt>
                        <dd className="font-medium">{currentStats.wickets}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Overs Bowled</dt>
                        <dd className="font-medium">{currentStats.oversBowled}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Runs Conceded</dt>
                        <dd className="font-medium">{currentStats.runsConceded}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Economy Rate</dt>
                        <dd className="font-medium">{currentStats.bowlingEconomy.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Bowling Strike Rate</dt>
                        <dd className="font-medium">
                          {currentStats.bowlingStrikeRate === 999 ? "-" : currentStats.bowlingStrikeRate.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Points Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Batting Component</dt>
                      <dd className="font-medium">
                        (Batting SR / 5) + (Batting Avg × 0.8) =
                        {(currentStats.battingStrikeRate / 5 + currentStats.battingAverage * 0.8).toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Bowling Component</dt>
                      <dd className="font-medium">
                        (500 / Bowling SR) + (140 / Economy) =
                        {currentStats.wickets > 0
                          ? (500 / currentStats.bowlingStrikeRate + 140 / currentStats.bowlingEconomy).toFixed(2)
                          : "0.00"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Total Points</dt>
                      <dd className="font-medium">{currentPlayer.points}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Value Calculation</dt>
                      <dd className="font-medium">
                        (9 × {currentPlayer.points} + 100) × 1000 = Rs. {currentPlayer.value.toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Stats Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Player Statistics</DialogTitle>
            <DialogDescription>Update statistics for {currentPlayer?.name}</DialogDescription>
          </DialogHeader>
          {currentStats && currentPlayer && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{currentPlayer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPlayer.university} - {currentPlayer.role}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="mb-3 font-medium">Batting Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="runs">Total Runs</Label>
                      <Input
                        id="runs"
                        type="number"
                        value={currentStats.runs}
                        onChange={(e) =>
                          setCurrentStats({
                            ...currentStats,
                            runs: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ballsFaced">Balls Faced</Label>
                      <Input
                        id="ballsFaced"
                        type="number"
                        value={currentStats.ballsFaced}
                        onChange={(e) =>
                          setCurrentStats({
                            ...currentStats,
                            ballsFaced: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inningsPlayed">Innings Played</Label>
                      <Input
                        id="inningsPlayed"
                        type="number"
                        value={currentStats.inningsPlayed}
                        onChange={(e) =>
                          setCurrentStats({
                            ...currentStats,
                            inningsPlayed: Number.parseInt(e.target.value) || 0,
                            matches: Number.parseInt(e.target.value) || 0, // Update matches to match innings
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Bowling Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wickets">Wickets</Label>
                      <Input
                        id="wickets"
                        type="number"
                        value={currentStats.wickets}
                        onChange={(e) =>
                          setCurrentStats({
                            ...currentStats,
                            wickets: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oversBowled">Overs Bowled</Label>
                      <Input
                        id="oversBowled"
                        type="number"
                        step="0.1"
                        value={currentStats.oversBowled}
                        onChange={(e) =>
                          setCurrentStats({
                            ...currentStats,
                            oversBowled: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="runsConceded">Runs Conceded</Label>
                      <Input
                        id="runsConceded"
                        type="number"
                        value={currentStats.runsConceded}
                        onChange={(e) =>
                          setCurrentStats({
                            ...currentStats,
                            runsConceded: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStats}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

