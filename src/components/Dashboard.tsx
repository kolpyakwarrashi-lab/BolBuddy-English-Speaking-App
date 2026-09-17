import React from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  Gamepad2,
  Theater,
  BookOpen,
  Brain,
  Zap,
  Calendar,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Volume2,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { WORD_OF_THE_DAY_LIST } from '../data/learningContent';
import { sounds } from '../utils/soundEffects';
import { cleanTextForSpeech } from '../utils/speechCleaner';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: string) => void;
  onOpenWordOfDay: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onNavigate,
  onOpenWordOfDay
}) => {
  const todayWord = WORD_OF_THE_DAY_LIST[new Date().getDate() % WORD_OF_THE_DAY_LIST.length];

  const handleSpeakWord = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakable = cleanTextForSpeech(todayWord.word);
      if (!speakable) return;
      const utterance = new SpeechSynthesisUtterance(speakable);
      utterance.rate = 0.85;
      utterance.pitch = 1.15;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* 1. Hero Greeting Banner with Animated BolBuddy - Light Cheerful Pastel */}
      <div className="bg-gradient-to-br from-purple-100/90 via-indigo-50/90 to-sky-100/80 rounded-3xl p-6 md:p-8 text-slate-800 shadow-sm relative overflow-hidden border border-purple-200/80 backdrop-blur-xl">
        {/* Ambient subtle decorative particles */}
        <div className="absolute top-2 right-12 text-5xl opacity-30 pointer-events-none select-none animate-pulse">
          ✨
        </div>
        <div className="absolute bottom-1 right-32 text-4xl opacity-20 pointer-events-none select-none">
          🎈
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-purple-200 backdrop-blur-sm text-purple-800 text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.classGrade} Standard English Journey</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-indigo-700 to-pink-600">
              Welcome back, {user.name}! 🌟
            </h1>

            <p className="text-sm md:text-base font-semibold text-slate-600 max-w-lg leading-relaxed">
              I'm so happy to see you today! Let's practice speaking, explore new stories, and earn shiny trophies!
            </p>

            {/* Daily Goal card */}
            <div className="mt-4 inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-200/80 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                  Today's Friendly Goal
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Speak 5 sentences with BolBuddy & play 1 game
                </span>
              </div>
            </div>
          </div>

          {/* Animated BolBuddy Character Hero */}
          <div className="flex flex-col items-center shrink-0">
            <BolBuddyAvatar
              type={user.avatarType}
              size="lg"
              mood="waving"
              className="hover:scale-105 transition-transform drop-shadow-md"
            />
            <button
              type="button"
              onClick={() => {
                sounds.playSuccess();
                onNavigate('chat');
              }}
              className="mt-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm shadow-md shadow-amber-200/60 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>Talk with Me! 🎤</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Streak & Word of the Day strip - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak & XP Tile */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 text-orange-500 flex items-center justify-center font-black">
              <Flame className="w-7 h-7 fill-orange-500 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Consistency</span>
              <h3 className="text-lg font-black text-slate-800 font-heading">
                {user.streak} Days Streak 🔥
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase">Level</span>
            <div className="font-black text-purple-700 text-base">Level {user.level}</div>
          </div>
        </div>

        {/* Word of the Day interactive tile */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-white border border-purple-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center text-2xl font-black shrink-0">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-purple-700 tracking-wider">Word of the Day</span>
                <span className="text-lg font-serif italic text-purple-950 font-bold">{todayWord.word}</span>
                <button
                  type="button"
                  onClick={handleSpeakWord}
                  className="p-1 text-purple-600 hover:text-purple-800 cursor-pointer transition-colors"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-1 italic">
                "{todayWord.meaning}"
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWordOfDay}
            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span>Practice Word</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-700" />
          </button>
        </div>
      </div>

      {/* 3. Core Feature Adventure Hub - Child-Friendly Light Pastel Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Fun English Adventures 🚀
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Pick an activity to speak, play games, and boost your confidence!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Speak with BolBuddy */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playPop();
              onNavigate('chat');
            }}
            className="p-6 rounded-3xl bg-white hover:bg-indigo-50/40 border border-indigo-100 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-200 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-700 font-heading">
                Speak with BolBuddy 🗣️
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Talk about your day, hobbies, friends, or ask homework questions. BolBuddy speaks back!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-indigo-700 font-black text-xs">
              <span>Voice-First Practice</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Play & Learn Games */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playPop();
              onNavigate('games');
            }}
            className="p-6 rounded-3xl bg-white hover:bg-teal-50/40 border border-teal-100 hover:border-teal-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mb-3 shadow-md shadow-teal-200 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-teal-700 font-heading">
                Play & Learn Games 🎮
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Word Match, Complete the Sentence puzzles, and Pronunciation mastery drills!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-teal-700 font-black text-xs">
              <span>3 Mini-Games Included</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: Practice Scenarios */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playPop();
              onNavigate('scenarios');
            }}
            className="p-6 rounded-3xl bg-white hover:bg-orange-50/40 border border-orange-100 hover:border-orange-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-3 shadow-md shadow-orange-200 group-hover:scale-110 transition-transform">
                <Theater className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-orange-700 font-heading">
                Practice Scenarios 🎭
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Shopping, restaurant, airport, birthday party, and doctor clinic roleplays!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-orange-700 font-black text-xs">
              <span>10 Real-Life Situations</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 4: Story Builder */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playPop();
              onNavigate('story');
            }}
            className="p-6 rounded-3xl bg-white hover:bg-purple-50/40 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-3 shadow-md shadow-purple-200 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-purple-700 font-heading">
                Story Builder 📖
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                BolBuddy starts a magical tale, you speak the next part, and we build an adventure together!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-purple-700 font-black text-xs">
              <span>Interactive Storytelling</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 5: Memory Boost */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playPop();
              onNavigate('memory');
            }}
            className="p-6 rounded-3xl bg-white hover:bg-emerald-50/40 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-emerald-700 font-heading">
                Memory Boost 🧠
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                "Remember & Speak" — memorize hidden objects and speak full sentences to train your brain!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-black text-xs">
              <span>Brain & Speech Training</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 6: Quick Speak */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playPop();
              onNavigate('quickspeak');
            }}
            className="p-6 rounded-3xl bg-white hover:bg-amber-50/40 border border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-md shadow-amber-200 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-amber-700 font-heading">
                Quick Speak ⚡
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Speak on a fun topic for 30 seconds. Get star confidence, vocabulary & grammar feedback!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-amber-700 font-black text-xs">
              <span>30-Sec Speaking Challenge</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 7: Picture to Speak */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playPop();
              onNavigate('picturespeak');
            }}
            className="p-6 rounded-3xl bg-white hover:bg-sky-50/40 border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group sm:col-span-2 lg:col-span-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl shadow-md shadow-sky-200 group-hover:scale-110 transition-transform shrink-0">
                  📸
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-heading group-hover:text-sky-700">
                    Picture to Speak 🏞️
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-1 max-w-xl">
                    Look at fun colorful scenes like the park, zoo, and space station. Tell BolBuddy what you observe!
                  </p>
                </div>
              </div>

              <span className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black shrink-0 flex items-center gap-1.5 shadow-xs transition-all">
                <span>Start Observation</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
