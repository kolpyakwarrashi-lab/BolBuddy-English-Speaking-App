import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, Award, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { PRONUNCIATION_WORDS } from '../data/learningContent';
import { ClassGrade } from '../types';
import { VoiceButton } from './VoiceButton';
import { sounds } from '../utils/soundEffects';
import { cleanTextForSpeech } from '../utils/speechCleaner';

interface PronunciationPracticeProps {
  classGrade: ClassGrade;
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  classGrade,
  onEarnXp,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [spokenWord, setSpokenWord] = useState('');
  const [score, setScore] = useState(0);

  const wordObj = PRONUNCIATION_WORDS[currentIndex];

  const handleListen = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakable = cleanTextForSpeech(wordObj.word);
      if (!speakable) return;
      const utterance = new SpeechSynthesisUtterance(speakable);
      utterance.rate = 0.75; // Slower so kids can catch syllables clearly!
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceTranscript = (cleaned: string) => {
    setSpokenWord(cleaned);
    setHasSpoken(true);
    sounds.playSuccess();
    setScore((s) => s + 1);

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      // Ignore
    }
    onEarnXp(15, 'Clear Pronunciation');
  };

  const handleNextWord = () => {
    sounds.playPop();
    setHasSpoken(false);
    setSpokenWord('');
    setCurrentIndex((prev) => (prev + 1) % PRONUNCIATION_WORDS.length);
  };

  return (
    <div className="bg-[#0F172A]/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.2)] max-w-2xl mx-auto my-4 text-center text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center justify-center font-black">
            <Volume2 className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-white font-heading">Pronunciation Practice 🗣️</h2>
            <p className="text-xs font-semibold text-slate-300">Listen clearly and speak like a champion!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-400/30">
            {currentIndex + 1} / {PRONUNCIATION_WORDS.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/10 cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Big Word Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-950/60 via-rose-950/50 to-indigo-950/60 border border-pink-400/30 shadow-lg relative">
          <span className="text-xs font-black uppercase tracking-wider text-pink-400 mb-2 block">
            Target Word
          </span>
          <h3 className="text-4xl md:text-5xl font-black text-white font-heading tracking-tight">
            {wordObj.word}
          </h3>

          {/* Phonetic breakdown & Tips */}
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <div className="px-4 py-1.5 rounded-2xl bg-white/10 border border-pink-400/30 text-pink-200 font-black text-sm shadow-2xs">
              Syllables: {wordObj.phonetic}
            </div>
            <div className="text-xs font-semibold text-slate-300 italic mt-1">
              💡 Tip: {wordObj.tip}
            </div>
          </div>

          {/* Large Listen Button */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleListen}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Listen First 🔊</span>
            </button>
          </div>
        </div>

        {/* Child speaking action */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-300">
            Now tap the mic and repeat: <span className="underline font-black text-pink-300">"{wordObj.word}"</span>!
          </p>

          <VoiceButton onTranscript={handleVoiceTranscript} selectedLanguage="en" />

          {hasSpoken && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-left space-y-1 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-emerald-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>You spoke: "{spokenWord || wordObj.word}"!</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
                  <span>🪙</span>
                  <span>+15 Coins</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-emerald-200/90">
                🌟 Outstanding clarity! BolBuddy loves how confident your voice sounded!
              </p>
            </motion.div>
          )}
        </div>

        {hasSpoken && (
          <button
            type="button"
            onClick={handleNextWord}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-base shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Next Word</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
