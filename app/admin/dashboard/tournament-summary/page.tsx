"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Loader } from "lucide-react"
import { fetchAndParseCSVData } from "@/lib/data"

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#8DD1E1"]

export default function TournamentSummaryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [players, setPlayers] = useState<any[]>([])
  const [playerStats, setPlayerStats] = useState<any[]>([])
  const [summary, setSummary] = useState({
    totalRuns: 0,
    totalWickets: 0,
    highestRunScorer: {
      id: "",
      name: "",
      university: "",
      role: "",
      value: 0,
      points: 0,
      runs: 0,
    },
    highestWicketTaker: {
      id: "",
      name: "",
      university: "",
      role: "",
      value: 0,
      points: 0,
      wickets: 0,
    },
  })

  // Prepare data for charts
  const [roleDistribution, setRoleDistribution] = useState<any[]>([])
  const [universityPerformance, setUniversityPerformance] = useState<any[]>([])
  const [topRunScorers, setTopRunScorers] = useState<any[]>([])
  const [topWicketTakers, setTopWicketTakers] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchAndParseCSVData()
        setPlayers(data.players)
        setPlayerStats(data.playerStats)

        // Calculate tournament summary
        const totalRuns = data.playerStats.reduce((sum, stats) => sum + stats.runs, 0)
        const totalWickets = data.playerStats.reduce((sum, stats) => sum + stats.wickets, 0)

        // Find highest run scorer
        const highestRunScorer = data.playerStats.reduce(
          (highest, current) => (current.runs > highest.runs ? current : highest),
          data.playerStats[0],
        )

        // Find highest wicket taker
        const highestWicketTaker = data.playerStats.reduce(
          (highest, current) => (current.wickets > highest.wickets ? current : highest),
          data.playerStats[0],
        )

        setSummary({
          totalRuns,
          totalWickets,
          highestRunScorer: {
            ...data.players.find((p) => p.id === highestRunScorer.playerId)!,
            runs: highestRunScorer.runs,
          },
          highestWicketTaker: {
            ...data.players.find((p) => p.id === highestWicketTaker.playerId)!,
            wickets: highestWicketTaker.wickets,
          },
        })

        // Calculate role distribution
        const roles = data.players.reduce((acc: Record<string, number>, player) => {
          acc[player.role] = (acc[player.role] || 0) + 1
          return acc
        }, {})

        const roleData = Object.entries(roles).map(([name, value]) => ({
          name,
          value,
        }))
        setRoleDistribution(roleData)

        // Calculate university performance
        const universities = data.players.reduce((acc: Record<string, { runs: number; wickets: number }>, player) => {
          if (!acc[player.university]) {
            acc[player.university] = { runs: 0, wickets: 0 }
          }

          const stats = data.playerStats.find((stat) => stat.playerId === player.id)
          if (stats) {
            acc[player.university].runs += stats.runs
            acc[player.university].wickets += stats.wickets
          }

          return acc
        }, {})

        const universityData = Object.entries(universities).map(([name, data]) => ({
          name,
          runs: data.runs,
          wickets: data.wickets,
        }))
        setUniversityPerformance(universityData)

        // Get top 5 run scorers
        const runScorers = data.playerStats
          .map((stats) => {
            const player = data.players.find((p) => p.id === stats.playerId)
            return {
              name: player?.name || "",
              runs: stats.runs,
              university: player?.university || "",
            }
          })
          .sort((a, b) => b.runs - a.runs)
          .slice(0, 5)
        setTopRunScorers(runScorers)

        // Get top 5 wicket takers
        const wicketTakers = data.playerStats
          .map((stats) => {
            const player = data.players.find((p) => p.id === stats.playerId)
            return {
              name: player?.name || "",
              wickets: stats.wickets,
              university: player?.university || "",
            }
          })
          .sort((a, b) => b.wickets - a.wickets)
          .slice(0, 5)
        setTopWicketTakers(wicketTakers)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading tournament data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tournament Summary</h1>
        <p className="text-muted-foreground">Overall analysis of the Inter-University Cricket Tournament</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRuns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Wickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalWickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Run Scorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.highestRunScorer.name}</div>
            <p className="text-xs text-muted-foreground">{summary.highestRunScorer.runs} runs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Wicket Taker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.highestWicketTaker.name}</div>
            <p className="text-xs text-muted-foreground">{summary.highestWicketTaker.wickets} wickets</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">University Performance</TabsTrigger>
          <TabsTrigger value="players">Top Players</TabsTrigger>
          <TabsTrigger value="roles">Player Roles</TabsTrigger>
          <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>University Performance</CardTitle>
              <CardDescription>Runs and wickets by university</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={universityPerformance}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="runs" fill="#0088FE" name="Runs" />
                    <Bar dataKey="wickets" fill="#00C49F" name="Wickets" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Run Scorers</CardTitle>
                <CardDescription>Top 5 batsmen by runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topRunScorers}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="runs" fill="#0088FE" name="Runs">
                        {topRunScorers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Wicket Takers</CardTitle>
                <CardDescription>Top 5 bowlers by wickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topWicketTakers}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="wickets" fill="#00C49F" name="Wickets">
                        {topWicketTakers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Player Role Distribution</CardTitle>
              <CardDescription>Distribution of players by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Tournament Statistics</CardTitle>
              <CardDescription>Comprehensive statistics for all players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Matches</TableHead>
                      <TableHead className="text-right">Runs</TableHead>
                      <TableHead className="text-right">Wickets</TableHead>
                      <TableHead className="text-right">Value (Rs.)</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => {
                      const stats = playerStats.find((stat) => stat.playerId === player.id)
                      return (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell>{player.university}</TableCell>
                          <TableCell>{player.role}</TableCell>
                          <TableCell className="text-right">{stats?.matches || 0}</TableCell>
                          <TableCell className="text-right">{stats?.runs || 0}</TableCell>
                          <TableCell className="text-right">{stats?.wickets || 0}</TableCell>
                          <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{player.points}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

