"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, Info, Loader } from "lucide-react"
import { type Player, type PlayerStats, fetchAndParseCSVData } from "@/lib/data"

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [universityFilter, setUniversityFilter] = useState<string>("all")
  const [isPlayerDetailsOpen, setIsPlayerDetailsOpen] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [currentStats, setCurrentStats] = useState<PlayerStats | null>(null)
  const [universities, setUniversities] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchAndParseCSVData()
        setPlayers(data.players)
        setPlayerStats(data.playerStats)

        // Extract unique universities
        const uniqueUniversities = Array.from(new Set(data.players.map((p) => p.university))).sort()
        setUniversities(uniqueUniversities)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter players based on search term and filters
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || player.role === roleFilter
    const matchesUniversity = universityFilter === "all" || player.university === universityFilter
    return matchesSearch && matchesRole && matchesUniversity
  })

  // View player details
  const handleViewPlayerDetails = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    const stats = playerStats.find((s) => s.playerId === playerId)

    if (player && stats) {
      setCurrentPlayer(player)
      setCurrentStats(stats)
      setIsPlayerDetailsOpen(true)
    }
  }

  const roles = ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"]

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
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
        <p className="text-muted-foreground">Browse all players in the tournament</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Players List</CardTitle>
          <CardDescription>View detailed information about each player</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No players found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.university}</TableCell>
                      <TableCell>{player.role}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewPlayerDetails(player.id)}>
                          <Info className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Player Details Dialog */}
      <Dialog open={isPlayerDetailsOpen} onOpenChange={setIsPlayerDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Player Details</DialogTitle>
            <DialogDescription>Detailed information about {currentPlayer?.name}</DialogDescription>
          </DialogHeader>
          {currentPlayer && currentStats && (
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
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPlayerDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

