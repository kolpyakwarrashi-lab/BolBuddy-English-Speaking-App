import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { UserProfile, ClassGrade, PreferredLanguage, BuddyAvatarType } from '../types';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { sounds } from '../utils/soundEffects';

interface SignupModalProps {
  onSignup: (user: Partial<UserProfile>) => void;
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  onSignup,
  onSwitchToLogin,
  onClose
}) => {
  const [name, setName] = useState('');
  const [classGrade, setClassGrade] = useState<ClassGrade>('4th');
  const [preferredLang, setPreferredLang] = useState<PreferredLanguage>('en');
  const [avatar, setAvatar] = useState<BuddyAvatarType>('boy');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const classOptions: ClassGrade[] = ['2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please tell BolBuddy your name! 😊');
      sounds.playGentleBeep();
      return;
    }
    if (pin.length < 4) {
      setErrorMsg('Please choose an easy 4-digit secret PIN! 🔑');
      sounds.playGentleBeep();
      return;
    }

    sounds.playSuccess();
    onSignup({
      name: name.trim(),
      classGrade,
      preferredLanguage: preferredLang,
      avatarType: avatar,
      xp: 100, // 100 bonus XP for signing up!
      streak: 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-[#0F172A]/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(99,102,241,0.35)] border border-indigo-500/30 relative text-left text-white my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
            <BolBuddyAvatar type={avatar} size="sm" mood="happy" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-yellow-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>+100 Welcome XP</span>
              </span>
              <h2 className="text-xl font-black text-white font-heading">
                Sign Up for BolBuddy 🌟
              </h2>
            </div>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">
                What is your name?
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Aarav, Riya, Ananya..."
                  maxLength={25}
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 focus:border-indigo-400 focus:bg-white/10 text-sm font-bold text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* 2. Choose Avatar */}
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wider">
                Choose your AI Buddy:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['boy', 'girl', 'robot'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setAvatar(t);
                      sounds.playPop();
                    }}
                    className={`p-2 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      avatar === t
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_12px_rgba(250,204,21,0.3)] text-yellow-300'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <BolBuddyAvatar type={t} size="sm" />
                    <span className="text-[11px] font-bold capitalize mt-0.5">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Class Grade */}
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">
                Which class are you in?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {classOptions.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => {
                      setClassGrade(grade);
                      sounds.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      classGrade === grade
                        ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.6)] border border-indigo-400/40'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {grade} Std
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Help Language */}
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">
                Preferred Help Language:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPreferredLang('en');
                    sounds.playPop();
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    preferredLang === 'en'
                      ? 'border-indigo-400 bg-indigo-600 text-white font-black'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreferredLang('hi');
                    sounds.playPop();
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    preferredLang === 'hi'
                      ? 'border-indigo-400 bg-indigo-600 text-white font-black'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  🇮🇳 हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreferredLang('mr');
                    sounds.playPop();
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    preferredLang === 'mr'
                      ? 'border-indigo-400 bg-indigo-600 text-white font-black'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  🇮🇳 मराठी
                </button>
              </div>
            </div>

            {/* 5. 4-digit PIN */}
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">
                Create a 4-Digit Secret PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 focus:border-indigo-400 focus:bg-white/10 text-center text-xl tracking-widest font-black text-white outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Choose 4 easy numbers you won't forget.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Create Account & Claim +100 XP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Login */}
            <div className="pt-2 text-center border-t border-white/10">
              <p className="text-xs text-slate-300">
                Already have a BolBuddy account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-bold text-yellow-400 hover:text-yellow-300 underline cursor-pointer ml-1"
                >
                  Log in
                </button>
              </p>
            </div>

            {/* Safety Guarantee */}
            <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-500/30 flex items-center gap-2 text-sky-300 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Safe for kids: No emails, phone numbers, or passwords needed.</span>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
