import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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

    let userCollections

    if (user.role === 'admin') {
      // Admin เห็นทุก collections พร้อมข้อมูล creator
      userCollections = await db
        .select({
          id: collections.id,
          name: collections.name,
          colors: collections.colors,
          size: collections.size,
          notes: collections.notes,
          tags: collections.tags,
          isPublic: collections.isPublic,
          views: collections.views,
          likes: collections.likes,
          createdAt: collections.createdAt,
          updatedAt: collections.updatedAt,
          creator: {
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role
          }
        })
        .from(collections)
        .innerJoin(users, eq(collections.userId, users.id))
        .orderBy(desc(collections.updatedAt))
    } else {
      // User เห็นเฉพาะ collections ของตัวเอง
      userCollections = await db
        .select()
        .from(collections)
        .where(eq(collections.userId, user.id))
        .orderBy(desc(collections.updatedAt))
    }

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
        notes: notes || '',
        tags: tags || [],
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
