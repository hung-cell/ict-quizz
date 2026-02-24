let quizData = null;
let currentQuestion = 0;
let userAnswers = {};

// Load quiz từ URL parameter
window.onload = async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');
  
  if (!quizId) {
    alert('Không tìm thấy quiz!');
    location.href = '/';
    return;
  }
  
  try {
    // Decode quiz data từ URL (Chatling sẽ encode và gửi)
    const encodedData = urlParams.get('data');
    quizData = JSON.parse(decodeURIComponent(encodedData));
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    displayQuestion();
  } catch (error) {
    console.error('Error loading quiz:', error);
    alert('Lỗi tải quiz!');
  }
};

function displayQuestion() {
  const question = quizData.questions[currentQuestion];
  
  document.getElementById('quiz-topic').textContent = quizData.topic;
  document.getElementById('question-text').textContent = `Câu ${currentQuestion + 1}: ${question.question}`;
  document.getElementById('question-counter').textContent = `Câu ${currentQuestion + 1} / ${quizData.questions.length}`;
  
  // Update progress bar
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  document.getElementById('progress').style.width = progress + '%';
  
  // Display options
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    if (userAnswers[currentQuestion] === index) {
      optionDiv.classList.add('selected');
    }
    
    const label = String.fromCharCode(65 + index);
    optionDiv.innerHTML = `
      <div class="option-label">${label}</div>
      <div class="option-text">${option}</div>
    `;
    
    optionDiv.onclick = () => selectOption(index);
    optionsContainer.appendChild(optionDiv);
  });
  
  // Update buttons
  document.getElementById('prev-btn').disabled = currentQuestion === 0;
  
  const isLast = currentQuestion === quizData.questions.length - 1;
  document.getElementById('next-btn').style.display = isLast ? 'none' : 'block';
  document.getElementById('submit-btn').style.display = isLast ? 'block' : 'none';
}

function selectOption(index) {
  userAnswers[currentQuestion] = index;
  displayQuestion();
}

function nextQuestion() {
  if (currentQuestion < quizData.questions.length - 1) {
    currentQuestion++;
    displayQuestion();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
}

function submitQuiz() {
  // Check if all questions answered
  if (Object.keys(userAnswers).length < quizData.questions.length) {
    alert('Vui lòng trả lời tất cả các câu hỏi!');
    return;
  }
  
  // Calculate score
  let correctCount = 0;
  const results = quizData.questions.map((q, index) => {
    const isCorrect = userAnswers[index] === q.correctAnswer;
    if (isCorrect) correctCount++;
    
    return {
      question: q.question,
      options: q.options,
      userAnswer: userAnswers[index],
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
    };
  });
  
  const score = Math.round((correctCount / quizData.questions.length) * 100);
  
  displayResults(score, correctCount, results);
}

function displayResults(score, correctCount, results) {
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';

  // Display score
  const scoreCircle = document.getElementById('score-circle');
  scoreCircle.textContent = score + '%';
  scoreCircle.style.background = score >= 50 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 102, 0.1)';
  scoreCircle.style.color = score >= 50 ? '#00ff88' : '#ff4466';
  scoreCircle.style.borderColor = score >= 50 ? '#00ff88' : '#ff4466';
  scoreCircle.style.boxShadow = score >= 50 ? '0 0 30px rgba(0, 255, 136, 0.3)' : '0 0 30px rgba(255, 68, 102, 0.3)';

  const scoreText = document.getElementById('score-text');
  scoreText.innerHTML = `
    Bạn trả lời đúng <strong style="color: #00ff88">${correctCount}</strong> / ${quizData.questions.length} câu<br>
    ${score >= 50 ? '🎉 Xuất sắc! Bạn là nhà khoa học thực thụ!' : '💪 Tiếp tục khám phá nhé!'}
  `;

  // Display detailed answers
  const reviewContainer = document.getElementById('answers-review');
  reviewContainer.innerHTML = '<h2>📊 Phân tích chi tiết</h2>';

  results.forEach((result, index) => {
    const answerDiv = document.createElement('div');
    answerDiv.className = `answer-item ${result.isCorrect ? 'correct' : 'wrong'}`;

    let optionsHTML = '';
    result.options.forEach((opt, i) => {
      let className = '';
      if (i === result.correctAnswer) className = 'correct-answer';
      if (i === result.userAnswer && !result.isCorrect) className = 'user-wrong';

      optionsHTML += `<div class="answer-option ${className}">${String.fromCharCode(65 + i)}. ${opt}</div>`;
    });

    answerDiv.innerHTML = `
      <h3 style="margin-bottom:15px;">${result.isCorrect ? '✅' : '❌'} Câu ${index + 1}: ${result.question}</h3>
      ${optionsHTML}
      <div class="explanation">
        <strong>🔬 Giải thích:</strong> ${result.explanation}
      </div>
    `;

    reviewContainer.appendChild(answerDiv);
  });
}




