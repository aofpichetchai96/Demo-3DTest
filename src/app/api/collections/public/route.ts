import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { collections, users } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

// GET /api/collections/public - Get public collections
export async function GET() {
  try {
    // Get public collections with user info
    const publicCollections = await db
      .select({
        id: collections.id,
        name: collections.name,
        colors: collections.colors,
        size: collections.size,
        notes: collections.notes,
        tags: collections.tags,
        views: collections.views,
        likes: collections.likes,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
        creator: {
          name: users.name,
          email: users.email
        }
      })
      .from(collections)
      .innerJoin(users, eq(collections.userId, users.id))
      .where(eq(collections.isPublic, true))
      .orderBy(desc(collections.likes), desc(collections.createdAt))
      .limit(50)

    return NextResponse.json(publicCollections)
  } catch (error) {
    console.error('Error fetching public collections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
