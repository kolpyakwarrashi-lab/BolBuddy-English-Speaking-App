export type ClassGrade = '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th';

export type PreferredLanguage = 'en' | 'hi' | 'mr';

export type BuddyAvatarType = 'boy' | 'girl' | 'robot';

export interface UserProfile {
  id: string;
  name: string;
  classGrade: ClassGrade;
  preferredLanguage: PreferredLanguage;
  avatarType: BuddyAvatarType;
  xp: number;
  streak: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date | string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  cleanedText?: string;
  timestamp: Date | number | string;
  correction?: {
    original: string;
    suggestion: string;
    explanation?: string;
  };
  praise?: string;
  hindiTip?: string;
  marathiTip?: string;
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: string;
  firstMessage: string;
  starterPrompt?: string;
  recommendedGrade: string;
  targetGrades?: ClassGrade[];
}

export interface SentencePuzzle {
  id: string;
  sentence: string; // e.g., "I ___ to school every day."
  options: string[];
  correctIndex: number;
  explanation: string;
  targetClass: ClassGrade[];
}

export interface PictureScene {
  id: string;
  title: string;
  emoji: string;
  description: string;
  sampleThingsToNotice: string[];
  recommendedVocabulary: string[];
}

export interface QuickSpeakTopic {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  durationSeconds: number;
  starterHints: string[];
}

export interface WordOfTheDayItem {
  word: string;
  phonetic?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  meaning: string;
  meaningHindi?: string;
  hindiMeaning?: string;
  meaningMarathi?: string;
  marathiMeaning?: string;
  exampleSentence?: string;
  example?: string;
  funTip?: string;
}
