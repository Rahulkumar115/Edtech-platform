const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// 🚀 CACHE STORAGE VARIABLES (Protects API Quota & speeds up homepage loads)
let cachedQuiz = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60; // Cache valid for 1 hour

// ============================================================================
// 1. SOCRATIC AI TUTOR & MENTOR CHAT CONTROLLER
// ============================================================================
exports.getTutorResponse = async (req, res) => {
  const { chatHistory, newQuestion, courseTitle, lectureTitle } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ reply: "Server configuration error: API key missing." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Check if the user is on a global page (Home or Dashboard)
    const isGlobalPage = courseTitle.includes("Landing Page") || courseTitle.includes("Dashboard");

    // Dynamically assign rules based on the page context
    let dynamicInstructions = "";

    if (isGlobalPage) {
      dynamicInstructions = `You are an expert, friendly CS & Coding Mentor for an EdTech platform. 
      The user is exploring the platform. 
      Rule: Answer ANY programming, logical, code generation (like prime numbers, DSA, etc.), or career roadmap questions freely and clearly. Format code blocks beautifully.`;
    } else {
      dynamicInstructions = `You are an expert, encouraging AI Tutor embedded inside an EdTech platform. 
      The student is currently viewing the course: "${courseTitle}", lecture: "${lectureTitle}".
      Rules:
      1. Use the Socratic method: Guide the student using hints rather than spoon-feeding direct solutions.
      2. Keep responses concise and focused on the current lesson context.`;
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: dynamicInstructions
    });

    const chat = model.startChat({
      history: chatHistory || []
    });

    const result = await chat.sendMessage(newQuestion);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error("🎯 Gemini SDK Crash Log:", error); 
    res.status(500).json({ reply: "⚠️ AI processor overload. Please try again in a moment." });
  }
};

// ============================================================================
// 2. LIVE AI QUIZ GENERATION CONTROLLER (WITH CACHING)
// ============================================================================
exports.generateLiveQuiz = async (req, res) => {
  try {
    // 1. Check if the frontend explicitly commanded a fresh fetch
    const forceRefresh = req.query.forceRefresh === 'true';

    // 2. Validate Cache: Serve from memory if valid and not forced
    const isCacheValid = cachedQuiz && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
    
    if (!forceRefresh && isCacheValid) {
      console.log("⚡ Serving AI Quiz directly from Express In-Memory Cache");
      return res.status(200).json(cachedQuiz);
    }

    console.log("🤖 Cache expired or bypassed. Generating fresh questions via Gemini API...");

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key missing." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Instructing Gemini to output strict structured JSON fitting our exact schema
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `You are an expert web development curriculum designer. 
      Generate exactly 3 random, distinct multiple-choice questions testing Full-Stack Web Development (MERN Stack, React internals, Node.js, REST APIs, HTTP, or Databases).
      The output MUST be a valid JSON array containing exactly 3 objects. Each object must follow this exact schema:
      [
        {
          "questionText": "Question string here?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswerIndex": integer between 0 and 3,
          "explanation": "Brief explanation of why the answer is correct."
        }
      ]`
    });

    const prompt = "Generate a fresh, challenging set of 3 full-stack web dev trivia questions.";
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the AI's JSON string securely
    const quizData = JSON.parse(responseText);
    
    // 3. Update the global cache variables with the fresh array
    cachedQuiz = quizData;
    cacheTimestamp = Date.now();
    
    res.status(200).json(quizData);
  } catch (error) {
    console.error("🎯 AI Live Quiz Generation Error:", error);
    
    // Safety Catch: If Gemini drops the connection or hits rate limits, safely serve the old cached data if available
    if (cachedQuiz) {
      console.log("⚠️ Live API call failed. Safely falling back to stale cache data.");
      return res.status(200).json(cachedQuiz);
    }

    res.status(500).json({ error: "Failed to generate live quiz. Please try again." });
  }
};