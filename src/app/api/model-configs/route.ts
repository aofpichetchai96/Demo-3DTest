import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  getAllModelConfigurations, 
  getModelConfiguration, 
  createModelConfiguration, 
  updateModelConfiguration,
  deleteModelConfiguration,
  getModelWithPresets
} from '@/lib/modelConfigService'

// GET /api/model-configs - ดึงรายการ model configurations ทั้งหมด
// GET /api/model-configs?name=adidas - ดึง config เฉพาะของโมเดล
// GET /api/model-configs?name=adidas&presets=true - ดึง config พร้อม viewing presets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelName = searchParams.get('name')
    const includePresets = searchParams.get('presets') === 'true'

    if (modelName) {
      if (includePresets) {
        const modelWithPresets = await getModelWithPresets(modelName)
        if (!modelWithPresets) {
          return NextResponse.json(
            { error: 'Model configuration not found' },
            { status: 404 }
          )
        }
        return NextResponse.json(modelWithPresets)
      } else {
        const config = await getModelConfiguration(modelName)
        if (!config) {
          return NextResponse.json(
            { error: 'Model configuration not found' },
            { status: 404 }
          )
        }
        return NextResponse.json(config)
      }
    }

    // ดึงรายการทั้งหมด
    const configs = await getAllModelConfigurations()
    return NextResponse.json(configs)

  } catch (error) {
    console.error('Error fetching model configurations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model configurations' },
      { status: 500 }
    )
  }
}

// POST /api/model-configs - สร้าง model configuration ใหม่ (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const data = await request.json()
    
    // ตรวจสอบว่ามี model name อยู่แล้วหรือไม่
    const existing = await getModelConfiguration(data.modelName)
    if (existing) {
      return NextResponse.json(
        { error: 'Model configuration already exists' },
        { status: 409 }
      )
    }

    const newConfig = await createModelConfiguration(data)
    return NextResponse.json(newConfig, { status: 201 })

  } catch (error) {
    console.error('Error creating model configuration:', error)
    return NextResponse.json(
      { error: 'Failed to create model configuration' },
      { status: 500 }
    )
  }
}

// PUT /api/model-configs?name=adidas - อัปเดต model configuration (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const modelName = searchParams.get('name')
    
    if (!modelName) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      )
    }

    const updates = await request.json()
    const updatedConfig = await updateModelConfiguration(modelName, updates)
    
    if (!updatedConfig) {
      return NextResponse.json(
        { error: 'Model configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedConfig)

  } catch (error) {
    console.error('Error updating model configuration:', error)
    return NextResponse.json(
      { error: 'Failed to update model configuration' },
      { status: 500 }
    )
  }
}

// DELETE /api/model-configs?name=adidas - ลบ model configuration (soft delete, admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const modelName = searchParams.get('name')
    
    if (!modelName) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      )
    }

    const success = await deleteModelConfiguration(modelName)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Model configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Model configuration deleted successfully' })

  } catch (error) {
    console.error('Error deleting model configuration:', error)
    return NextResponse.json(
      { error: 'Failed to delete model configuration' },
      { status: 500 }
    )
  }
}
