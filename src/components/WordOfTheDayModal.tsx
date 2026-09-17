import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, Check, Award, X } from 'lucide-react';
import { WORD_OF_THE_DAY_LIST } from '../data/learningContent';
import { ClassGrade } from '../types';
import { VoiceButton } from './VoiceButton';
import { sounds } from '../utils/soundEffects';
import { cleanTextForSpeech } from '../utils/speechCleaner';

interface WordOfTheDayModalProps {
  classGrade: ClassGrade;
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const WordOfTheDayModal: React.FC<WordOfTheDayModalProps> = ({
  classGrade,
  onEarnXp,
  onClose
}) => {
  // Pick word corresponding to day or class grade
  const todayIndex = new Date().getDate() % WORD_OF_THE_DAY_LIST.length;
  const wordItem = WORD_OF_THE_DAY_LIST[todayIndex];

  const [hasPracticed, setHasPracticed] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isSpeakingAloud, setIsSpeakingAloud] = useState(false);

  const handleSpeakAloud = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakable = cleanTextForSpeech(textToSpeak);
      if (!speakable) return;
      const utterance = new SpeechSynthesisUtterance(speakable);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsSpeakingAloud(true);
      utterance.onend = () => setIsSpeakingAloud(false);
      utterance.onerror = () => setIsSpeakingAloud(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTranscript = (cleaned: string) => {
    setSpokenTranscript(cleaned);
    setHasPracticed(true);
    sounds.playSuccess();
    try {
      confetti({ particleCount: 60, spread: 50 });
    } catch {
      // Ignore
    }
    onEarnXp(20, 'Word of the Day Repeat');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-purple-200/80 relative text-center text-slate-800 my-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-slate-500 border border-purple-200 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Word of the Day ⭐</span>
        </div>

        {/* Word Display */}
        <div className="my-3">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            {wordItem.word}
          </h2>
          <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
            <span>🗣️ {wordItem.pronunciation}</span>
            <button
              type="button"
              onClick={() => handleSpeakAloud(wordItem.word)}
              className="p-1 hover:text-purple-600 transition-colors cursor-pointer"
              title="Pronounce word"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meaning & Hindi/Marathi translations */}
        <div className="my-5 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-left space-y-2.5">
          <div>
            <span className="text-xs font-black text-purple-800 block uppercase tracking-wider">📖 Meaning:</span>
            <p className="text-sm font-bold text-slate-800">{wordItem.meaning}</p>
          </div>

          <div className="pt-2 border-t border-purple-100 flex flex-wrap gap-3 text-xs text-slate-600 font-medium">
            {wordItem.hindiMeaning && <div>🇮🇳 हिंदी: <span className="font-bold text-purple-900">{wordItem.hindiMeaning}</span></div>}
            {wordItem.marathiMeaning && <div>🇮🇳 मराठी: <span className="font-bold text-purple-900">{wordItem.marathiMeaning}</span></div>}
          </div>

          <div className="pt-2 border-t border-purple-100">
            <span className="text-xs font-black text-purple-800 block uppercase tracking-wider">🗣️ Example:</span>
            <p className="text-xs md:text-sm font-semibold text-slate-700 italic">
              "{wordItem.exampleSentence}"
            </p>
          </div>
        </div>

        {/* Listen Sentence Button */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => handleSpeakAloud(`${wordItem.word}. ${wordItem.exampleSentence}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-800 font-black text-xs transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-purple-700" />
            <span>Listen Sentence Aloud 🔊</span>
          </button>
        </div>

        {/* Ask Child to Repeat & Speak */}
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-left space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">Now You Repeat! 🎤</h4>
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>+20 XP</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Tap the mic below and say: <span className="font-bold text-purple-900">"{wordItem.word}"</span> or the full example sentence!
          </p>

          <VoiceButton onTranscript={handleTranscript} selectedLanguage="en" />

          {hasPracticed && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-bold shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Awesome repetition! "{spokenTranscript || wordItem.word}"</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-base shadow-md shadow-amber-200 hover:scale-[1.02] transition-transform cursor-pointer"
        >
          Done for Today! 🌟
        </button>
      </motion.div>
      </div>
    </div>
  );
};
