import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserProfile, Scenario, PreferredLanguage, BuddyAvatarType } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat';
import { GamesHub } from './components/GamesHub';
import { ScenariosView } from './components/ScenariosView';
import { StoryBuilder } from './components/StoryBuilder';
import { MemoryGame } from './components/MemoryGame';
import { QuickSpeak } from './components/QuickSpeak';
import { PictureSpeakGame } from './components/PictureSpeakGame';
import { FirstOpenWelcome } from './components/FirstOpenWelcome';
import { OnboardingModal } from './components/OnboardingModal';
import { WordOfTheDayModal } from './components/WordOfTheDayModal';
import { ProgressReport } from './components/ProgressReport';
import { SettingsModal } from './components/SettingsModal';
import { saveUserProgress } from './services/api';
import { sounds } from './utils/soundEffects';

const INITIAL_USER: UserProfile = {
  id: 'usr-default',
  name: 'Aarav',
  classGrade: '4th',
  preferredLanguage: 'en',
  avatarType: 'boy',
  xp: 120,
  streak: 3,
  level: 2,
  badges: [
    {
      id: 'first-words',
      name: 'First Hello',
      description: 'Said your first hello to BolBuddy',
      icon: '👋',
      unlocked: true,
      unlockedAt: new Date()
    },
    {
      id: 'streak-3',
      name: '3-Day Streak',
      description: 'Learned English 3 days in a row',
      icon: '🔥',
      unlocked: true,
      unlockedAt: new Date()
    },
    {
      id: 'vocab-builder',
      name: 'Word Match Champion',
      description: 'Matched 10 words correctly in games',
      icon: '🎯',
      unlocked: false
    },
    {
      id: 'story-star',
      name: 'Story Weaver',
      description: 'Completed a co-created story with BolBuddy',
      icon: '📖',
      unlocked: false
    }
  ]
};

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('bolbuddy_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_USER;
  });

  const [showFirstOpen, setShowFirstOpen] = useState<boolean>(() => {
    return !localStorage.getItem('bolbuddy_welcomed');
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [selectedWelcomeAvatar, setSelectedWelcomeAvatar] = useState<BuddyAvatarType>('boy');

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState<number>(68);
  const [footerHeight, setFooterHeight] = useState<number>(48);

  useEffect(() => {
    const updateHeights = () => {
      if (navRef.current) {
        const h = navRef.current.getBoundingClientRect().height;
        if (h > 0) setNavHeight(Math.round(h));
      }
      if (footerRef.current) {
        const fh = footerRef.current.getBoundingClientRect().height;
        if (fh > 0) setFooterHeight(Math.round(fh));
      }
    };
    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [activeView]);

  // Modals
  const [showWordOfDay, setShowWordOfDay] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Save to localStorage and backend
  useEffect(() => {
    try {
      localStorage.setItem('bolbuddy_user', JSON.stringify(user));
      saveUserProgress(user);
    } catch {
      // Ignore
    }
  }, [user]);

  const handleFirstOpenStart = (avatar: BuddyAvatarType) => {
    setSelectedWelcomeAvatar(avatar);
    setShowFirstOpen(false);
    setShowOnboarding(true);
    localStorage.setItem('bolbuddy_welcomed', 'true');
  };

  const handleOnboardingComplete = (profileData: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...profileData,
      id: `usr-${Date.now()}`
    }));
    setShowOnboarding(false);
    setActiveView('dashboard');
    sounds.playSuccess();
    try {
      confetti({ particleCount: 80, spread: 70 });
    } catch {
      // Ignore
    }
  };

  // Gamification XP & Badge system
  const handleEarnXp = (amount: number, activityName: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        sounds.playSuccess();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {
          // Ignore
        }
      }

      // Check badge unlocks
      const updatedBadges = prev.badges.map((b) => {
        if (!b.unlocked && (activityName.includes(b.name) || (b.id === 'vocab-builder' && newXp >= 150))) {
          return { ...b, unlocked: true, unlockedAt: new Date() };
        }
        return b;
      });

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        badges: updatedBadges
      };
    });
  };

  const handleLanguageChange = (lang: PreferredLanguage) => {
    setUser((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const handleStartScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setActiveView('chat');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col relative select-none selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      {/* Immersive Atmospheric Ambient Glows - Soft Light Pastels */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-sky-50/40 pointer-events-none -z-10" />
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/35 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-200/35 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[30%] left-[-5%] w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* 1. First Open Experience */}
      {showFirstOpen && (
        <FirstOpenWelcome onStart={handleFirstOpenStart} />
      )}

      {/* 2. Onboarding Modal (Name, Class, Language, Simple Auth) */}
      {showOnboarding && (
        <OnboardingModal
          initialAvatar={selectedWelcomeAvatar}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* 3. Sticky Top Navbar */}
      <Navbar
        ref={navRef}
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenProgress={() => setShowProgress(true)}
        onOpenWordOfDay={() => setShowWordOfDay(true)}
        onOpenSettings={() => setShowSettings(true)}
        onLanguageChange={handleLanguageChange}
      />

      {/* 4. Main Body Container with dynamic views */}
      <main
        className={`flex-1 min-h-0 w-full mx-auto relative z-10 flex flex-col ${
          activeView === 'chat' ? 'max-w-4xl p-2 sm:p-3' : 'max-w-6xl p-4 md:p-6'
        }`}
        style={
          activeView === 'chat'
            ? {
                height: `calc(100dvh - ${navHeight}px - ${footerHeight}px)`,
                minHeight: 0,
              }
            : undefined
        }
      >
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <motion.div
              key="view-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Dashboard
                user={user}
                onNavigate={(v) => {
                  if (v !== 'chat') setActiveScenario(null);
                  setActiveView(v);
                }}
                onOpenWordOfDay={() => setShowWordOfDay(true)}
              />
            </motion.div>
          )}

          {/* Chat / Speaking Practice View */}
          {activeView === 'chat' && (
            <motion.div
              key="view-chat"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex-1 min-h-0 flex flex-col w-full h-full"
            >
              <Chat
                user={user}
                activeScenario={activeScenario}
                onBack={() => {
                  setActiveScenario(null);
                  setActiveView('dashboard');
                }}
                onEarnXp={handleEarnXp}
              />
            </motion.div>
          )}

          {/* Games Hub (Word Match, Sentence Puzzle, Pronunciation) */}
          {activeView === 'games' && (
            <motion.div
              key="view-games"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <GamesHub
                classGrade={user.classGrade}
                onEarnXp={handleEarnXp}
                onBack={() => setActiveView('dashboard')}
              />
            </motion.div>
          )}

          {/* Real-Life Scenarios Hub */}
          {activeView === 'scenarios' && (
            <motion.div
              key="view-scenarios"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ScenariosView
                currentGrade={user.classGrade}
                onSelectScenario={handleStartScenario}
                onBack={() => setActiveView('dashboard')}
              />
            </motion.div>
          )}

          {/* Story Builder */}
          {activeView === 'story' && (
            <motion.div
              key="view-story"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <StoryBuilder
                classGrade={user.classGrade}
                childName={user.name}
                onEarnXp={handleEarnXp}
                onClose={() => setActiveView('dashboard')}
              />
            </motion.div>
          )}

          {/* Memory Boost (Remember & Speak) */}
          {activeView === 'memory' && (
            <motion.div
              key="view-memory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MemoryGame
                onEarnXp={handleEarnXp}
                onClose={() => setActiveView('dashboard')}
              />
            </motion.div>
          )}

          {/* Quick Speak (30-sec topic challenge) */}
          {activeView === 'quickspeak' && (
            <motion.div
              key="view-quickspeak"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <QuickSpeak
                classGrade={user.classGrade}
                onEarnXp={handleEarnXp}
                onClose={() => setActiveView('dashboard')}
              />
            </motion.div>
          )}

          {/* Picture to Speak (Scene observation) */}
          {activeView === 'picturespeak' && (
            <motion.div
              key="view-picturespeak"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <PictureSpeakGame
                classGrade={user.classGrade}
                onEarnXp={handleEarnXp}
                onClose={() => setActiveView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Quick Return if inside a subview (disabled in chat view to avoid overlapping controls) */}
      {activeView !== 'dashboard' && activeView !== 'chat' && (
        <div className="fixed bottom-18 right-4 z-30">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveScenario(null);
              setActiveView('dashboard');
            }}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-700 font-bold text-xs shadow-md border border-purple-200/80 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <span>🏠 Back to Dashboard</span>
          </button>
        </div>
      )}

      {/* Immersive Bottom Navigation Footer - Light Cheerful Theme */}
      <footer
        ref={footerRef}
        id="app-footer"
        className="shrink-0 relative z-20 px-4 md:px-8 py-2 md:py-3 bg-white/90 backdrop-blur-xl border-t border-purple-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-600"
      >
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveScenario(null);
              setActiveView('dashboard');
            }}
            className={`font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeView === 'dashboard' ? 'text-purple-700 font-extrabold' : 'text-slate-500 hover:text-purple-700'
            }`}
          >
            <span>🏠</span> HOME
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveView('games');
            }}
            className={`font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeView === 'games' ? 'text-purple-700 font-extrabold' : 'text-slate-500 hover:text-purple-700'
            }`}
          >
            <span>🎮</span> GAMES
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setShowProgress(true);
            }}
            className="font-bold flex items-center gap-2 text-slate-500 hover:text-purple-700 transition-colors cursor-pointer"
          >
            <span>📈</span> PROGRESS
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setShowSettings(true);
            }}
            className="font-bold flex items-center gap-2 text-slate-500 hover:text-purple-700 transition-colors cursor-pointer"
          >
            <span>⚙️</span> SETTINGS
          </button>
        </div>
        <div className="text-[11px] text-slate-500 italic font-medium">
          Helping Class {user.classGrade} students speak with confidence • {user.preferredLanguage.toUpperCase()} Preferred
        </div>
      </footer>

      {/* 5. Modals */}
      {/* Word of the Day Modal */}
      {showWordOfDay && (
        <WordOfTheDayModal
          classGrade={user.classGrade}
          onEarnXp={handleEarnXp}
          onClose={() => setShowWordOfDay(false)}
        />
      )}

      {/* Parent / Progress Report Modal */}
      {showProgress && (
        <ProgressReport
          user={user}
          onClose={() => setShowProgress(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          user={user}
          onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
