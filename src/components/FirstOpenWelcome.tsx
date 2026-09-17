import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2 } from 'lucide-react';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { BuddyAvatarType } from '../types';
import { sounds } from '../utils/soundEffects';
import { cleanTextForSpeech } from '../utils/speechCleaner';

interface FirstOpenWelcomeProps {
  onStart: (selectedAvatar: BuddyAvatarType) => void;
  onOpenLogin?: () => void;
}

export const FirstOpenWelcome: React.FC<FirstOpenWelcomeProps> = ({ onStart, onOpenLogin }) => {
  const [step, setStep] = useState<number>(0);
  const [selectedAvatar, setSelectedAvatar] = useState<BuddyAvatarType>('boy');

  const dialogueMessages = [
    "Hi! 👋 I'm BolBuddy!",
    "Welcome to BolBuddy! 🌟",
    "I'm here to help you speak English, play fun games and become more confident! 🚀"
  ];

  useEffect(() => {
    sounds.playPop();
    const timer1 = setTimeout(() => {
      setStep(1);
      sounds.playStarDing();
    }, 1200);

    const timer2 = setTimeout(() => {
      setStep(2);
      sounds.playStarDing();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleSpeakWelcome = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakable = cleanTextForSpeech(dialogueMessages[step] || dialogueMessages[0]);
      if (!speakable) return;
      const utterance = new SpeechSynthesisUtterance(speakable);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    sounds.playSuccess();
    onStart(selectedAvatar);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#0F172A]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_0_60px_rgba(99,102,241,0.35)] border border-indigo-500/30 text-center text-white my-auto overflow-hidden"
        >
          {/* Subtle Ambient Decorative Glows inside card */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs sm:text-sm font-bold shadow-xs mb-3">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>Your AI English Speaking Buddy</span>
          </div>

          {/* Avatar Presentation with Selector */}
          <div className="flex flex-col items-center my-2">
            <BolBuddyAvatar
              type={selectedAvatar}
              size="xl"
              mood="waving"
              className="cursor-pointer transition-transform hover:scale-105"
            />

            {/* Quick Avatar Preference Selector */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 bg-white/10 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatar('boy');
                  sounds.playPop();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAvatar === 'boy'
                    ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.7)]'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                👦 Buddy Boy
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatar('girl');
                  sounds.playPop();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAvatar === 'girl'
                    ? 'bg-pink-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.7)]'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                👧 Buddy Girl
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatar('robot');
                  sounds.playPop();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAvatar === 'robot'
                    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.7)]'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                🤖 Robo Buddy
              </button>
            </div>
          </div>

          {/* Speech Bubble with Typing / Sequence Animation */}
          <div className="relative my-4 min-h-[85px] flex items-center justify-center">
            <div className="w-full bg-white/10 border border-white/15 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 shadow-lg relative">
              {/* Speech bubble pointy arrow */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white/15"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between gap-3 text-left"
                >
                  <p className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug font-heading">
                    {dialogueMessages[step]}
                  </p>

                  <button
                    type="button"
                    onClick={handleSpeakWelcome}
                    title="Listen aloud"
                    className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 border border-white/10 transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Features Checklist for Kids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-3 text-xs font-bold">
            <div className="bg-white/5 border border-white/10 text-indigo-200 rounded-xl p-2 sm:p-2.5">
              🗣️ Speaking Practice
            </div>
            <div className="bg-white/5 border border-white/10 text-emerald-200 rounded-xl p-2 sm:p-2.5">
              🎮 Fun Mini-Games
            </div>
            <div className="bg-white/5 border border-white/10 text-amber-200 rounded-xl p-2 sm:p-2.5">
              ⭐ Earn Stars & XP
            </div>
          </div>

          {/* Big Friendly CTA Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full mt-2 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-rose-400 hover:from-yellow-300 hover:to-orange-300 text-slate-950 font-black text-lg sm:text-xl shadow-[0_0_25px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <span>Let's Start</span>
            <span className="text-xl sm:text-2xl">🚀</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          {/* Already have an account link */}
          {onOpenLogin && (
            <div className="mt-3 pt-2 text-center border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onOpenLogin();
                }}
                className="text-xs font-bold text-slate-300 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                Already have a Buddy PIN? <span className="text-yellow-400 underline ml-1">Log in here 🔑</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
