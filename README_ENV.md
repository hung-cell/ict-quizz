# Hướng dẫn Fix Environment Variables với Vercel Dev

## Vấn đề
Vercel dev không tự động load file `.env.local`. 

## Giải pháp

### Cách 1: Sử dụng file `.env` (Đã tạo sẵn)
File `.env` đã được tạo từ `.env.local`. Restart `vercel dev`:
```bash
# Dừng server (Ctrl+C)
vercel dev
```

### Cách 2: Set Environment Variables khi chạy (Windows PowerShell)
```powershell
$env:OPENAI_API_KEY="your-key-here"
$env:CHATLING_SECRET="your-secret-here"
$env:VERCEL_URL="http://localhost:3000"
vercel dev
```

### Cách 3: Link với Vercel Project và set trong Dashboard
```bash
# Link project (nếu chưa link)
vercel link

# Set env vars qua CLI
vercel env add OPENAI_API_KEY
vercel env add CHATLING_SECRET
```

Sau đó chạy:
```bash
vercel dev
```

### Cách 4: Sử dụng dotenv (Nếu các cách trên không work)
Cài đặt dotenv:
```bash
npm install dotenv
```

Tạo file `vercel.json` với config load env:
```json
{
  "env": {
    "OPENAI_API_KEY": "@openai_api_key",
    "CHATLING_SECRET": "@chatling_secret"
  }
}
```

## Kiểm tra
Sau khi restart, test API và xem terminal log. Bạn sẽ thấy:
```
Environment check:
OPENAI_API_KEY exists: true
OPENAI_API_KEY length: XX
CHATLING_SECRET exists: true
```










