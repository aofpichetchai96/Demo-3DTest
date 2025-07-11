import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { collections, users } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

// GET /api/collections - Get user's collections
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's collections
    const userCollections = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, user.id))
      .orderBy(desc(collections.updatedAt))

    return NextResponse.json(userCollections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/collections - Create new collection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, colors, size, notes, tags, isPublic } = body

    // Validate required fields
    if (!name || !colors || !size) {
      return NextResponse.json(
        { error: 'Missing required fields: name, colors, size' },
        { status: 400 }
      )
    }

    // Create new collection
    const [newCollection] = await db
      .insert(collections)
      .values({
        userId: user.id,
        name,
        colors,
        size,
        notes: notes || null,
        tags: tags || null,
        isPublic: isPublic || false
      })
      .returning()

    return NextResponse.json(newCollection, { status: 201 })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
