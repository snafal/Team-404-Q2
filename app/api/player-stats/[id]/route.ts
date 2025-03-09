import { type NextRequest, NextResponse } from "next/server"
import { getPlayerStatById } from "@/lib/db"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playerId = params.id
    const playerStat = await getPlayerStatById(playerId)

    if (!playerStat) {
      return NextResponse.json({ error: "Player stats not found" }, { status: 404 })
    }

    return NextResponse.json({ playerStat })
  } catch (error) {
    console.error("Get player stat error:", error)
    return NextResponse.json({ error: "An error occurred while fetching the player stats" }, { status: 500 })
  }
}

