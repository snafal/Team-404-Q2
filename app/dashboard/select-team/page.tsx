"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Loader, AlertCircle } from "lucide-react"
import { type Player, fetchAndParseCSVData } from "@/lib/data"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SelectTeamPage() {
  const { user, updateUser } = useAuth()
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Batsman")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchAndParseCSVData()
        setPlayers(data.players)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter players based on search term and selected category
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = player.role === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Check if player is already in team
  const isPlayerInTeam = (playerId: string) => {
    return user?.team?.some((player) => player.id === playerId) || false
  }

  // Add player to team
  const addPlayerToTeam = (player: Player) => {
    setError("")
    setSuccessMessage("")

    // Check if player is already in team
    if (isPlayerInTeam(player.id)) {
      setError(`${player.name} is already in your team`)
      return
    }

    // Check if team is already full
    if (user?.team?.length === 11) {
      setError("Your team is already full (11/11 players)")
      return
    }

    // Check if user has enough budget
    if ((user?.budget || 0) < player.value) {
      setError(`Not enough budget to add ${player.name}`)
      return
    }

    // Add player to team and update budget
    const updatedTeam = [...(user?.team || []), player]
    const updatedBudget = (user?.budget || 0) - player.value

    updateUser({
      team: updatedTeam,
      budget: updatedBudget,
    })

    setSuccessMessage(`${player.name} added to your team`)

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const categories = ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"]

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
        <h1 className="text-3xl font-bold tracking-tight">Select Your Team</h1>
        <p className="text-muted-foreground">Choose players by category to build your fantasy team</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Players</CardTitle>
          <CardDescription>
            Select players to add to your team (Budget: Rs. {user?.budget?.toLocaleString() || 0})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Batsman" onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="mb-4 flex items-center">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={`Search ${category}s...`}
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
                        <TableHead className="text-right">Value (Rs.)</TableHead>
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
                            <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant={isPlayerInTeam(player.id) ? "outline" : "default"}
                                size="sm"
                                onClick={() => addPlayerToTeam(player)}
                                disabled={isPlayerInTeam(player.id) || (user?.budget || 0) < player.value}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                {isPlayerInTeam(player.id) ? "In Team" : "Add"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

