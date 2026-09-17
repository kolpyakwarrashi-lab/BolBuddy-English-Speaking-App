import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / file-persisted kid progress storage
const DB_FILE = path.join(process.cwd(), 'bolbuddy_data.json');

function loadLocalData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading local DB:', e);
  }
  return { users: {} };
}

function saveLocalData(data: Record<string, unknown>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local DB:', e);
  }
}

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }
  return aiClient;
}

// Safely parse JSON responses from AI, stripping any markdown backticks if present
function parseJsonSafely<T>(text: string, fallback: T): T {
  if (!text) return fallback;
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    // Attempt to extract JSON from within text via bracket matching
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // ignore
      }
    }
    return fallback;
  }
}

interface GeminiCallOptions {
  contents: string;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}

/**
 * Resilient Gemini content generation with multi-model fallback & transient 503/429 retry
 */
async function callGeminiWithFallback(ai: GoogleGenAI, options: GeminiCallOptions): Promise<string> {
  // Use gemini-3.1-flash-lite as primary fast model to avoid 503 high demand spikes,
  // falling back to gemini-3.8-flash or gemini-flash-latest if needed.
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: unknown = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
          ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
          ...(options.temperature !== undefined ? { temperature: options.temperature } : {})
        }
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: unknown) {
      lastError = err;
      const errorObj = err as Record<string, unknown>;
      const status = errorObj?.status || errorObj?.code;
      const message = String(errorObj?.message || err);

      // If temporary overload 503 or 429 rate limit, switch model immediately
      if (status === 503 || status === 429 || message.includes('503') || message.includes('high demand') || message.includes('429')) {
        console.warn(`[AI Failover] Model ${model} is unavailable or high-demand (${status || 'demand spike'}), trying alternate model...`);
        continue;
      }
      console.warn(`[AI Warning] Model ${model} returned error:`, message);
    }
  }

  throw lastError || new Error('All Gemini candidate models failed to generate content');
}

// Build child-friendly system instruction according to class grade and language preference
function getSystemPrompt(classGrade: string, preferredLanguage: string, scenarioId?: string): string {
  const langName = preferredLanguage === 'hi' ? 'Hindi (हिंदी)' : preferredLanguage === 'mr' ? 'Marathi (मराठी)' : 'English';

  let complexityGuide = 'Use short, simple words, 1-2 conversational sentences, friendly emojis, and high enthusiasm.';
  if (['5th', '6th'].includes(classGrade)) {
    complexityGuide = 'Use clear everyday vocabulary, 1-3 conversational sentences, engaging thoughts, and friendly encouragement.';
  } else if (['7th', '8th'].includes(classGrade)) {
    complexityGuide = 'Use natural conversational English, expressive vocabulary, 2-3 sentences, and great confidence boosters.';
  }

  let roleContext = 'You are "BolBuddy", a friendly, warm, cheerful English-speaking companion for school children in India. You are a playful friend and chat buddy having a fun conversation, NOT a formal teacher, tutor, or examiner giving lectures.';
  if (scenarioId) {
    roleContext += ` You are roleplaying the "${scenarioId}" scenario with the child. Stay in character while being natural, friendly, and playful.`;
  }

  return `${roleContext}

CRITICAL CONVERSATIONAL GUIDELINES:
1. WARM, FRIENDLY COMPANION PERSONALITY:
   - Talk naturally and warmly like a supportive friend chatting during recess.
   - Use short, simple conversational sentences.
   - Sound encouraging and playful.
   - Never sound strict, formal, academic, or like a robot giving textbook answers.

2. RESPOND TO WHAT THE CHILD ACTUALLY SAID:
   - Always react directly to the specific words, thoughts, games, or stories the child mentioned.
   - Sometimes ask a simple follow-up question to naturally continue the conversation.
   - Use lively, child-friendly expressions such as:
     * "Oh, that's fun!"
     * "Really? Tell me more!"
     * "Wow, I like that!"
     * "That sounds exciting!"
     * "Nice! What happened next?"
     * "I love that idea!"
   - AVOID REPETITIVE FORMULAS: Do NOT repeat identical phrases like "That's wonderful! Tell me more!" in every response. Keep each reply spontaneous, varied, and fresh.

3. NATURAL RESPONSE LENGTH:
   - Keep normal chat responses short: strictly 1 to 3 sentences total.
   - Tailor the sentences to the child's grade (${classGrade} standard). ${complexityGuide}
   - Avoid long explanations unless the child specifically asks for one.

4. GENTLE, CONVERSATIONAL GRAMMAR CORRECTION:
   - When the child makes a grammar or phrasing mistake:
     * First respond positively and warmly.
     * Then naturally give the corrected sentence as part of the conversation.
     * Do NOT sound strict or like an examiner.
     * Example:
       Child: "I am go to school."
       BolBuddy: "Nice! 😊 You can say, 'I am going to school.' Where do you like to play at school?"
     * The correction MUST feel like a natural, caring part of the friendly dialogue.

5. EMOJIS IN VISIBLE TEXT:
   - Use friendly emojis (🌟, 😊, 👋, 🎉, ❤️, 🚀, 👍, 🎈) in your written reply to make the chat feel cheerful and expressive.
   - (Note: text-to-speech handles removing emojis for audio playback, so keep them natural in the text).

6. CHILD SAFETY & MULTILINGUAL SUPPORT:
   - Strictly NEVER ask for personal information (phone number, address, school location, passwords).
   - Keep conversations safe, inspiring, positive, and focused on English speaking confidence.
   - If the child replies in Hindi, Marathi, or mixed Hinglish, warmly understand them. If they need guidance in ${langName}, give a brief tip, but always encourage them to reply in English.

STRICT JSON RESPONSE FORMAT:
{
  "reply": "Your warm, natural, 1-3 sentence conversational response with friendly emojis. Gentle corrections woven in if applicable.",
  "praise": "Brief spontaneous praise like 'Loved your energy!' or 'Super creative!' (optional)",
  "correction": {
    "original": "Child's sentence with the mistake",
    "suggestion": "Better English way to say it",
    "explanation": "Short friendly tip"
  }, // include only if there is a real grammar/vocabulary mistake worth correcting gently
  "hindiTip": "Short tip in Hindi if child struggled (optional)",
  "marathiTip": "Short tip in Marathi if child struggled (optional)",
  "awardedXp": 15
}`;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'BolBuddy 2.0', port: PORT });
});

// 2. Chat with BolBuddy (Speaks & Roleplay)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, classGrade = '4th', preferredLanguage = 'en', scenarioId } = req.body;
    const ai = getGemini();

    if (!ai) {
      // Natural, friendly fallback responses with varied phrasing
      const friendlyFallbacks = [
        `Oh, that's fun! 🌟 You said "${message}" so nicely! What did you do next?`,
        `Wow, I like that! 😊 Tell me more about "${message}"!`,
        `That sounds exciting! 🚀 What is your favorite part about that?`,
        `Nice! 🎈 You spoke that so clearly. What else would you like to chat about?`
      ];
      const randomReply = friendlyFallbacks[Math.floor(Math.random() * friendlyFallbacks.length)];
      return res.json({
        reply: randomReply,
        praise: 'Loved your energy!',
        awardedXp: 15
      });
    }

    const systemInstruction = getSystemPrompt(classGrade, preferredLanguage, scenarioId);
    const prompt = `Child in ${classGrade} standard says: "${message}".
Please reply in JSON adhering strictly to BolBuddy's warm, friendly companion rules.`;

    const rawText = await callGeminiWithFallback(ai, {
      contents: prompt,
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.7
    });

    const parsed = parseJsonSafely(rawText, {
      reply: `Oh, that's fun! 🌟 Tell me more about that!`,
      awardedXp: 15
    });

    res.json(parsed);
  } catch (error) {
    console.warn('Handled chat fallback due to service availability:', error instanceof Error ? error.message : error);
    const errorFallbacks = [
      "Oh, that's fun! 🌟 You're practicing so nicely. What else happened?",
      "Nice! 😊 I love chatting with you. What would you like to talk about next?",
      "That sounds exciting! 🚀 You are speaking with so much confidence!"
    ];
    res.json({
      reply: errorFallbacks[Math.floor(Math.random() * errorFallbacks.length)],
      praise: "Great effort speaking up!",
      awardedXp: 10
    });
  }
});

// 3. Quick Speak (30-second speaking assessment)
app.post('/api/quick-speak', async (req, res) => {
  try {
    const { topicTitle, transcript, classGrade = '4th' } = req.body;
    const ai = getGemini();

    if (!ai) {
      return res.json({
        feedback: 'Fantastic 30 seconds! You spoke clearly and shared creative thoughts.',
        confidenceTip: 'Your speaking rhythm is getting smoother!',
        vocabularyHighlights: ['expressive words'],
        grammarImprovement: 'Keep using full sentences with cheerful energy.',
        awardedXp: 25
      });
    }

    const prompt = `The student is in ${classGrade} standard.
They were given 30 seconds to speak on the topic: "${topicTitle}".
Their spoken transcript is: "${transcript}".

Provide positive, non-judgmental child-friendly feedback in JSON:
{
  "feedback": "Encouraging praise focused on their ideas and courage",
  "confidenceTip": "A cheerful tip to boost speaking confidence",
  "vocabularyHighlights": ["list of 1-3 nice words they used"],
  "grammarImprovement": "One gentle suggestion for improvement (no harshness)",
  "awardedXp": 25
}`;

    const rawText = await callGeminiWithFallback(ai, {
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.5
    });

    const parsed = parseJsonSafely(rawText, {
      feedback: 'Great speaking practice! You shared your thoughts with confidence.',
      confidenceTip: 'Every speaking session makes you smarter and faster!',
      vocabularyHighlights: ['creative speaking'],
      grammarImprovement: 'Practice saying it once more in a loud, clear voice.',
      awardedXp: 25
    });

    res.json(parsed);
  } catch (error) {
    console.warn('Handled quick-speak fallback due to service availability:', error instanceof Error ? error.message : error);
    res.json({
      feedback: 'Great speaking practice! You shared your thoughts with confidence.',
      confidenceTip: 'Every speaking session makes you smarter and faster!',
      vocabularyHighlights: ['creative speaking'],
      grammarImprovement: 'Practice saying it once more in a loud, clear voice.',
      awardedXp: 20
    });
  }
});

// 4. Picture to Speak observation feedback
app.post('/api/picture-speak', async (req, res) => {
  try {
    const { sceneTitle, transcript, classGrade = '4th' } = req.body;
    const ai = getGemini();

    if (!ai) {
      return res.json({
        praise: `You noticed lots of wonderful things in the ${sceneTitle}! 🌟`,
        whatYouSaid: transcript,
        friendlySuggestion: `Try saying: "I can see exciting details in the ${sceneTitle}."`,
        awardedXp: 20
      });
    }

    const prompt = `Student in ${classGrade} standard was shown the picture scene: "${sceneTitle}".
The child spoke this description: "${transcript}".

Return JSON feedback for the child:
{
  "praise": "Friendly praise about what they noticed",
  "whatYouSaid": "${transcript}",
  "friendlySuggestion": "A more complete or colourful sentence they can say",
  "awardedXp": 20
}`;

    const rawText = await callGeminiWithFallback(ai, {
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.6
    });

    const parsed = parseJsonSafely(rawText, {
      praise: 'Super observation! You have sharp eyes and great imagination! 🌟',
      whatYouSaid: transcript || '',
      friendlySuggestion: `Try saying: "In this picture, there are interesting things happening."`,
      awardedXp: 20
    });

    res.json(parsed);
  } catch (error) {
    console.warn('Handled picture-speak fallback due to service availability:', error instanceof Error ? error.message : error);
    res.json({
      praise: 'Super observation! You have sharp eyes and great imagination! 🌟',
      whatYouSaid: req.body.transcript || '',
      friendlySuggestion: `Try saying: "In this picture, there are interesting things happening."`,
      awardedXp: 20
    });
  }
});

// 5. Story Builder (Collaborative story generation)
app.post('/api/story-continue', async (req, res) => {
  try {
    const { storySoFar, childTurn, classGrade = '4th' } = req.body;
    const ai = getGemini();

    if (!ai) {
      return res.json({
        nextPart: 'Suddenly, a friendly creature peeked from behind a tree and offered a golden key!',
        promptForChild: 'What do you think the golden key unlocks?',
        awardedXp: 20
      });
    }

    const prompt = `You are playing an interactive Story Builder game with a student in ${classGrade} standard.
Story so far: "${storySoFar}"
Child's exciting addition: "${childTurn}"

Continue the story with 2-3 fun sentences incorporating the child's idea, then ask the child an engaging question to decide what happens next!
Return JSON:
{
  "nextPart": "Story continuation (engaging, fun, age appropriate)",
  "promptForChild": "Exciting question prompting the child's next voice reply",
  "awardedXp": 20
}`;

    const rawText = await callGeminiWithFallback(ai, {
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.8
    });

    const parsed = parseJsonSafely(rawText, {
      nextPart: 'The journey continued across a sparkling river with talking fish!',
      promptForChild: 'What do the talking fish say to you?',
      awardedXp: 20
    });

    res.json(parsed);
  } catch (error) {
    console.warn('Handled story-continue fallback due to service availability:', error instanceof Error ? error.message : error);
    res.json({
      nextPart: 'The journey continued across a sparkling river with talking fish!',
      promptForChild: 'What do the talking fish say to you?',
      awardedXp: 20
    });
  }
});

// 6. User Profile & Progress API
app.get('/api/user/profile', (req, res) => {
  const db = loadLocalData();
  res.json({ success: true, profile: db.users?.current || null });
});

app.post('/api/user/progress', (req, res) => {
  const db = loadLocalData();
  db.users = db.users || {};
  db.users.current = {
    ...(db.users.current || {}),
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveLocalData(db);
  res.json({ success: true, profile: db.users.current });
});

// Setup Vite middleware for development or serve static build for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BolBuddy server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
