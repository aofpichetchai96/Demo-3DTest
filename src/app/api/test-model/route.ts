import { NextResponse } from 'next/server'
import { readFile, access } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const modelPath = join(process.cwd(), 'public', 'models', 'scanned_adidas_sports_shoe.glb')
    
    // ตรวจสอบว่าไฟล์มีอยู่จริง
    await access(modelPath)
    
    // อ่านข้อมูลไฟล์
    const stats = await readFile(modelPath)
    
    return NextResponse.json({
      success: true,
      fileExists: true,
      fileSize: stats.length,
      filePath: modelPath,
      publicUrl: '/models/scanned_adidas_sports_shoe.glb'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fileExists: false
    })
  }
}
