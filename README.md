# OEM 3D Product Customization System

## 📋 Overview

ระบบ OEM ที่ช่วยให้ผู้ใช้สามารถปรับแต่งสินค้า 3D ได้แบบ Interactive พร้อมระบบจัดการคอลเลกชัน และระบบจัดการคำสั่งซื้อแบบครบวงจร

## 🎯 Features

### 1. ระบบหน้าเว็บแสดงสินค้าแบบ 3D
- แสดงโมเดล 3D แบบ Interactive (หมุน, ซูม, เปลี่ยนมุมมอง)
- รองรับไฟล์ .glb
- Responsive design สำหรับมือถือและเดสก์ทอป
- Performance optimization สำหรับการโหลดโมเดล 3D

### 2. ระบบเลือก/ปรับแต่งสินค้า
- ปรับเปลี่ยนสีของส่วนต่างๆ ในสินค้า
- อัปโหลดและติดโลโก้ลงในสินค้า
- เลือกวัสดุที่แตกต่างกัน (มาตรฐาน, โลหะ, เงาใส, ด้าน, คาร์บอน)
- บันทึกการปรับแต่งและตั้งชื่อ
- ระบบ Preview แบบ Real-time

### 3. ระบบคอลเลกชัน
- สร้างและจัดการคอลเลกชันส่วนตัว
- แบ่งปันคอลเลกชันแบบสาธารณะ
- จัดเรียงลำดับสินค้าในคอลเลกชัน
- ดูคอลเลกชันของผู้ใช้อื่น

### 4. ระบบหลังบ้านจัดการโมเดล 3D
- อัปโหลดและจัดการไฟล์ .glb
- จัดการหมวดหมู่สินค้า
- กำหนดส่วนที่สามารถปรับแต่งได้
- ระบบ Admin Panel

### 5. ระบบจัดการคำสั่งซื้อ / ใบเสนอราคา
- สร้างใบเสนอราคาจากการปรับแต่ง
- ติดตามสถานะคำสั่งซื้อ
- ระบบจัดการที่อยู่จัดส่ง
- ประวัติการสั่งซื้อ

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React Framework
- **Three.js & React Three Fiber** - 3D Rendering
- **@react-three/drei** - 3D Components
- **Tailwind CSS** - Styling
- **TypeScript** - Type Safety

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File Upload
- **bcrypt** - Password Hashing

## 📁 Project Structure

```
oem-3d-system/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/      # React Components
│   │   │   ├── ThreeViewer.tsx
│   │   │   ├── ProductCustomizer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── contexts/        # React Contexts
│   │   │   └── AuthContext.tsx
│   │   ├── types/          # TypeScript Types
│   │   │   └── index.ts
│   │   └── utils/          # Utilities
│   │       └── api.ts
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/         # API Routes
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── customizations.js
│   │   │   └── collections.js
│   │   ├── middleware/     # Express Middleware
│   │   │   └── auth.js
│   │   ├── config/         # Configuration
│   │   │   └── database.js
│   │   └── server.js       # Main Server File
│   ├── database/           # Database Files
│   │   └── schema.sql
│   └── package.json
│
└── .env.example            # Environment Variables Example

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd oem-3d-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Create database
createdb oem_3d_system

# Run database migrations
psql -d oem_3d_system -f database/schema.sql

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start frontend server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/api/health

## 📱 Usage Guide

### For Users

#### 1. Registration & Login
- สมัครสมาชิกด้วยอีเมลและรหัสผ่าน
- เข้าสู่ระบบเพื่อใช้งานฟีเจอร์เต็มรูปแบบ

#### 2. Product Customization
- เลือกสินค้าที่ต้องการปรับแต่ง
- ใช้เครื่องมือปรับแต่ง:
  - **Color Picker**: เปลี่ยนสีส่วนต่างๆ
  - **Logo Upload**: อัปโหลดโลโก้
  - **Material Selection**: เลือกวัสดุ
- ดู Preview แบบ Real-time ใน 3D Viewer
- บันทึกการปรับแต่งพร้อมตั้งชื่อ

#### 3. Collections Management
- สร้างคอลเลกชันใหม่
- เพิ่มการปรับแต่งลงในคอลเลกชัน
- จัดเรียงลำดับสินค้า
- แบ่งปันคอลเลกชันแบบสาธารณะ

#### 4. Order & Quote Management
- สร้างใบเสนอราคาจากการปรับแต่ง
- ติดตามสถานะคำสั่งซื้อ
- จัดการข้อมูลการจัดส่ง

### For Administrators

#### 1. Product Management
- อัปโหลดโมเดล 3D (.glb files)
- จัดการหมวดหมู่สินค้า
- กำหนดส่วนที่สามารถปรับแต่งได้
- ตั้งราคาและรายละเอียดสินค้า

#### 2. User Management
- ดูรายการผู้ใช้
- จัดการสิทธิ์การเข้าถึง
- ติดตามการใช้งาน

#### 3. Order Processing
- จัดการคำสั่งซื้อ
- อัปเดตสถานะการจัดส่ง
- สร้างรายงาน

## 🎨 3D Model Requirements

### File Format
- **รองรับ**: .glb (GL Transmission Format Binary)
- **ขนาดไฟล์**: แนะนำไม่เกิน 10MB
- **Polygon Count**: แนะนำไม่เกิน 50,000 triangles

### Model Preparation
1. **Naming Convention**: ตั้งชื่อ mesh ให้ชัดเจน เช่น "body", "handle", "logo_area"
2. **Materials**: ใช้ PBR materials (Metallic/Roughness workflow)
3. **Textures**: รวมไว้ในไฟล์ .glb
4. **Scale**: ปรับขนาดให้เหมาะสมสำหรับการแสดงผล

### Customizable Parts Setup
```json
{
  "customizable_parts": {
    "body": {
      "colors": true,
      "materials": true
    },
    "handle": {
      "colors": true
    },
    "logo_area": {
      "logos": true
    }
  }
}
```

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me           # Get current user
PUT  /api/auth/profile      # Update profile
```

### Product Endpoints
```
GET  /api/products          # Get all products
GET  /api/products/:id      # Get single product
POST /api/products          # Create product (admin)
PUT  /api/products/:id      # Update product (admin)
```

### Customization Endpoints
```
GET  /api/customizations    # Get user customizations
POST /api/customizations    # Create customization
PUT  /api/customizations/:id # Update customization
DELETE /api/customizations/:id # Delete customization
```

### Collection Endpoints
```
GET  /api/collections       # Get user collections
POST /api/collections       # Create collection
GET  /api/collections/:id   # Get collection with items
PUT  /api/collections/:id   # Update collection
DELETE /api/collections/:id # Delete collection
```

## 🎯 Performance Optimization

### 3D Rendering
- **Level of Detail (LOD)**: ลดรายละเอียดเมื่อมองจากไกล
- **Texture Compression**: ใช้ compressed textures
- **Instance Rendering**: สำหรับสินค้าที่มีหลายชิ้น
- **Frustum Culling**: ไม่ render สิ่งที่อยู่นอกมุมมอง

### Loading Performance
- **Progressive Loading**: โหลดโมเดลแบบค่อยเป็นค่อยไป
- **Caching**: เก็บ cache โมเดลที่โหลดแล้ว
- **Compression**: บีบอัดไฟล์ก่อนส่ง
- **CDN**: ใช้ CDN สำหรับไฟล์ static

### Database Optimization
- **Indexing**: สร้าง index ที่เหมาะสม
- **Connection Pooling**: จัดการ database connections
- **Query Optimization**: เขียน query ให้มีประสิทธิภาพ
- **Pagination**: แบ่งข้อมูลเป็นหน้า

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: สำหรับ stateless authentication
- **Password Hashing**: ใช้ bcrypt
- **Role-based Access**: แยกสิทธิ์ user และ admin
- **Rate Limiting**: จำกัดจำนวน requests

### Data Protection
- **Input Validation**: ตรวจสอบข้อมูลนำเข้า
- **SQL Injection Prevention**: ใช้ parameterized queries
- **File Upload Security**: ตรวจสอบไฟล์ที่อัปโหลด
- **CORS Configuration**: กำหนด allowed origins

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
```

### Backend Testing
```bash
cd backend
npm run test        # Unit tests
npm run test:integration # Integration tests
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. **Database Setup**: สร้าง PostgreSQL database
2. **Environment Variables**: ตั้งค่า production environment
3. **Build Frontend**: `npm run build`
4. **Start Services**: เริ่ม backend และ frontend servers
5. **Reverse Proxy**: ตั้งค่า Nginx หรือ similar

### Environment Variables (Production)
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-super-secret-key
FRONTEND_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

หากพบปัญหาหรือต้องการความช่วยเหลือ:

1. ตรวจสอบ [Issues](https://github.com/your-repo/issues) ที่มีอยู่
2. สร้าง Issue ใหม่พร้อมรายละเอียดปัญหา
3. ติดต่อทีมพัฒนาผ่าน email

## 🔮 Future Enhancements

- [ ] AR/VR Support สำหรับการดูสินค้า
- [ ] AI-powered Design Suggestions
- [ ] Advanced Animation System
- [ ] Multi-language Support
- [ ] Mobile App (React Native)
- [ ] Advanced Reporting Dashboard
- [ ] Integration กับ E-commerce platforms
- [ ] Real-time Collaboration
- [ ] Advanced Material Editor
- [ ] Batch Operations สำหรับ Admin