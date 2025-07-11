import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("กรุณาใส่อีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
})

export type LoginFormData = z.infer<typeof loginSchema>

export const shoeCustomizationSchema = z.object({
  model: z.string().min(1, "กรุณาเลือกรุ่นรองเท้า"),
  type: z.string().min(1, "กรุณาเลือกประเภทรองเท้า"),
  size: z.number().min(35).max(47, "ขนาดรองเท้าต้องอยู่ระหว่าง 35-47"),
  primaryColor: z.string().min(1, "กรุณาเลือกสีหลัก"),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  material: z.string().min(1, "กรุณาเลือกวัสดุ"),
  quantity: z.number().min(1, "จำนวนต้องมากกว่า 0")
})

export type ShoeCustomizationData = z.infer<typeof shoeCustomizationSchema>
