import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Square, Sparkles, Heart } from 'lucide-react';
import { ChatMessage as ChatMessageType, BuddyAvatarType } from '../types';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { sounds } from '../utils/soundEffects';
import { cleanTextForSpeech } from '../utils/speechCleaner';

interface ChatMessageProps {
  message: ChatMessageType;
  avatarType?: BuddyAvatarType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  avatarType = 'boy'
}) => {
  const isBot = message.sender === 'bot';
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    sounds.playPop();

    // Prepare speech-only text: strictly emoji-free and stripped of XP/markdown/technical artifacts
    const speakableText = cleanTextForSpeech(message.text);
    if (!speakableText) return;

    const utterance = new SpeechSynthesisUtterance(speakableText);
    utterance.rate = 0.88; // Gentle kid-friendly speaking pace
    utterance.pitch = isBot ? 1.15 : 1.0;
    utterance.lang = 'en-US';

    // Pick warm friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) => (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural')) && v.lang.startsWith('en')
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex items-start gap-3 my-3 ${isBot ? 'justify-start' : 'justify-end flex-row-reverse'}`}
    >
      {/* Avatar icon */}
      {isBot ? (
        <BolBuddyAvatar
          type={avatarType}
          size="sm"
          isSpeaking={isPlaying}
          mood={isPlaying ? 'celebrating' : 'happy'}
          className="shrink-0 mt-1 drop-shadow-md"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center shadow-md shadow-purple-200/60 shrink-0 mt-1 text-xs border-2 border-white">
          YOU
        </div>
      )}

      {/* Bubble Container */}
      <div className="max-w-[85%] md:max-w-[75%] min-w-0 space-y-2">
        <div
          className={`p-3.5 sm:p-4 rounded-3xl shadow-xs text-sm md:text-base leading-relaxed relative min-w-0 break-words [overflow-wrap:anywhere] ${
            isBot
              ? 'bg-purple-50/90 border border-purple-200/80 text-slate-800 rounded-tl-sm shadow-sm'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-tr-sm shadow-md shadow-indigo-200/40 border border-indigo-400/20'
          }`}
        >
          {/* Message Text */}
          <div className="whitespace-pre-wrap font-medium min-w-0 break-words [overflow-wrap:anywhere]">
            {message.text}
          </div>

          {/* Friendly encouragement if present */}
          {message.praise && (
            <div className="mt-2.5 pt-2 border-t border-purple-200/60 flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{message.praise}</span>
            </div>
          )}

          {/* Multilingual Guidance Tips (Hindi / Marathi) */}
          {(message.hindiTip || message.marathiTip) && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-900 space-y-1 shadow-xs">
              {message.hindiTip && <div>🇮🇳 हिंदी मदद: {message.hindiTip}</div>}
              {message.marathiTip && <div>🇮🇳 मराठी मदत: {message.marathiTip}</div>}
            </div>
          )}

          {/* Friendly Error Correction Card (Encouraging format) */}
          {message.correction && (
            <div className="mt-3 p-3 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-xs text-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-black text-amber-800">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Almost! 😊 Try saying it this way:</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 font-bold text-sm text-purple-900 tracking-wide shadow-xs">
                "{message.correction.suggestion}"
              </div>
              {message.correction.explanation && (
                <div className="text-[11px] text-slate-600 font-medium italic">
                  💡 {message.correction.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Audio Listen / Stop button for AI responses */}
        {isBot && (
          <div className="flex items-center gap-2 pl-2">
            <button
              type="button"
              onClick={handleSpeak}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isPlaying
                  ? 'bg-rose-100 text-rose-700 border border-rose-300 shadow-xs'
                  : 'bg-purple-100/80 hover:bg-purple-200 text-purple-800 border border-purple-200'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Listen 🔊</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-slate-400 font-semibold">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
