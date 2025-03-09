import { NextResponse } from "next/server"
import { getUsers } from "@/lib/db"

export async function GET() {
  try {
    const users = await getUsers()

    // Map users to leaderboard entries, excluding sensitive information
    const leaderboard = users
      .map((user) => ({
        id: user.id,
        username: user.username,
        teamPoints: user.teamPoints,
        teamSize: user.team.length,
      }))
      // Only include users with complete teams
      .filter((user) => user.teamSize === 11)
      // Sort by points in descending order
      .sort((a, b) => b.teamPoints - a.teamPoints)
      // Add rank
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Get leaderboard error:", error)
    return NextResponse.json({ error: "An error occurred while fetching the leaderboard" }, { status: 500 })
  }
}

