import { ClassGrade, PreferredLanguage, UserProfile } from '../types';

export interface ChatResponse {
  reply: string;
  correction?: {
    original: string;
    suggestion: string;
    explanation?: string;
  };
  praise?: string;
  hindiTip?: string;
  marathiTip?: string;
  awardedXp?: number;
}

export interface QuickSpeakResponse {
  feedback: string;
  confidenceTip: string;
  vocabularyHighlights: string[];
  grammarImprovement: string;
  awardedXp: number;
}

export interface PictureSpeakResponse {
  praise: string;
  whatYouSaid: string;
  friendlySuggestion: string;
  awardedXp: number;
}

export interface StoryContinueResponse {
  nextPart: string;
  promptForChild: string;
  awardedXp: number;
}

/**
 * Send a chat or speaking practice message to the backend server with Gemini
 */
export async function sendChatMessage(params: {
  message: string;
  classGrade: ClassGrade;
  preferredLanguage: PreferredLanguage;
  scenarioId?: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error(`Chat request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Chat API error:', err);
    // Friendly graceful fallback for children
    return {
      reply: "Great effort! 🌟 I heard you clearly. Let's keep practicing together! What else would you like to talk about?",
      awardedXp: 10
    };
  }
}

/**
 * Analyze child's 30-second Quick Speak response
 */
export async function evaluateQuickSpeak(params: {
  topicTitle: string;
  transcript: string;
  classGrade: ClassGrade;
}): Promise<QuickSpeakResponse> {
  try {
    const res = await fetch('/api/quick-speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error('Quick speak evaluation failed');
    }

    return await res.json();
  } catch (err) {
    console.error('Quick Speak API error:', err);
    return {
      feedback: 'Wonderful speaking! You spoke with great excitement and confidence! 🌟',
      confidenceTip: 'Speaking out loud is the fastest way to master English!',
      vocabularyHighlights: ['Great word choices used in your speech!'],
      grammarImprovement: 'Keep using full sentences to express your bright ideas.',
      awardedXp: 25
    };
  }
}

/**
 * Analyze child's Picture to Speak observation
 */
export async function evaluatePictureSpeak(params: {
  sceneTitle: string;
  transcript: string;
  classGrade: ClassGrade;
}): Promise<PictureSpeakResponse> {
  try {
    const res = await fetch('/api/picture-speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error('Picture speak failed');
    }

    return await res.json();
  } catch (err) {
    console.error('Picture speak API error:', err);
    return {
      praise: 'You noticed wonderful details in this picture! 🌟',
      whatYouSaid: params.transcript,
      friendlySuggestion: `Try saying: "I see bright and cheerful things in the ${params.sceneTitle}."`,
      awardedXp: 20
    };
  }
}

/**
 * Continue interactive Story Builder
 */
export async function continueStory(params: {
  storySoFar: string;
  childTurn: string;
  classGrade: ClassGrade;
}): Promise<StoryContinueResponse> {
  try {
    const res = await fetch('/api/story-continue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error('Story continue failed');
    }

    return await res.json();
  } catch (err) {
    console.error('Story continue API error:', err);
    return {
      nextPart: 'Suddenly, a bright rainbow appeared in the sky, revealing a magical path forward!',
      promptForChild: 'What do you think is at the end of the rainbow?',
      awardedXp: 20
    };
  }
}

/**
 * Save progress to backend
 */
export async function saveUserProgress(progress: Partial<UserProfile>): Promise<void> {
  try {
    await fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    });
  } catch (err) {
    console.warn('Progress sync warning:', err);
  }
}
