import React from 'react';
import { Sparkles, Flame, Award, Globe, BarChart2, Calendar, Settings } from 'lucide-react';
import { UserProfile, PreferredLanguage } from '../types';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  user: UserProfile;
  onOpenProgress: () => void;
  onOpenWordOfDay: () => void;
  onOpenSettings: () => void;
  onLanguageChange: (lang: PreferredLanguage) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(({
  user,
  onOpenProgress,
  onOpenWordOfDay,
  onOpenSettings,
  onLanguageChange,
  activeView,
  setActiveView
}, ref) => {
  return (
    <header
      ref={ref}
      id="app-navbar"
      className="sticky top-0 z-40 shrink-0 bg-white/95 backdrop-blur-xl border-b border-purple-100/90 px-4 md:px-8 py-3 shadow-xs select-none"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Brand & Logo */}
        <div
          onClick={() => {
            setActiveView('dashboard');
            sounds.playPop();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center shadow-md shadow-amber-200/60 transform group-hover:scale-105 transition-transform shrink-0 border border-amber-300/40">
            <span className="text-xl md:text-2xl">🚀</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 font-heading">
                BOLBUDDY 2.0
              </h1>
              <span className="text-xs animate-pulse">✨</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-purple-600 font-bold -mt-0.5 hidden sm:block">
              AI Speaking Companion
            </p>
          </div>
        </div>

        {/* Middle: Gamification Pill (Streak + XP + Rank) */}
        <div className="flex items-center gap-2 md:gap-3 bg-purple-50/90 border border-purple-100/90 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl shadow-xs">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs md:text-sm">
            <span>🔥</span>
            <span>{user.streak}d</span>
          </div>

          <div className="w-px h-4 bg-purple-200" />

          {/* Coins */}
          <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs md:text-sm">
            <span>🪙</span>
            <span>{user.xp} Coins</span>
          </div>

          <div className="w-px h-4 bg-purple-200 hidden sm:block" />

          {/* Explorer Title */}
          <span className="text-indigo-700 font-medium text-xs md:text-sm hidden sm:inline">
            Class {user.classGrade} Explorer
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Word of Day Quick Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenWordOfDay();
            }}
            title="Word of the Day"
            className="px-3 py-1.5 md:py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Word of the Day</span>
          </button>

          {/* Progress / Parent Report */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenProgress();
            }}
            title="Progress Report"
            className="px-3 py-1.5 md:py-2 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden lg:inline">Progress</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-white hover:bg-purple-50/60 rounded-xl px-2.5 py-1.5 border border-purple-200/80 text-xs font-bold text-purple-900 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-purple-600 mr-1 shrink-0" />
            <select
              value={user.preferredLanguage}
              onChange={(e) => {
                sounds.playPop();
                onLanguageChange(e.target.value as PreferredLanguage);
              }}
              className="bg-transparent pr-1 outline-none cursor-pointer font-bold text-xs text-purple-900"
            >
              <option value="en" className="bg-white text-slate-800">🇬🇧 EN</option>
              <option value="hi" className="bg-white text-slate-800">🇮🇳 हिंदी</option>
              <option value="mr" className="bg-white text-slate-800">🇮🇳 मराठी</option>
            </select>
          </div>

          {/* Settings Modal Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenSettings();
            }}
            title="Settings & Profile"
            className="p-2 rounded-xl bg-white hover:bg-purple-50 border border-purple-200/80 text-purple-700 hover:text-purple-900 transition-all shadow-xs cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';
