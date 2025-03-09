import { type NextRequest, NextResponse } from "next/server"
import { getPlayerById, updatePlayer, deletePlayer } from "@/lib/db"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playerId = params.id
    const player = await getPlayerById(playerId)

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json({ player })
  } catch (error) {
    console.error("Get player error:", error)
    return NextResponse.json({ error: "An error occurred while fetching the player" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playerId = params.id
    const playerData = await request.json()

    const updatedPlayer = await updatePlayer(playerId, playerData)

    if (!updatedPlayer) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json({
      player: updatedPlayer,
      message: "Player updated successfully",
    })
  } catch (error) {
    console.error("Update player error:", error)
    return NextResponse.json({ error: "An error occurred while updating the player" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playerId = params.id
    const success = await deletePlayer(playerId)

    if (!success) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Player deleted successfully",
    })
  } catch (error) {
    console.error("Delete player error:", error)
    return NextResponse.json({ error: "An error occurred while deleting the player" }, { status: 500 })
  }
}

