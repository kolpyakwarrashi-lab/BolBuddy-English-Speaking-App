import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Camera, Sparkles, ArrowRight, Volume2, Award, Heart } from 'lucide-react';
import { PICTURE_SCENES } from '../data/learningContent';
import { ClassGrade } from '../types';
import { VoiceButton } from './VoiceButton';
import { evaluatePictureSpeak, PictureSpeakResponse } from '../services/api';
import { sounds } from '../utils/soundEffects';
import { cleanTextForSpeech } from '../utils/speechCleaner';

interface PictureSpeakGameProps {
  classGrade: ClassGrade;
  onEarnXp: (xp: number, activityName: string) => void;
  onClose: () => void;
}

export const PictureSpeakGame: React.FC<PictureSpeakGameProps> = ({
  classGrade,
  onEarnXp,
  onClose
}) => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [spokenText, setSpokenText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<PictureSpeakResponse | null>(null);

  const scene = PICTURE_SCENES[sceneIndex];

  const handleTranscript = async (cleanedText: string) => {
    setSpokenText(cleanedText);
    setIsEvaluating(true);
    sounds.playStarDing();

    try {
      const res = await evaluatePictureSpeak({
        sceneTitle: scene.title,
        transcript: cleanedText,
        classGrade
      });

      setFeedbackResult(res);
      sounds.playSuccess();
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch {
        // Ignore
      }
      onEarnXp(res.awardedXp || 20, 'Picture Observer');
    } catch {
      setFeedbackResult({
        praise: 'You have wonderful observation skills! 🌟',
        whatYouSaid: cleanedText,
        friendlySuggestion: `Try saying: "In this picture, I can see ${scene.sampleThingsToNotice[0] || 'interesting details'}."`,
        awardedXp: 20
      });
      sounds.playSuccess();
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextScene = () => {
    sounds.playPop();
    setSceneIndex((prev) => (prev + 1) % PICTURE_SCENES.length);
    setSpokenText('');
    setFeedbackResult(null);
  };

  const handleSpeakSuggestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakable = cleanTextForSpeech(text);
      if (!speakable) return;
      const utterance = new SpeechSynthesisUtterance(speakable);
      utterance.rate = 0.88;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-[#0F172A]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 md:p-8 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] max-w-2xl mx-auto my-2 text-center text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-white font-heading">Picture to Speak 📸</h2>
            <p className="text-xs font-semibold text-slate-300">Look at the scene and tell BolBuddy what you see!</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/10 cursor-pointer transition-colors"
        >
          Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Scene Graphic Box */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-orange-500/10 to-indigo-950/40 border border-amber-400/30 shadow-lg relative overflow-hidden">
          <div className="text-6xl md:text-7xl mb-3 animate-bounce duration-1000">
            {scene.emoji}
          </div>
          <h3 className="text-2xl font-black text-white font-heading">{scene.title}</h3>
          <p className="text-sm font-semibold text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            {scene.description}
          </p>

          {/* Hint tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs font-bold text-amber-300">Things you can mention:</span>
            {scene.sampleThingsToNotice.map((thing) => (
              <span
                key={thing}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-amber-200 shadow-xs"
              >
                👀 {thing}
              </span>
            ))}
          </div>
        </div>

        {/* Speak Instruction */}
        <div className="space-y-2">
          <p className="text-sm font-black text-slate-200">
            Tap the microphone and speak 1 or 2 sentences about what you see!
          </p>
          <VoiceButton onTranscript={handleTranscript} disabled={isEvaluating} selectedLanguage="en" />
        </div>

        {/* Loading / Evaluating state */}
        {isEvaluating && (
          <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-200 font-bold text-sm animate-pulse flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
            <span>BolBuddy is listening to your awesome description...</span>
          </div>
        )}

        {/* Friendly Feedback Card */}
        {feedbackResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-emerald-950/60 border border-emerald-400/40 text-left space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-black text-base">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span>{feedbackResult.praise}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-black text-xs">
                <span>🪙</span>
                <span>+{feedbackResult.awardedXp} Coins</span>
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-slate-400 block uppercase">You Said:</span>
              <span className="font-black text-white text-sm">"{feedbackResult.whatYouSaid}"</span>
            </div>

            <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-400/30 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-sky-300 block">💡 BolBuddy Speaking Tip:</span>
                <span className="font-bold text-sky-100 text-sm">{feedbackResult.friendlySuggestion}</span>
              </div>
              <button
                type="button"
                onClick={() => handleSpeakSuggestion(feedbackResult.friendlySuggestion)}
                title="Listen aloud"
                className="p-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 shrink-0 shadow-xs cursor-pointer border border-sky-400/30 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNextScene}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Try Another Picture!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
