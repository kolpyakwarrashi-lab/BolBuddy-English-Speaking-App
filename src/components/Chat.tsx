import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import { ChatMessage as ChatMessageType, UserProfile, Scenario } from '../types';
import { ChatMessage } from './ChatMessage';
import { VoiceButton } from './VoiceButton';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { sendChatMessage } from '../services/api';
import { sounds } from '../utils/soundEffects';

interface ChatProps {
  user: UserProfile;
  activeScenario?: Scenario | null;
  onBack: () => void;
  onEarnXp: (xp: number, activity: string) => void;
}

export const Chat: React.FC<ChatProps> = ({
  user,
  activeScenario,
  onBack,
  onEarnXp
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'en' | 'hi' | 'mr'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips for children
  const starterPrompts = activeScenario ? [
    `Hi, I am ready to practice ${activeScenario.title}!`,
    `Can you ask me what I need?`,
    `How much does this cost?`
  ] : [
    'Tell me a fun English riddle! 😄',
    'How was your day BolBuddy? 🌟',
    'Let us talk about my favourite game! 🎮',
    'Can you help me say a good sentence? 💡'
  ];

  // Initialize conversation
  useEffect(() => {
    let initialGreeting = `Hi ${user.name}! 👋 I am BolBuddy, your friendly English speaking friend! What exciting thing would you like to talk about today? 🌟`;

    if (activeScenario) {
      initialGreeting = `Welcome to our ${activeScenario.title} roleplay! 🎭\n${activeScenario.starterPrompt}`;
    }

    setMessages([
      {
        id: 'msg-init',
        sender: 'bot',
        text: initialGreeting,
        timestamp: new Date()
      }
    ]);
  }, [activeScenario, user.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    sounds.playPop();
    const userMsg: ChatMessageType = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: textToSend.trim(),
        classGrade: user.classGrade,
        preferredLanguage: user.preferredLanguage,
        scenarioId: activeScenario?.id
      });

      const botMsg: ChatMessageType = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        correction: response.correction,
        praise: response.praise,
        hindiTip: response.hindiTip,
        marathiTip: response.marathiTip,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
      sounds.playStarDing();

      if (response.awardedXp) {
        onEarnXp(response.awardedXp, 'Speaking with BolBuddy');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "I loved hearing that! 🌟 You are speaking so confidently. What would you like to tell me next?",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (cleaned: string) => {
    if (cleaned.trim()) {
      handleSendMessage(cleaned);
    }
  };

  return (
    <div
      className="flex flex-col flex-1 min-h-0 w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-purple-100 shadow-xl shadow-purple-900/5 text-slate-800 relative h-full"
      style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}
    >
      {/* 1. Chat Header (Fixed within page/container layout) - Light Cheerful Theme */}
      <div className="bg-gradient-to-r from-purple-100/90 via-indigo-50/90 to-sky-100/80 p-2.5 sm:p-3.5 border-b border-purple-100 text-slate-800 flex items-center justify-between shrink-0 shadow-xs gap-2 z-10 rounded-t-2xl sm:rounded-t-3xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white active:scale-95 text-purple-700 hover:text-purple-900 transition-all cursor-pointer border border-purple-200/80 shrink-0 flex items-center gap-1.5 shadow-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap"><span className="hidden sm:inline">Back to </span>Dashboard</span>
          </button>
          <BolBuddyAvatar type={user.avatarType} size="sm" isSpeaking={isLoading} className="drop-shadow-md shrink-0 hidden xs:block" />
          <div className="min-w-0">
            <h2 className="font-black text-sm sm:text-base md:text-lg font-heading leading-tight truncate flex items-center gap-1 text-slate-900">
              <span className="text-purple-900 truncate">
                {activeScenario ? activeScenario.title : 'Speak with BolBuddy'}
              </span>
              <span>🌟</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-purple-600 font-semibold truncate">
              {activeScenario ? 'Real-life Scenario Practice' : `Customized for ${user.classGrade} Standard`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setMessages([
                {
                  id: `init-${Date.now()}`,
                  sender: 'bot',
                  text: `Fresh start! What should we practice now, ${user.name}? 🚀`,
                  timestamp: new Date()
                }
              ]);
            }}
            title="Restart conversation"
            className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-white/90 hover:bg-white border border-purple-200/80 text-purple-700 hover:text-purple-900 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* 2. Message History Area (ONLY this area scrolls) - Light pastel background */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gradient-to-b from-purple-50/40 via-white to-sky-50/30 space-y-3"
        style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} avatarType={user.avatarType} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold p-3 bg-purple-50/90 border border-purple-200/80 rounded-2xl w-fit shadow-xs my-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>BolBuddy is thinking of a friendly reply...</span>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-2 shrink-0" />
      </div>

      {/* 3. Quick Suggestion ("TRY") Section - Soft light pastel cards */}
      <div className="shrink-0 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50/95 backdrop-blur-md border-t border-purple-100/90">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-black uppercase text-purple-600 tracking-wider shrink-0 pl-1">
            TRY:
          </span>
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 active:scale-95 text-purple-900 hover:text-purple-950 text-xs font-bold border border-purple-200/90 shrink-0 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Controls Section (Language Selector, Microphone & Input) - Light Theme */}
      <div className="shrink-0 p-2 sm:p-3 md:p-4 bg-white/95 backdrop-blur-xl border-t border-purple-100 rounded-b-2xl sm:rounded-b-3xl shadow-xs">
        {/* Voice and Language controls */}
        <VoiceButton
          onTranscript={handleVoiceTranscript}
          selectedLanguage={voiceLang}
          onLanguageChange={setVoiceLang}
          disabled={isLoading}
        />

        {/* Text fallback input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="mt-1.5 sm:mt-2 flex items-center gap-2 max-w-xl mx-auto w-full"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Or type a message here..."
            disabled={isLoading}
            className="flex-1 min-w-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-50/90 border border-purple-200/80 focus:border-purple-500 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black shadow-md shadow-purple-300/40 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
