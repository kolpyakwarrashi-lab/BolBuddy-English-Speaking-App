import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Brain, ArrowRight, RotateCcw, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { MEMORY_ITEMS_POOL } from '../data/learningContent';
import { VoiceButton } from './VoiceButton';
import { sounds } from '../utils/soundEffects';

interface MemoryGameProps {
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onEarnXp, onClose }) => {
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'speak' | 'completed'>('memorize');
  const [countdown, setCountdown] = useState<number>(5);
  const [targetItems, setTargetItems] = useState<typeof MEMORY_ITEMS_POOL>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [spokenSentence, setSpokenSentence] = useState<string>('');

  // Select 5 random items from pool
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const shuffled = [...MEMORY_ITEMS_POOL].sort(() => 0.5 - Math.random());
    const chosen = shuffled.slice(0, 5);
    setTargetItems(chosen);
    setSelectedIds([]);
    setSpokenSentence('');
    setPhase('memorize');
    setCountdown(5);
    sounds.playPop();
  };

  // 5-second countdown timer for memorizing
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
        sounds.playPop();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase('recall');
      sounds.playStarDing();
    }
  }, [phase, countdown]);

  const toggleSelect = (id: string) => {
    sounds.playPop();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleFinishRecall = () => {
    sounds.playSuccess();
    setPhase('speak');
  };

  const handleVoiceTranscript = (cleaned: string) => {
    setSpokenSentence(cleaned);
    sounds.playStarDing();
  };

  const handleComplete = () => {
    sounds.playSuccess();
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Ignore
    }
    setPhase('completed');
    onEarnXp(30, 'Memory Boost Master');
  };

  const selectedNames = targetItems
    .filter((it) => selectedIds.includes(it.id))
    .map((it) => it.name.toLowerCase());

  const targetSentenceSample = selectedNames.length > 0
    ? `I remember an ${selectedNames.join(', ')}.`
    : 'I remember an apple, a dog and a car.';

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 md:p-8 border border-purple-200/80 shadow-sm max-w-2xl mx-auto my-2 text-center text-slate-800 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-black shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-slate-900 font-heading">Remember & Speak 🧠</h2>
            <p className="text-xs font-semibold text-slate-500">Train your memory and spoken English!</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition-colors cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>

      {/* PHASE 1: MEMORIZE (5 SECONDS) */}
      {phase === 'memorize' && (
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            <span>Look carefully! Objects will hide in: {countdown}s</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
            {targetItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xs"
              >
                <span className="text-4xl sm:text-5xl mb-2">{item.emoji}</span>
                <span className="font-black text-slate-900 text-sm">{item.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(countdown / 5) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </div>
      )}

      {/* PHASE 2: RECALL & SELECT */}
      {phase === 'recall' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-900 font-bold text-sm shadow-xs">
            🤔 Which objects did you see? Tap all the ones you remember!
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MEMORY_ITEMS_POOL.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleSelect(item.id)}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                    isSelected
                      ? 'border-purple-400 bg-purple-50 shadow-xs scale-105 text-purple-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-purple-600 absolute top-2 right-2" />
                  )}
                  <span className="text-3xl mb-1">{item.emoji}</span>
                  <span className="font-bold text-xs">{item.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={handleFinishRecall}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-base shadow-md shadow-purple-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>Next: Speak What You Remember!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* PHASE 3: SPEAK OUT LOUD */}
      {phase === 'speak' && (
        <div className="space-y-6">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-slate-800 text-left shadow-xs">
            <h3 className="font-black text-sm mb-1 text-sky-900">Now speak with your voice! 🎤</h3>
            <p className="text-xs text-slate-600 mb-2 font-semibold">
              Say out loud: <span className="font-bold underline text-sky-950">"{targetSentenceSample}"</span>
            </p>
          </div>

          <VoiceButton onTranscript={handleVoiceTranscript} selectedLanguage="en" />

          {spokenSentence && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-left shadow-xs">
              <div className="text-xs font-bold text-emerald-800 uppercase">You Said:</div>
              <div className="font-black text-base text-emerald-950 mt-0.5">{spokenSentence}</div>
              <div className="text-xs text-emerald-700 mt-1 font-semibold">
                🌟 Super pronunciation! BolBuddy is so proud of you!
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={startNewRound}
              className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base shadow-md shadow-emerald-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Complete & Claim +30 Coins!</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: COMPLETED */}
      {phase === 'completed' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-6 space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-heading">Memory Master!</h3>
          <p className="text-sm font-semibold text-slate-600 max-w-md mx-auto">
            You remembered the items and practiced your spoken sentence with courage!
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-lg shadow-xs">
            <span className="text-xl">🪙</span>
            <span>+30 Coins Awarded</span>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <button
              type="button"
              onClick={startNewRound}
              className="px-6 py-3 rounded-2xl border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold text-sm cursor-pointer transition-colors"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-purple-200 cursor-pointer transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
