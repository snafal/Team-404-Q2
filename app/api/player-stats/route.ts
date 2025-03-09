import { NextResponse } from "next/server"
import { getPlayerStats } from "@/lib/db"

export async function GET() {
  try {
    const playerStats = await getPlayerStats()
    return NextResponse.json({ playerStats })
  } catch (error) {
    console.error("Get player stats error:", error)
    return NextResponse.json({ error: "An error occurred while fetching player stats" }, { status: 500 })
  }
}

