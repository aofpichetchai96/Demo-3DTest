import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { collections, users } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/collections/[id] - Get specific collection
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const collectionId = params.id

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get collection (must belong to user or be public)
    const [collection] = await db
      .select()
      .from(collections)
      .where(
        and(
          eq(collections.id, collectionId),
          eq(collections.userId, user.id)
        )
      )
      .limit(1)

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/collections/[id] - Update collection
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const collectionId = params.id
    const body = await request.json()
    const { name, colors, size, notes, tags, isPublic } = body

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update collection (must belong to user)
    const [updatedCollection] = await db
      .update(collections)
      .set({
        name: name || undefined,
        colors: colors || undefined,
        size: size || undefined,
        notes: notes !== undefined ? notes : undefined,
        tags: tags !== undefined ? tags : undefined,
        isPublic: isPublic !== undefined ? isPublic : undefined,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(collections.id, collectionId),
          eq(collections.userId, user.id)
        )
      )
      .returning()

    if (!updatedCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCollection)
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id] - Delete collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const collectionId = params.id

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete collection (must belong to user)
    const [deletedCollection] = await db
      .delete(collections)
      .where(
        and(
          eq(collections.id, collectionId),
          eq(collections.userId, user.id)
        )
      )
      .returning()

    if (!deletedCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Collection deleted successfully' })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
