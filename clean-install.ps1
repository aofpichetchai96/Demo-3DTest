Write-Host "🧹 Cleaning project..." -ForegroundColor Yellow

# ลบไฟล์และโฟลเดอร์เก่า
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue  
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

Write-Host "✅ Cleanup completed" -ForegroundColor Green

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# ติดตั้ง dependencies
npm install

Write-Host "🔧 Installing additional dependencies..." -ForegroundColor Yellow

# ติดตั้ง dependencies ที่ขาดหายไป
npm install autoprefixer postcss tailwindcss @types/bcryptjs @types/jsonwebtoken

Write-Host "✅ Installation completed" -ForegroundColor Green

Write-Host "🔌 Testing database connection..." -ForegroundColor Yellow

# ทดสอบ database
npm run db:setup

Write-Host "🚀 Ready to start development!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server" -ForegroundColor Cyan
