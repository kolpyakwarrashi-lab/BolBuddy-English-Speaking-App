import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { BookOpen, Sparkles, Volume2, RotateCcw, Award } from 'lucide-react';
import { ClassGrade } from '../types';
import { VoiceButton } from './VoiceButton';
import { continueStory } from '../services/api';
import { sounds } from '../utils/soundEffects';
import { cleanTextForSpeech } from '../utils/speechCleaner';

interface StoryBuilderProps {
  classGrade: ClassGrade;
  childName: string;
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const StoryBuilder: React.FC<StoryBuilderProps> = ({
  classGrade,
  childName,
  onEarnXp,
  onClose
}) => {
  const initialStory = `Once upon a time, a curious explorer named ${childName || 'Riya'} and their friendly companion BolBuddy discovered a glowing doorway hidden inside the school library...`;

  const [storySegments, setStorySegments] = useState<
    { speaker: 'bolbuddy' | 'child'; text: string }[]
  >([{ speaker: 'bolbuddy', text: initialStory }]);

  const [currentPrompt, setCurrentPrompt] = useState(
    'What happens when you step through the glowing doorway?'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const handleVoiceTranscript = async (cleanedText: string) => {
    if (!cleanedText.trim()) return;

    sounds.playStarDing();
    const newSegments = [
      ...storySegments,
      { speaker: 'child' as const, text: cleanedText }
    ];
    setStorySegments(newSegments);
    setIsLoading(true);

    const storySoFar = newSegments.map((s) => `${s.speaker}: ${s.text}`).join('\n');

    try {
      const res = await continueStory({
        storySoFar,
        childTurn: cleanedText,
        classGrade
      });

      sounds.playSuccess();
      setStorySegments([
        ...newSegments,
        { speaker: 'bolbuddy', text: res.nextPart }
      ]);
      setCurrentPrompt(res.promptForChild);
      setTurnCount((prev) => prev + 1);

      if (turnCount >= 2) {
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {
          // Ignore
        }
      }
      onEarnXp(res.awardedXp || 20, 'Story Weaver');
    } catch {
      setStorySegments([
        ...newSegments,
        {
          speaker: 'bolbuddy',
          text: 'Suddenly, a friendly purple dragon landed gently beside you, offering to take you on a soaring flight above the clouds!'
        }
      ]);
      setCurrentPrompt('Where do you fly to next?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakable = cleanTextForSpeech(text);
      if (!speakable) return;
      const utterance = new SpeechSynthesisUtterance(speakable);
      utterance.rate = 0.9;
      utterance.pitch = 1.15;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRestart = () => {
    sounds.playPop();
    setStorySegments([{ speaker: 'bolbuddy', text: initialStory }]);
    setCurrentPrompt('What happens when you step through the glowing doorway?');
    setTurnCount(0);
  };

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 md:p-8 border border-purple-200/80 shadow-sm max-w-2xl mx-auto my-2 text-center text-slate-800 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-black shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-slate-900 font-heading">Story Builder 📖</h2>
            <p className="text-xs font-semibold text-slate-500">Co-create an exciting magical story with BolBuddy!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRestart}
            title="Start new story"
            className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold cursor-pointer transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* Story Book Container */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto p-4 bg-purple-50/50 rounded-3xl border border-purple-200/60 text-left">
        {storySegments.map((segment, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl min-w-0 break-words [overflow-wrap:anywhere] ${
              segment.speaker === 'bolbuddy'
                ? 'bg-white border border-purple-200/80 text-slate-800 shadow-xs'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-xs ml-4 sm:ml-6 border border-purple-400/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-black uppercase tracking-wider ${
                segment.speaker === 'bolbuddy' ? 'text-purple-800' : 'text-purple-200'
              }`}>
                {segment.speaker === 'bolbuddy' ? '🌟 BolBuddy' : `🚀 ${childName || 'You'}`}
              </span>
              {segment.speaker === 'bolbuddy' && (
                <button
                  type="button"
                  onClick={() => handleSpeakAloud(segment.text)}
                  className="p-1 text-slate-400 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{segment.text}</p>
          </motion.div>
        ))}

        {isLoading && (
          <div className="p-4 rounded-2xl bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-bold flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-purple-700" />
            <span>BolBuddy is imagining the next adventure twist...</span>
          </div>
        )}
      </div>

      {/* Story Prompt for Child */}
      <div className="mt-6 space-y-3">
        <div className="p-4 rounded-2xl bg-white border border-purple-200/80 text-slate-800 text-left shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-700 uppercase">Your Turn to Speak!</span>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <span>🪙</span>
              <span>+20 Coins per turn</span>
            </div>
          </div>
          <p className="font-bold text-sm md:text-base mt-1 text-purple-950">"{currentPrompt}"</p>
        </div>

        <VoiceButton onTranscript={handleVoiceTranscript} disabled={isLoading} selectedLanguage="en" />
      </div>
    </div>
  );
};
