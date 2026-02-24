# Hướng dẫn Test API generate-quiz

## 1. Cách chạy generate-quiz.js

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Tạo file `.env.local`
Tạo file `.env.local` trong thư mục gốc:
```
OPENAI_API_KEY=sk-your-openai-api-key
CHATLING_SECRET=your-secret-key-here
VERCEL_URL=http://localhost:3000
```

### Bước 3: Chạy với Vercel CLI
```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm install -g vercel

# Chạy dev server
vercel dev
```

Server sẽ chạy tại `http://localhost:3000`

## 2. Curl Commands để Test API

### Test cơ bản (Local)
```bash
curl -X POST http://localhost:3000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "topic": "HTML cơ bản",
    "context": "HTML là ngôn ngữ đánh dấu siêu văn bản",
    "num_questions": 5,
    "difficulty": "easy"
  }'
```

### Test với PowerShell (Windows)
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer your-secret-key-here"
}

$body = @{
    topic = "HTML cơ bản"
    context = "HTML là ngôn ngữ đánh dấu siêu văn bản"
    num_questions = 5
    difficulty = "easy"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/generate-quiz" -Method POST -Headers $headers -Body $body
```

### Test trên Vercel Production
```bash
curl -X POST https://your-app.vercel.app/api/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "topic": "JavaScript",
    "context": "JavaScript là ngôn ngữ lập trình",
    "num_questions": 10,
    "difficulty": "medium"
  }'
```

### Test với các tham số tối thiểu
```bash
curl -X POST http://localhost:3000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "topic": "Python"
  }'
```

## 3. Response mẫu

Khi thành công, API sẽ trả về:
```json
{
  "success": true,
  "quiz_url": "http://localhost:3000/quiz.html?id=1234567890&data=...",
  "message": "✅ Quiz về \"HTML cơ bản\" đã sẵn sàng!\n\n📝 5 câu hỏi\n\n👉 Làm bài: http://localhost:3000/quiz.html?id=1234567890&data=..."
}
```

Khi lỗi (thiếu authorization):
```json
{
  "error": "Unauthorized"
}
```

## 4. Test nhanh với file JSON

Tạo file `test-request.json`:
```json
{
  "topic": "CSS",
  "context": "CSS dùng để style trang web",
  "num_questions": 3,
  "difficulty": "easy"
}
```

Chạy:
```bash
curl -X POST http://localhost:3000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d @test-request.json
```










