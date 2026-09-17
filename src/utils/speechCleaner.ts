/**
 * Speech Recognition Text Cleaner & Punctuation Normalizer for BolBuddy
 * Converts spoken punctuation commands ("comma", "full stop", "question mark")
 * into proper typographical punctuation without altering genuine vocabulary.
 */

export function cleanSpeechTranscript(rawTranscript: string): string {
  if (!rawTranscript || typeof rawTranscript !== 'string') return '';

  let text = rawTranscript.trim();

  // Handle common compound spoken punctuation first
  // E.g., "full stop", "question mark", "exclamation mark", "exclamation point"
  text = text.replace(/\b(?:full\s*stop|period)\b/gi, '.');
  text = text.replace(/\b(?:question\s*mark)\b/gi, '?');
  text = text.replace(/\b(?:exclamation\s*(?:mark|point))\b/gi, '!');
  text = text.replace(/\b(?:semicolon|semi-colon)\b/gi, ';');

  // Handle single-word punctuation commands:
  // "comma", "colon"
  // Avoid replacing when part of common compound phrases like "comma-shaped" or "time period"
  text = text.replace(/\bcomma\b(?!\s*shaped)/gi, ',');
  text = text.replace(/\bcolon\b(?!\s*cancer|\s*surgery)/gi, ':');

  // Hindi / Marathi voice recognition artifacts
  text = text.replace(/\b(?:पूर्णविराम|पूर्ण विराम)\b/gi, '.');
  text = text.replace(/\b(?:अल्पविराम|अल्प विराम|कॉमा)\b/gi, ',');
  text = text.replace(/\b(?:प्रश्नचिन्ह|प्रश्न चिन्ह)\b/gi, '?');

  // Normalize spaces around punctuation:
  // Remove space before punctuation: "word ," -> "word,"
  text = text.replace(/\s+([.,!?:;])/g, '$1');

  // Ensure single space after punctuation: "word,next" -> "word, next"
  text = text.replace(/([.,!?:;])(?=[^\s\d])/g, '$1 ');

  // Collapse multiple consecutive spaces
  text = text.replace(/\s{2,}/g, ' ');

  // Clean trailing punctuation duplicates, e.g. ".. " -> ". "
  text = text.replace(/\.{2,}/g, '.');
  text = text.replace(/,{2,}/g, ',');

  // Capitalize the first letter of each sentence
  text = capitalizeSentences(text.trim());

  return text;
}

/**
 * Capitalizes the start of each sentence.
 */
export function capitalizeSentences(str: string): string {
  if (!str) return '';
  // Capitalize very first character
  let result = str.charAt(0).toUpperCase() + str.slice(1);

  // Capitalize characters following sentence delimiters (. ! ?)
  result = result.replace(/([.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());

  return result;
}

/**
 * Speech Synthesis Text Cleaner for BolBuddy
 * Converts AI-generated text or message text into an emoji-free,
 * decoration-free, natural speech string for SpeechSynthesis / TTS.
 *
 * Rules:
 * 1. Emojis and decorative Unicode symbols are removed so they are NEVER spoken aloud.
 * 2. Words, letters, and natural English punctuation (. , ? ! ' -) are preserved.
 * 3. XP reward numbers ("15 XP"), JSON field names ("reply", "awardedXp"), UI labels,
 *    and markdown syntax are converted or removed so the voice speaks ONLY the main conversational dialogue.
 * 4. Does NOT modify visible chat messages in the UI.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let speech = text;

  // 1. If text is a serialized JSON object or JSON string, extract the conversational reply
  try {
    const trimmed = speech.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        speech = parsed.reply || parsed.suggestion || parsed.text || speech;
      }
    }
  } catch {
    // Continue processing raw string
  }

  // 2. Remove JSON field names and syntax artifacts if any leaked into the string
  speech = speech.replace(/"?(?:reply|praise|correction|suggestion|explanation|hindiTip|marathiTip|awardedXp)"?\s*:\s*/gi, ' ');
  speech = speech.replace(/[{}[\]"]/g, ' ');

  // 3. Handle XP / technical gamification rewards:
  // e.g., "Great job! 🌟 You earned 15 XP! 🎉" -> "Great job! You did really well!"
  // "You earned 20 XP!" -> "You did really well!"
  // Standalone "+15 XP" or "15 XP" -> removed so voice stays conversational
  speech = speech.replace(
    /(?:you(?:'ve|\s+have)?\s+earned|earned|you\s+got)\s+\+?\d+\s*(?:xp|coins|points|stars)[!.]*/gi,
    'You did really well!'
  );
  speech = speech.replace(/\+?\b\d+\s*(?:xp|coins|points|stars)\b[!.]*/gi, '');

  // 4. Remove UI/schema keywords that shouldn't be read aloud
  speech = speech.replace(/\b(?:awardedXp|praise|correction)\b/gi, '');

  // 5. Remove markdown formatting (bold, italic, code blocks, links, headers, quotes)
  speech = speech.replace(/```[\s\S]*?```/g, '');
  speech = speech.replace(/`([^`]+)`/g, '$1');
  speech = speech.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  speech = speech.replace(/[*#_~|]/g, '');
  speech = speech.replace(/^\s*>\s*/gm, '');

  // 6. Remove all emojis and decorative symbols
  // \p{Extended_Pictographic} handles modern Unicode emojis (faces, gestures, stars, hearts, food, animals, etc.)
  speech = speech.replace(/\p{Extended_Pictographic}/gu, '');

  // Supplementary Unicode emoji, pictograph, dingbat, symbol, and regional indicator flag blocks:
  speech = speech.replace(
    /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu,
    ''
  );

  // Decorative glyphs, bullets, geometric shapes, arrows, decorative stars
  speech = speech.replace(/[•★☆◆◇▲△▼▽►◄▼▶◀▪▫○●■□✓✔✕✖✗✘※✦✧♪♫♬…—–]/g, ' ');

  // 7. Clean up whitespace and preserve natural punctuation (. , ? ! ' -)
  // Remove space before punctuation: "Great job !" -> "Great job!"
  speech = speech.replace(/\s+([.,!?:;])/g, '$1');

  // Ensure space after punctuation when followed by a letter or number: "Good.Next" -> "Good. Next"
  speech = speech.replace(/([.,!?:;])(?=[A-Za-z0-9])/g, '$1 ');

  // Normalize duplicate punctuation: "!!" -> "!", "??" -> "?", ".." -> "."
  speech = speech.replace(/([.!?]){2,}/g, '$1');
  speech = speech.replace(/,{2,}/g, ',');

  // Collapse consecutive spaces into a single space
  speech = speech.replace(/\s{2,}/g, ' ');

  return speech.trim();
}
