
export type PlayerRole = "Batsman" | "Bowler" | "All-Rounder" | "Wicket Keeper"
export type University = string

export interface Player {
  id: string
  name: string
  university: University
  role: PlayerRole
  image?: string
  value: number 
  points: number
}

export interface PlayerStats {
  playerId: string
  matches: number
  runs: number
  wickets: number
  catches: number
  stumpings: number
  highestScore: number
  bestBowling: string 
  fifties: number
  hundreds: number
  economy: number
  strikeRate: number
  average: number

  ballsFaced: number
  inningsPlayed: number
  oversBowled: number
  runsConceded: number
  
  battingStrikeRate: number
  battingAverage: number
  bowlingStrikeRate: number
  bowlingEconomy: number
}


export const players: Player[] = [
  {
    id: "1",
    name: "Kasun Perera",
    university: "Colombo",
    role: "Batsman",
    image: "/placeholder.svg?height=100&width=100",
    value: 1200000,
    points: 120,
  },
  
]

export const playerStats: PlayerStats[] = [
  {
    playerId: "1",
    matches: 10,
    runs: 450,
    wickets: 0,
    catches: 5,
    stumpings: 0,
    highestScore: 95,
    bestBowling: "0/0",
    fifties: 4,
    hundreds: 0,
    economy: 0,
    strikeRate: 135.5,
    average: 45.0,
   
    ballsFaced: 350,
    inningsPlayed: 10,
    oversBowled: 0,
    runsConceded: 0,
  
    battingStrikeRate: 128.57,
    battingAverage: 45.0,
    bowlingStrikeRate: 0,
    bowlingEconomy: 0,
  },
  
]


export function getPlayerById(id: string): Player | undefined {
  return players.find((player) => player.id === id)
}

export function getPlayerStatsById(id: string): PlayerStats | undefined {
  return playerStats.find((stats) => stats.playerId === id)
}

// Calculate batting strike rate
export function calculateBattingStrikeRate(runs: number, ballsFaced: number): number {
  if (ballsFaced === 0) return 0
  return (runs / ballsFaced) * 100
}

// Calculate batting average
export function calculateBattingAverage(runs: number, inningsPlayed: number): number {
  if (inningsPlayed === 0) return 0
  return runs / inningsPlayed
}

// Calculate bowling strike rate
export function calculateBowlingStrikeRate(ballsBowled: number, wickets: number): number {
  if (wickets === 0) return 999 
  return ballsBowled / wickets
}

// Calculate bowling economy rate
export function calculateBowlingEconomy(runsConceded: number, ballsBowled: number): number {
  if (ballsBowled === 0) return 0
  return (runsConceded / ballsBowled) * 6
}

// Convert overs to balls
export function oversToBalls(overs: number): number {
  const fullOvers = Math.floor(overs)
  const partialOver = (overs - fullOvers) * 10 
  return fullOvers * 6 + partialOver
}


export function calculatePlayerPoints(stats: PlayerStats): number {
  // Player Points = ((Batting Strike Rate / 5) + (Batting Average × 0.8)) + ((500 / Bowling Strike Rate) + (140 / Economy Rate))

 
  const battingComponent = stats.battingStrikeRate / 5 + stats.battingAverage * 0.8

  // Calculate bowling component
  let bowlingComponent = 0
  if (stats.wickets > 0) {
    bowlingComponent = 500 / stats.bowlingStrikeRate + 140 / stats.bowlingEconomy
  }

  
  return Math.round(battingComponent + bowlingComponent)
}


export function calculatePlayerValue(points: number): number {
  // Value in Rupees = (9 × Points + 100) × 1000
  return (9 * points + 100) * 1000
}


export function getTournamentSummary() {
  const totalRuns = playerStats.reduce((sum, stats) => sum + stats.runs, 0)
  const totalWickets = playerStats.reduce((sum, stats) => sum + stats.wickets, 0)

 
  const highestRunScorer = playerStats.reduce(
    (highest, current) => (current.runs > highest.runs ? current : highest),
    playerStats[0],
  )

 
  const highestWicketTaker = playerStats.reduce(
    (highest, current) => (current.wickets > highest.wickets ? current : highest),
    playerStats[0],
  )

  return {
    totalRuns,
    totalWickets,
    highestRunScorer: {
      ...getPlayerById(highestRunScorer.playerId)!,
      runs: highestRunScorer.runs,
    },
    highestWicketTaker: {
      ...getPlayerById(highestWicketTaker.playerId)!,
      wickets: highestWicketTaker.wickets,
    },
  }
}


export async function fetchAndParseCSVData(): Promise<{ players: Player[]; playerStats: PlayerStats[] }> {
  try {
    const response = await fetch("https://drive.google.com/uc?export=download&id=1P6Mu-sq1nzQ5-yAc8HgccgQfQnHTCV5v")
    const csvText = await response.text()
    


    const rows = csvText.split("\n").filter((row) => row.trim() !== "")
    const headers = rows[0].split(",").map((header) => header.trim())

    const parsedData: any[] = []

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(",").map((value) => value.trim())
      if (values.length === headers.length) {
        const rowData: any = {}
        headers.forEach((header, index) => {
          rowData[header] = values[index]
        })
        parsedData.push(rowData)
      }
    }

   
    const newPlayers: Player[] = []
    const newPlayerStats: PlayerStats[] = []

    parsedData.forEach((row, index) => {
     
      let role: PlayerRole = "Batsman"
      if (row["Category"] === "All-Rounder") {
        role = "All-Rounder"
      } else if (row["Category"] === "Bowler") {
        role = "Bowler"
      } else if (row["Category"] === "Wicket Keeper") {
        role = "Wicket Keeper"
      }

 
      const totalRuns = Number.parseInt(row["Total Runs"]) || 0
      const ballsFaced = Number.parseInt(row["Balls Faced"]) || 0
      const inningsPlayed = Number.parseInt(row["Innings Played"]) || 0
      const wickets = Number.parseInt(row["Wickets"]) || 0
      const oversBowled = Number.parseFloat(row["Overs Bowled"]) || 0
      const runsConceded = Number.parseInt(row["Runs Conceded"]) || 0

      const ballsBowled = oversToBalls(oversBowled)

      const battingStrikeRate = calculateBattingStrikeRate(totalRuns, ballsFaced)
      const battingAverage = calculateBattingAverage(totalRuns, inningsPlayed)
      const bowlingStrikeRate = calculateBowlingStrikeRate(ballsBowled, wickets)
      const bowlingEconomy = calculateBowlingEconomy(runsConceded, ballsBowled)

     
      const playerStats: PlayerStats = {
        playerId: (index + 1).toString(),
        matches: inningsPlayed,
        runs: totalRuns,
        wickets: wickets,
        catches: 0, 
        stumpings: 0,
        highestScore: 0, 
        bestBowling: "0/0", 
        fifties: 0, 
        hundreds: 0, 
        economy: bowlingEconomy,
        strikeRate: battingStrikeRate,
        average: battingAverage,
        ballsFaced: ballsFaced,
        inningsPlayed: inningsPlayed,
        oversBowled: oversBowled,
        runsConceded: runsConceded,
        battingStrikeRate: battingStrikeRate,
        battingAverage: battingAverage,
        bowlingStrikeRate: bowlingStrikeRate,
        bowlingEconomy: bowlingEconomy,
      }

      
      const points = calculatePlayerPoints(playerStats)

     
      const value = calculatePlayerValue(points)

    
      const player: Player = {
        id: (index + 1).toString(),
        name: row["Name"],
        university: row["University"],
        role: role,
        image: "/placeholder.svg?height=100&width=100",
        value: value,
        points: points,
      }

      newPlayers.push(player)
      newPlayerStats.push(playerStats)
    })

    return { players: newPlayers, playerStats: newPlayerStats }
  } catch (error) {
    console.error("Error fetching or parsing CSV data:", error)
    return { players: [], playerStats: [] }
  }
}

