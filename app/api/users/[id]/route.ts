import { type NextRequest, NextResponse } from "next/server"
import { updateUser } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const userData = await request.json()

    const updatedUser = await updateUser(userId, userData)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "An error occurred while updating the user" }, { status: 500 })
  }
}

