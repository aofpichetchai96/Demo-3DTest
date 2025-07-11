import { ShoeModel } from "@/types"

export const SHOE_MODELS: ShoeModel[] = [
  {
    id: "model-1",
    name: "รองเท้าผ้าใบสปอร์ต",
    type: "sneaker",
    basePrice: 1500,
    description: "รองเท้าผ้าใบสำหรับออกกำลังกาย มีระบบรองรับที่ดีเยี่ยม",
    previewImage: "/models/sneaker-preview.jpg"
  },
  {
    id: "model-2", 
    name: "รองเท้าบูท",
    type: "boot",
    basePrice: 2200,
    description: "รองเท้าบูทหนังแท้ สำหรับงานหนักและการใช้งานทั่วไป",
    previewImage: "/models/boot-preview.jpg"
  },
  {
    id: "model-3",
    name: "รองเท้าแตะ",
    type: "sandal", 
    basePrice: 800,
    description: "รองเท้าแตะยางพาราแท้ สวมใส่สบาย เหมาะกับสภาพอากาศร้อน",
    previewImage: "/models/sandal-preview.jpg"
  },
  {
    id: "model-4",
    name: "รองเท้าหนังทำงาน",
    type: "dress",
    basePrice: 2800,
    description: "รองเท้าหนังแท้สำหรับงานทางการ ออกแบบให้เข้ากับชุดสูท",
    previewImage: "/models/dress-preview.jpg"
  }
]

export const SHOE_COLORS = [
  { name: "ดำ", value: "#000000" },
  { name: "ขาว", value: "#FFFFFF" },
  { name: "น้ำตาล", value: "#8B4513" },
  { name: "แดง", value: "#DC143C" },
  { name: "น้ำเงิน", value: "#000080" },
  { name: "เขียว", value: "#228B22" },
  { name: "เหลือง", value: "#FFD700" },
  { name: "ส้ม", value: "#FF4500" },
  { name: "ม่วง", value: "#800080" },
  { name: "ชมพู", value: "#FF69B4" },
  { name: "เทา", value: "#808080" },
  { name: "น้ำตาลอ่อน", value: "#CD853F" }
]

export const SHOE_MATERIALS = [
  { name: "ยางธรรมชาติ", value: "natural_rubber", multiplier: 1.0 },
  { name: "ยางสังเคราะห์", value: "synthetic_rubber", multiplier: 0.8 },
  { name: "หนังแท้", value: "genuine_leather", multiplier: 1.5 },
  { name: "หนังเทียม", value: "synthetic_leather", multiplier: 1.2 },
  { name: "ผ้าแคนวาส", value: "canvas", multiplier: 0.9 },
  { name: "ไนลอน", value: "nylon", multiplier: 1.1 }
]

export const SHOE_SIZES = [
  35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47
]
