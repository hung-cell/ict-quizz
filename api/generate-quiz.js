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
    const { topic, context, num_questions = 10, difficulty = 'medium', image } = req.body;

    console.log('Generating quiz for:', topic, image ? 'with image' : '');

    // Build user message content
    let userContent = [];

    // Add image if provided (GPT-4 Vision)
    if (image) {
      // Check if image is URL or base64
      if (image.startsWith('http')) {
        userContent.push({
          type: 'image_url',
          image_url: { url: image }
        });
      } else {
        // Assume base64 - add data URI prefix if missing
        const base64Image = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
        userContent.push({
          type: 'image_url',
          image_url: { url: base64Image }
        });
      }
    }

    // Add text prompt
    const textPrompt = image
      ? `Phân tích hình ảnh và tạo ${num_questions} câu hỏi trắc nghiệm ở mức ${difficulty} dựa trên nội dung hình ảnh${topic ? ` về chủ đề "${topic}"` : ''}.${context ? `\n\nThông tin thêm: ${context}` : ''}`
      : `Tạo ${num_questions} câu hỏi về "${topic}" ở mức ${difficulty}.\n\nNội dung: ${context}`;

    userContent.push({
      type: 'text',
      text: textPrompt
    });

    // Generate quiz
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Bạn là giáo viên ICT lớp 7. Tạo quiz tiếng Việt với format JSON:
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
          content: userContent
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const quizData = JSON.parse(completion.choices[0].message.content);
    
    // Create quiz object
    const quiz = {
      topic: topic || (image ? 'Quiz từ hình ảnh' : 'Quiz'),
      difficulty,
      questions: quizData.questions
    };

    // Encode quiz data
    const encodedData = encodeURIComponent(JSON.stringify(quiz));
    
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const quizUrl = `${baseUrl}/quiz.html?id=${Date.now()}&data=${encodedData}`;

    const topicDisplay = topic || (image ? 'từ hình ảnh' : topic);

    return res.status(200).json({
      success: true,
      quiz_url: quizUrl,
      message: `✅ Quiz ${topicDisplay} đã sẵn sàng!\n\n📝 ${num_questions} câu hỏi\n\n👉 Làm bài: ${quizUrl}`
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message,
      message: 'Có lỗi xảy ra. Vui lòng thử lại!'
    });
  }
}



