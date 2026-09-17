import React, { useState } from 'react';
import { Target, BookOpen, Volume2, ArrowRight } from 'lucide-react';
import { ClassGrade } from '../types';
import { WordMatchGame } from './WordMatchGame';
import { SentenceGame } from './SentenceGame';
import { PronunciationPractice } from './PronunciationPractice';
import { sounds } from '../utils/soundEffects';

interface GamesHubProps {
  classGrade: ClassGrade;
  onEarnXp: (xp: number, activityName: string) => void;
  onBack: () => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ classGrade, onEarnXp, onBack }) => {
  const [activeGame, setActiveGame] = useState<'hub' | 'match' | 'sentence' | 'pronunciation'>('hub');

  if (activeGame === 'match') {
    return (
      <WordMatchGame
        classGrade={classGrade}
        onEarnXp={onEarnXp}
        onClose={() => setActiveGame('hub')}
      />
    );
  }

  if (activeGame === 'sentence') {
    return (
      <SentenceGame
        classGrade={classGrade}
        onEarnXp={onEarnXp}
        onClose={() => setActiveGame('hub')}
      />
    );
  }

  if (activeGame === 'pronunciation') {
    return (
      <PronunciationPractice
        classGrade={classGrade}
        onEarnXp={onEarnXp}
        onClose={() => setActiveGame('hub')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header Banner - Light Child-Friendly Theme */}
      <div className="bg-gradient-to-br from-emerald-100/90 via-teal-50/90 to-sky-100/80 rounded-3xl p-5 sm:p-6 md:p-8 text-slate-800 shadow-sm relative overflow-hidden border border-emerald-200/80 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2 shadow-xs">
              Play & Learn Hub
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-heading bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-800">
              Fun English Games 🎮
            </h1>
            <p className="text-xs md:text-sm text-slate-600 font-semibold mt-1">
              Level up your vocabulary, sentence structure, and spoken clarity through play!
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-bold border border-emerald-200 text-xs shadow-xs cursor-pointer transition-all shrink-0"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* 3 Game Cards - Light Pastel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Game 1: Word Match */}
        <div
          onClick={() => {
            sounds.playPop();
            setActiveGame('match');
          }}
          className="p-6 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-heading mb-1 group-hover:text-emerald-700 transition-colors">
              Word Match Game 🎯
            </h3>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              Match words with their colorful emojis and pictures. Builds rapid vocabulary recall!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-black text-xs">
            <span>Play Now (+25 Coins)</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Game 2: Complete the Sentence */}
        <div
          onClick={() => {
            sounds.playPop();
            setActiveGame('sentence');
          }}
          className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-3 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-heading mb-1 group-hover:text-sky-700 transition-colors">
              Complete the Sentence ✍️
            </h3>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              Pick the right verb, tense, or pronoun to complete the sentence. With child-friendly tips!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sky-700 font-black text-xs">
            <span>Play Now (+30 Coins)</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Game 3: Pronunciation Practice */}
        <div
          onClick={() => {
            sounds.playPop();
            setActiveGame('pronunciation');
          }}
          className="p-6 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center mb-3 shadow-md shadow-pink-200 group-hover:scale-110 transition-transform">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-heading mb-1 group-hover:text-pink-700 transition-colors">
              Pronunciation Practice 🗣️
            </h3>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              Listen to tricky English words broken down by syllables, then repeat them clearly into the mic!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-pink-700 font-black text-xs">
            <span>Play Now (+15 Coins)</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
