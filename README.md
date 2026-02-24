# ICT Quiz Generator

Ứng dụng tạo quiz ICT lớp 7 với AI và Chatling.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env.local` trong thư mục gốc:
```
OPENAI_API_KEY=your_openai_api_key_here
CHATLING_SECRET=your_chatling_secret_here
VERCEL_URL=http://localhost:3000
```

## Chạy Local

### Cách 1: Sử dụng Vercel CLI (Khuyến nghị)

1. Cài đặt Vercel CLI:
```bash
npm install -g vercel
```

2. Chạy dev server:
```bash
vercel dev
```

Server sẽ chạy tại `http://localhost:3000`

### Cách 2: Sử dụng Node.js HTTP Server (Chỉ test frontend)

1. Cài đặt http-server:
```bash
npm install -g http-server
```

2. Chạy server:
```bash
http-server -p 3000
```

**Lưu ý:** Cách này chỉ chạy được frontend, API serverless functions cần Vercel CLI.

## Deploy lên Vercel

1. Đăng nhập Vercel:
```bash
vercel login
```

2. Deploy:
```bash
vercel
```

3. Thêm environment variables trong Vercel Dashboard:
   - `OPENAI_API_KEY`
   - `CHATLING_SECRET`
   - `VERCEL_URL` (tự động)

## Cấu trúc Project

```
ict-quiz/
├── index.html          # Trang chủ
├── quiz.html           # Trang làm quiz
├── quiz.js             # Logic quiz
├── style.css           # CSS chung
├── api/
│   └── generate-quiz.js  # Vercel Serverless Function
├── vercel.json         # Config Vercel
└── package.json        # Dependencies
```












