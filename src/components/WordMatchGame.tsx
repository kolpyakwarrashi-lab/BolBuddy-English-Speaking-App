import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Target, Check, RotateCcw, Award } from 'lucide-react';
import { WORD_MATCH_SETS } from '../data/learningContent';
import { ClassGrade } from '../types';
import { sounds } from '../utils/soundEffects';

interface WordMatchGameProps {
  classGrade: ClassGrade;
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const WordMatchGame: React.FC<WordMatchGameProps> = ({
  classGrade,
  onEarnXp,
  onClose
}) => {
  // Select word set based on grade difficulty
  const difficulty = ['2nd', '3rd', '4th'].includes(classGrade)
    ? 'junior'
    : ['5th', '6th'].includes(classGrade)
    ? 'middle'
    : 'senior';

  const dataset = WORD_MATCH_SETS[difficulty];

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Separate words and emojis shuffled
  const [shuffledWords] = useState(() => [...dataset].map((d) => d.word).sort(() => 0.5 - Math.random()));
  const [shuffledEmojis] = useState(() => [...dataset].map((d) => ({ word: d.word, emoji: d.emoji })).sort(() => 0.5 - Math.random()));

  const handleSelectWord = (word: string) => {
    if (matchedWords.includes(word)) return;
    sounds.playPop();
    setSelectedWord(word);

    if (selectedEmoji) {
      checkMatch(word, selectedEmoji);
    }
  };

  const handleSelectEmoji = (emojiObj: { word: string; emoji: string }) => {
    if (matchedWords.includes(emojiObj.word)) return;
    sounds.playPop();
    setSelectedEmoji(emojiObj.word);

    if (selectedWord) {
      checkMatch(selectedWord, emojiObj.word);
    }
  };

  const checkMatch = (word: string, emojiWord: string) => {
    if (word === emojiWord) {
      // Correct match!
      sounds.playSuccess();
      const updated = [...matchedWords, word];
      setMatchedWords(updated);
      setSelectedWord(null);
      setSelectedEmoji(null);

      if (updated.length === dataset.length) {
        setIsCompleted(true);
        try {
          confetti({ particleCount: 80, spread: 70 });
        } catch {
          // Ignore
        }
        onEarnXp(25, 'Word Match Champion');
      }
    } else {
      // Gentle mismatch feedback
      sounds.playGentleBeep();
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedEmoji(null);
      }, 500);
    }
  };

  const resetGame = () => {
    setMatchedWords([]);
    setSelectedWord(null);
    setSelectedEmoji(null);
    setIsCompleted(false);
    sounds.playPop();
  };

  return (
    <div className="bg-[#0F172A]/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] max-w-2xl mx-auto my-4 text-center text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-black">
            <Target className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-white font-heading">Word Match Game 🎯</h2>
            <p className="text-xs font-semibold text-slate-300">
              Match each English word with its picture! ({difficulty.toUpperCase()} Level)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/10 cursor-pointer"
        >
          Back
        </button>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          <p className="text-xs font-bold text-slate-400">
            Tap a word on the left, then tap its matching picture on the right!
          </p>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {/* Left: Words Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">Words</h3>
              {shuffledWords.map((word) => {
                const isMatched = matchedWords.includes(word);
                const isSelected = selectedWord === word;
                return (
                  <button
                    key={word}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectWord(word)}
                    className={`w-full p-4 rounded-2xl border font-black text-base transition-all flex items-center justify-between cursor-pointer ${
                      isMatched
                        ? 'border-emerald-400/40 bg-emerald-950/40 text-emerald-300 opacity-60'
                        : isSelected
                        ? 'border-emerald-400 bg-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-102 text-emerald-200'
                        : 'border-white/10 bg-white/5 hover:border-emerald-400/40 text-white'
                    }`}
                  >
                    <span>{word}</span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Right: Emojis / Pictures Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">Pictures</h3>
              {shuffledEmojis.map((item) => {
                const isMatched = matchedWords.includes(item.word);
                const isSelected = selectedEmoji === item.word;
                return (
                  <button
                    key={item.word}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectEmoji(item)}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                      isMatched
                        ? 'border-emerald-400/40 bg-emerald-950/40 opacity-60'
                        : isSelected
                        ? 'border-emerald-400 bg-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-102'
                        : 'border-white/10 bg-white/5 hover:border-emerald-400/40'
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-400 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-6 space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🌟
          </div>
          <h3 className="text-2xl font-black text-white font-heading">Super Matching Skills!</h3>
          <p className="text-sm font-semibold text-slate-300">
            You matched all words with their pictures! Your vocabulary is growing fast!
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-black text-lg">
            <span className="text-xl">🪙</span>
            <span>+25 Coins Earned</span>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <button
              type="button"
              onClick={resetGame}
              className="px-6 py-3 rounded-2xl border border-emerald-400/30 text-emerald-300 font-bold hover:bg-emerald-500/10 text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
