import { type NextRequest, NextResponse } from "next/server"
import { getPlayers, createPlayer } from "@/lib/db"

export async function GET() {
  try {
    const players = await getPlayers()
    return NextResponse.json({ players })
  } catch (error) {
    console.error("Get players error:", error)
    return NextResponse.json({ error: "An error occurred while fetching players" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const playerData = await request.json()

    // Validate required fields
    if (!playerData.name || !playerData.university || !playerData.role) {
      return NextResponse.json({ error: "Name, university, and role are required" }, { status: 400 })
    }

    const newPlayer = await createPlayer(playerData)

    return NextResponse.json(
      {
        player: newPlayer,
        message: "Player created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create player error:", error)
    return NextResponse.json({ error: "An error occurred while creating the player" }, { status: 500 })
  }
}

