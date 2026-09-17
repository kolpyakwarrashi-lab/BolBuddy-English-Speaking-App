import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { BookOpen, CheckCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { SENTENCE_PUZZLES } from '../data/learningContent';
import { ClassGrade } from '../types';
import { sounds } from '../utils/soundEffects';

interface SentenceGameProps {
  classGrade: ClassGrade;
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const SentenceGame: React.FC<SentenceGameProps> = ({
  classGrade,
  onEarnXp,
  onClose
}) => {
  // Filter puzzles matching class or fallback to all
  const filteredPuzzles = SENTENCE_PUZZLES.filter((p) => p.targetClass.includes(classGrade));
  const puzzles = filteredPuzzles.length > 0 ? filteredPuzzles : SENTENCE_PUZZLES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentPuzzle = puzzles[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedIndex(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentPuzzle.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playGentleBeep();
    }
  };

  const handleNext = () => {
    sounds.playPop();
    if (currentIndex + 1 < puzzles.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {
        // Ignore
      }
      onEarnXp(score * 10 + 10, 'Grammar Explorer');
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setHasAnswered(false);
    setScore(0);
    setIsFinished(false);
    sounds.playPop();
  };

  return (
    <div className="bg-[#0F172A]/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-sky-500/30 shadow-[0_0_50px_rgba(14,165,233,0.2)] max-w-2xl mx-auto my-4 text-center text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-black">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-white font-heading">Complete the Sentence ✍️</h2>
            <p className="text-xs font-semibold text-slate-300">Pick the best word to complete the thought!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full border border-sky-400/30">
            {currentIndex + 1} / {puzzles.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/10 cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Question Sentence Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/70 via-indigo-950/60 to-slate-900/80 border border-sky-400/30 shadow-lg">
            <p className="text-2xl md:text-3xl font-black text-white leading-snug tracking-tight">
              {currentPuzzle.sentence.split('___').map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span>{part}</span>
                  {i < arr.length - 1 && (
                    <span className="inline-block mx-2 px-4 py-1 rounded-xl bg-indigo-500/30 text-yellow-300 border border-yellow-400/50 font-black shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                      {hasAnswered && selectedIndex !== null ? currentPuzzle.options[selectedIndex] : '___'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* 4 Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPuzzle.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = selectedIndex === idx;
              const isCorrect = idx === currentPuzzle.correctIndex;

              let btnStyle = 'border-white/10 bg-white/5 hover:border-sky-400/40 text-white';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
                } else if (isSelected) {
                  btnStyle = 'border-rose-400 bg-rose-500/20 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
                } else {
                  btnStyle = 'border-white/5 bg-white/5 text-slate-500 opacity-40';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border font-black text-lg transition-all flex items-center gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xs font-black text-indigo-200">
                    {letter}
                  </span>
                  <span>{opt}</span>
                  {hasAnswered && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Friendly Explanation Card */}
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl text-left border ${
                selectedIndex === currentPuzzle.correctIndex
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : 'bg-sky-950/70 border-sky-500/40 text-sky-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {selectedIndex === currentPuzzle.correctIndex ? '🎉 Spot on!' : '💡 Good Try! BolBuddy Tip:'}
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                {currentPuzzle.explanation}
              </p>
            </motion.div>
          )}

          {hasAnswered && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-lg shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < puzzles.length ? 'Next Sentence' : 'View Results'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        /* Results Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-6 space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏅
          </div>
          <h3 className="text-2xl font-black text-white font-heading">Grammar Adventure Completed!</h3>
          <p className="text-sm font-semibold text-slate-300">
            You scored {score} out of {puzzles.length}! Every sentence makes your English stronger.
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 font-black text-lg">
            <span className="text-xl">🪙</span>
            <span>+{score * 10 + 10} Coins Awarded</span>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <button
              type="button"
              onClick={restart}
              className="px-6 py-3 rounded-2xl border border-sky-400/30 text-sky-300 font-bold hover:bg-sky-500/10 text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(14,165,233,0.4)] cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
