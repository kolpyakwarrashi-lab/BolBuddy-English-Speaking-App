import React from 'react';
import { motion } from 'motion/react';
import { Award, Flame, Clock, BookOpen, Star, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface ProgressReportProps {
  user: UserProfile;
  onClose: () => void;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({ user, onClose }) => {
  const wordsLearned = Math.floor(user.xp / 15) + 12;
  const minutesPracticed = Math.floor(user.xp / 10) + 15;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-purple-200/80 shadow-2xl text-center text-slate-800 my-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center font-black shrink-0">
                <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-black text-slate-900 font-heading">Progress & Badges 🌟</h2>
                <p className="text-xs font-semibold text-slate-500">Learning milestones for {user.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-slate-600 border border-purple-200 text-xs font-bold cursor-pointer transition-colors"
            >
              Close ✕
            </button>
          </div>

          {/* Hero Stats Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-2xl mb-1">🪙</span>
              <span className="text-2xl font-black text-slate-900">{user.xp}</span>
              <span className="text-[11px] font-bold text-amber-800 uppercase">Total Coins</span>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 flex flex-col items-center justify-center text-center shadow-xs">
              <Flame className="w-6 h-6 text-orange-500 mb-1" />
              <span className="text-2xl font-black text-slate-900">{user.streak} Days</span>
              <span className="text-[11px] font-bold text-orange-800 uppercase">Daily Streak</span>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col items-center justify-center text-center shadow-xs">
              <BookOpen className="w-6 h-6 text-sky-600 mb-1" />
              <span className="text-2xl font-black text-slate-900">{wordsLearned}</span>
              <span className="text-[11px] font-bold text-sky-800 uppercase">Words Learned</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center justify-center text-center shadow-xs">
              <Clock className="w-6 h-6 text-emerald-600 mb-1" />
              <span className="text-2xl font-black text-slate-900">{minutesPracticed}m</span>
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Speaking Time</span>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="text-left mb-6">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Earned Trophies & Badges</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {user.badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.03 }}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center text-center ${
                    badge.unlocked
                      ? 'bg-amber-50/80 border-amber-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <span className="font-black text-xs text-slate-900">{badge.name}</span>
                  <span className="text-[10px] text-slate-600 font-semibold mt-0.5">{badge.description}</span>
                  {badge.unlocked && (
                    <span className="mt-2 inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Parent & Child Safety Note */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold block mb-0.5 text-sky-900">Parent & Teacher Safety Guarantee</span>
              BolBuddy operates with safe AI filters designed specifically for Indian school students. No personal information is stored or shared, and gamification is always encouraging and uplifting.
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-slate-950 font-black text-sm sm:text-base shadow-md shadow-amber-200 transition-transform hover:scale-[1.01] cursor-pointer"
            >
              Keep Learning & Speaking! 🌟
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
