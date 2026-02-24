// api/generate-quiz.js
import OpenAI from 'openai';

export default async function handler(req, res) {
  // Initialize OpenAI client inside handler
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is not configured',
      message: 'Vui lòng cấu hình OPENAI_API_KEY trong file .env.local'
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Verify secret
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CHATLING_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { topic, context, num_questions = 10, difficulty = 'medium' } = req.body;
    
    console.log('Generating quiz for:', topic);
    
    // Generate quiz
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Bạn là giáo viên Khoa học. Tạo quiz tiếng Việt về Vật lý, Hóa học, Sinh học với format JSON:
{
  "questions": [
    {
      "question": "Câu hỏi?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Giải thích"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Tạo ${num_questions} câu hỏi về "${topic}" ở mức ${difficulty}.\n\nNội dung: ${context}`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const quizData = JSON.parse(completion.choices[0].message.content);
    
    // Create quiz object
    const quiz = {
      topic,
      difficulty,
      questions: quizData.questions
    };
    
    // Encode quiz data
    const encodedData = encodeURIComponent(JSON.stringify(quiz));
    const baseUrl = process.env.VERCEL_URL
      ? process.env.VERCEL_URL.startsWith('http')
        ? process.env.VERCEL_URL
        : `https://${process.env.VERCEL_URL}`
      : 'https://your-app.vercel.app';

    const quizUrl = `${baseUrl}/quiz.html?id=${Date.now()}&data=${encodedData}`;
    
    return res.status(200).json({
      success: true,
      quiz_url: quizUrl,
      message: `✅ Quiz về "${topic}" đã sẵn sàng!\n\n📝 ${num_questions} câu hỏi\n\n👉 Làm bài: ${quizUrl}`
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message,
      message: 'Có lỗi xảy ra. Vui lòng thử lại!'
    });
  }
}



