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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Search, Filter, Loader } from "lucide-react"
import { type Player, type PlayerRole, fetchAndParseCSVData } from "@/lib/data"

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [universityFilter, setUniversityFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: "",
    university: "",
    role: "Batsman",
    value: 500000,
    points: 50,
  })
  const [universities, setUniversities] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const { players } = await fetchAndParseCSVData()
        setPlayers(players)

        // Extract unique universities
        const uniqueUniversities = Array.from(new Set(players.map((p) => p.university))).sort()
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

  // Add new player
  const handleAddPlayer = () => {
    const id = (Math.max(...players.map((p) => Number.parseInt(p.id))) + 1).toString()
    const player: Player = {
      id,
      name: newPlayer.name || "",
      university: newPlayer.university || "",
      role: newPlayer.role as PlayerRole,
      image: "/placeholder.svg?height=100&width=100",
      value: newPlayer.value || 500000,
      points: newPlayer.points || 50,
    }

    setPlayers([...players, player])
    setNewPlayer({
      name: "",
      university: "",
      role: "Batsman",
      value: 500000,
      points: 50,
    })
    setIsAddDialogOpen(false)
  }

  // Edit player
  const handleEditPlayer = () => {
    if (!currentPlayer) return

    const updatedPlayers = players.map((player) => (player.id === currentPlayer.id ? currentPlayer : player))

    setPlayers(updatedPlayers)
    setIsEditDialogOpen(false)
  }

  // Delete player
  const handleDeletePlayer = () => {
    if (!currentPlayer) return

    const updatedPlayers = players.filter((player) => player.id !== currentPlayer.id)
    setPlayers(updatedPlayers)
    setIsDeleteDialogOpen(false)
  }

  const roles: PlayerRole[] = ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"]

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">Manage all players in the tournament</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Player
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Players List</CardTitle>
          <CardDescription>View and manage all players in the Spirit11 fantasy cricket league</CardDescription>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentPlayer(player)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentPlayer(player)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
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

      {/* Add Player Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
            <DialogDescription>Enter the details of the new player to add to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="university" className="text-right">
                University
              </Label>
              <Select
                value={newPlayer.university}
                onValueChange={(value) => setNewPlayer({ ...newPlayer, university: value })}
              >
                <SelectTrigger className="col-span-3" id="university">
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newPlayer.role as string}
                onValueChange={(value) => setNewPlayer({ ...newPlayer, role: value as PlayerRole })}
              >
                <SelectTrigger className="col-span-3" id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value (Rs.)
              </Label>
              <Input
                id="value"
                type="number"
                value={newPlayer.value}
                onChange={(e) => setNewPlayer({ ...newPlayer, value: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                value={newPlayer.points}
                onChange={(e) => setNewPlayer({ ...newPlayer, points: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPlayer}>Add Player</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update the details of the selected player.</DialogDescription>
          </DialogHeader>
          {currentPlayer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentPlayer.name}
                  onChange={(e) => setCurrentPlayer({ ...currentPlayer, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-university" className="text-right">
                  University
                </Label>
                <Select
                  value={currentPlayer.university}
                  onValueChange={(value) => setCurrentPlayer({ ...currentPlayer, university: value })}
                >
                  <SelectTrigger className="col-span-3" id="edit-university">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((university) => (
                      <SelectItem key={university} value={university}>
                        {university}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={currentPlayer.role}
                  onValueChange={(value) => setCurrentPlayer({ ...currentPlayer, role: value as PlayerRole })}
                >
                  <SelectTrigger className="col-span-3" id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right">
                  Value (Rs.)
                </Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={currentPlayer.value}
                  onChange={(e) => setCurrentPlayer({ ...currentPlayer, value: Number.parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-points" className="text-right">
                  Points
                </Label>
                <Input
                  id="edit-points"
                  type="number"
                  value={currentPlayer.points}
                  onChange={(e) => setCurrentPlayer({ ...currentPlayer, points: Number.parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPlayer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Player Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Player</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this player? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentPlayer && (
            <div className="py-4">
              <p className="text-center font-medium">{currentPlayer.name}</p>
              <p className="text-center text-sm text-muted-foreground">
                {currentPlayer.university} - {currentPlayer.role}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlayer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

