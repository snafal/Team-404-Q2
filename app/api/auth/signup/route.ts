import { type NextRequest, NextResponse } from "next/server"
import { getUserByUsername, createUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

 
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = await createUser({
      username,
      password, 
      budget: 9000000, 
      team: [],
      teamPoints: 0,
    })

    
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "User created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}

