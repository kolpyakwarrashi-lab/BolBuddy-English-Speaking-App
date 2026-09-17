import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Zap, Clock, Sparkles, Award, Star, ArrowRight, Heart } from 'lucide-react';
import { QUICK_SPEAK_TOPICS } from '../data/learningContent';
import { ClassGrade } from '../types';
import { VoiceButton } from './VoiceButton';
import { evaluateQuickSpeak, QuickSpeakResponse } from '../services/api';
import { sounds } from '../utils/soundEffects';

interface QuickSpeakProps {
  classGrade: ClassGrade;
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const QuickSpeak: React.FC<QuickSpeakProps> = ({
  classGrade,
  onEarnXp,
  onClose
}) => {
  const [topicIndex, setTopicIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [accumulatedSpeech, setAccumulatedSpeech] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<QuickSpeakResponse | null>(null);

  const topic = QUICK_SPEAK_TOPICS[topicIndex];

  // 30 second countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    } else if (isRecording && secondsRemaining === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [isRecording, secondsRemaining]);

  const handleStartPractice = () => {
    setIsRecording(true);
    setSecondsRemaining(30);
    setAccumulatedSpeech('');
    setEvaluation(null);
    sounds.playPop();
  };

  const handleVoiceTranscript = (cleaned: string) => {
    setAccumulatedSpeech((prev) => (prev ? `${prev} ${cleaned}` : cleaned));
  };

  const handleTimeUp = async () => {
    setIsRecording(false);
    sounds.playSuccess();

    const speechToAnalyze = accumulatedSpeech.trim() || 'I love this topic very much because it is fun and exciting.';
    setIsEvaluating(true);

    try {
      const res = await evaluateQuickSpeak({
        topicTitle: topic.title,
        transcript: speechToAnalyze,
        classGrade
      });

      setEvaluation(res);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {
        // Ignore
      }
      onEarnXp(res.awardedXp || 25, 'Quick Speak Star');
    } catch {
      setEvaluation({
        feedback: 'You spoke with marvelous excitement! 🌟 Every sentence makes you braver.',
        confidenceTip: 'Speaking continuously for 30 seconds shows great confidence!',
        vocabularyHighlights: ['creative words', 'good pacing'],
        grammarImprovement: 'Keep using complete sentences like "My favourite is... because..."',
        awardedXp: 25
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextTopic = () => {
    sounds.playPop();
    setTopicIndex((prev) => (prev + 1) % QUICK_SPEAK_TOPICS.length);
    setIsRecording(false);
    setSecondsRemaining(30);
    setAccumulatedSpeech('');
    setEvaluation(null);
  };

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 md:p-8 border border-amber-200/80 shadow-sm max-w-2xl mx-auto my-2 text-center text-slate-800 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-black shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-slate-900 font-heading">Quick Speak ⚡</h2>
            <p className="text-xs font-semibold text-slate-500">30 seconds of pure speaking confidence!</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold cursor-pointer transition-colors"
        >
          Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Topic Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-yellow-50/80 border border-amber-200 shadow-xs relative">
          <span className="text-5xl mb-2 block">{topic.icon}</span>
          <h3 className="text-2xl font-black text-slate-900 font-heading">{topic.title}</h3>
          <p className="text-sm font-semibold text-slate-700 mt-2 leading-relaxed">
            {topic.prompt}
          </p>

          {/* Starter Ideas */}
          <div className="mt-4 pt-4 border-t border-amber-200/60 text-left">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider block mb-1.5">
              💡 Starter ideas to speak:
            </span>
            <div className="flex flex-wrap gap-2">
              {topic.starterHints.map((hint, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-900 shadow-xs"
                >
                  "{hint}"
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 30-Second Speaking Timer Section */}
        {!evaluation && (
          <div className="space-y-4">
            {isRecording ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-100 border border-rose-200 text-rose-800 font-black text-lg shadow-xs animate-pulse">
                  <Clock className="w-5 h-5" />
                  <span>Time Left: {secondsRemaining} seconds</span>
                </div>

                <VoiceButton onTranscript={handleVoiceTranscript} selectedLanguage="en" />

                {accumulatedSpeech && (
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs text-left italic shadow-xs">
                    "{accumulatedSpeech}"
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTimeUp}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  Finish Speaking Early
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartPractice}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg sm:text-xl shadow-md shadow-amber-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-6 h-6" />
                <span>Start 30-Second Speaking Challenge 🚀</span>
              </button>
            )}
          </div>
        )}

        {isEvaluating && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm animate-pulse flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-amber-500" />
            <span>BolBuddy is listening to your speech with stars in eyes...</span>
          </div>
        )}

        {/* Positive, non-judgmental Evaluation Results */}
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-left space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-base sm:text-lg">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span>{evaluation.feedback}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-black text-xs">
                <span>🪙</span>
                <span>+{evaluation.awardedXp} Coins</span>
              </div>
            </div>

            {/* 3 Feedback Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Confidence Feedback */}
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 uppercase">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Confidence</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">{evaluation.confidenceTip}</p>
              </div>

              {/* 2. Vocabulary Feedback */}
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-black text-sky-700 uppercase">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>Vocabulary</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {evaluation.vocabularyHighlights.join(', ')}
                </p>
              </div>

              {/* 3. Simple Grammar Improvement */}
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-black text-purple-700 uppercase">
                  <Heart className="w-4 h-4 text-purple-500" />
                  <span>Grammar Tip</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">{evaluation.grammarImprovement}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextTopic}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base shadow-md shadow-amber-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Try Another Exciting Topic!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
