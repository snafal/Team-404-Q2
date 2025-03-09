import { type Document, ObjectId, type WithId } from "mongodb"
import clientPromise from "./mongodb"
import { type Player, type PlayerRole, type PlayerStats, fetchAndParseCSVData } from "./data"


const DB_NAME = "spirit11"
const USERS_COLLECTION = "users"
const PLAYERS_COLLECTION = "players"
const PLAYER_STATS_COLLECTION = "playerStats"


export interface PlayerDocument extends Document {
  id: string
  name: string
  university: string
  role: PlayerRole
  image?: string
  value: number
  points: number
}

export interface PlayerStatsDocument extends Document {
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


export interface UserDocument extends Document {
  _id?: ObjectId
  username: string
  password: string
  budget: number
  team: PlayerDocument[]
  teamPoints: number
}

export interface User {
  id: string
  username: string
  password: string
  budget: number
  team: Player[]
  teamPoints: number
}


export async function initializeDb() {
  const client = await clientPromise
  const db = client.db(DB_NAME)


  const usersCount = await db.collection(USERS_COLLECTION).countDocuments()
  const playersCount = await db.collection(PLAYERS_COLLECTION).countDocuments()

  if (usersCount === 0 || playersCount === 0) {
    console.log("Initializing database with required data...")

 
    const { players: csvPlayers, playerStats: csvPlayerStats } = await fetchAndParseCSVData()

   
    if (playersCount === 0) {
      await db.collection(PLAYERS_COLLECTION).insertMany(csvPlayers)
      console.log(`Inserted ${csvPlayers.length} players`)
    }

    
    const playerStatsCount = await db.collection(PLAYER_STATS_COLLECTION).countDocuments()
    if (playerStatsCount === 0) {
      await db.collection(PLAYER_STATS_COLLECTION).insertMany(csvPlayerStats)
      console.log(`Inserted ${csvPlayerStats.length} player stats`)
    }

    console.log("Database initialization complete")
  }
}


function documentToUser(doc: WithId<UserDocument>): User {
  return {
    id: doc._id.toString(),
    username: doc.username,
    password: doc.password,
    budget: doc.budget,
    team: doc.team,
    teamPoints: doc.teamPoints,
  }
}

// User functions
export async function getUsers(): Promise<User[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const docs = await db.collection<UserDocument>(USERS_COLLECTION).find().toArray()
  return docs.map(documentToUser)
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const doc = await db.collection<UserDocument>(USERS_COLLECTION).findOne({ username })
  return doc ? documentToUser(doc) : null
}

export async function createUser(userData: Omit<User, "id">): Promise<User> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const result = await db.collection<UserDocument>(USERS_COLLECTION).insertOne(userData as any)

  return {
    ...userData,
    id: result.insertedId.toString(),
  }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

 
  const _id = new ObjectId(userId)

 
  await db.collection<UserDocument>(USERS_COLLECTION).updateOne({ _id }, { $set: userData })

  const doc = await db.collection<UserDocument>(USERS_COLLECTION).findOne({ _id })
  return doc ? documentToUser(doc) : null
}


export async function getPlayers(): Promise<Player[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const docs = await db.collection<PlayerDocument>(PLAYERS_COLLECTION).find().toArray()
  return docs as unknown as Player[]
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const doc = await db.collection<PlayerDocument>(PLAYERS_COLLECTION).findOne({ id })
  return doc as unknown as Player | null
}

export async function getPlayerStats(): Promise<PlayerStats[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const docs = await db.collection<PlayerStatsDocument>(PLAYER_STATS_COLLECTION).find().toArray()
  return docs as unknown as PlayerStats[]
}

export async function getPlayerStatById(playerId: string): Promise<PlayerStats | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const doc = await db.collection<PlayerStatsDocument>(PLAYER_STATS_COLLECTION).findOne({ playerId })
  return doc as unknown as PlayerStats | null
}

export async function createPlayer(playerData: Omit<Player, "id">): Promise<Player> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const players = await getPlayers()
  const id = (Math.max(...players.map((p) => Number(p.id))) + 1).toString()

  const newPlayer = { ...playerData, id }

  await db.collection<PlayerDocument>(PLAYERS_COLLECTION).insertOne(newPlayer as any)
  return newPlayer
}

export async function updatePlayer(playerId: string, playerData: Partial<Player>): Promise<Player | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  await db.collection<PlayerDocument>(PLAYERS_COLLECTION).updateOne({ id: playerId }, { $set: playerData })

  const doc = await db.collection<PlayerDocument>(PLAYERS_COLLECTION).findOne({ id: playerId })
  return doc as unknown as Player | null
}

export async function deletePlayer(playerId: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const result = await db.collection<PlayerDocument>(PLAYERS_COLLECTION).deleteOne({ id: playerId })
  return result.deletedCount === 1
}


initializeDb().catch(console.error)

