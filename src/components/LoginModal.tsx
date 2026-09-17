import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, KeyRound, Sparkles, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { sounds } from '../utils/soundEffects';

interface LoginModalProps {
  currentUser: UserProfile;
  onLogin: (user: Partial<UserProfile>) => void;
  onSwitchToSignup: () => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  currentUser,
  onLogin,
  onSwitchToSignup,
  onClose
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your explorer name! 😊');
      sounds.playGentleBeep();
      return;
    }
    if (pin.length < 4) {
      setErrorMsg('Please enter your 4-digit secret PIN! 🔑');
      sounds.playGentleBeep();
      return;
    }

    sounds.playSuccess();
    onLogin({
      name: name.trim(),
      streak: Math.max(currentUser.streak, 1)
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
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <BolBuddyAvatar type={currentUser.avatarType || 'boy'} size="sm" mood="waving" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Welcome Back</span>
              <h2 className="text-xl font-black text-white font-heading">
                Login to BolBuddy 🚀
              </h2>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Explorer Name */}
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wider">
                Explorer Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (e.g., Aarav)"
                  maxLength={25}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-indigo-400 focus:bg-white/10 text-base font-bold text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Secret 4-digit PIN */}
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wider">
                4-Digit Secret PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-indigo-400 focus:bg-white/10 text-center text-xl tracking-widest font-black text-white outline-none transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter the 4-digit PIN you chose when signing up.
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
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-slate-950 font-black text-base shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log In & Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Signup */}
            <div className="pt-2 text-center border-t border-white/10">
              <p className="text-xs text-slate-300">
                New to BolBuddy?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="font-bold text-yellow-400 hover:text-yellow-300 underline cursor-pointer ml-1"
                >
                  Create an account
                </button>
              </p>
            </div>

            {/* Safety Guarantee */}
            <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-500/30 flex items-center gap-2 text-sky-300 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Safe for kids: No passwords or personal data required.</span>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
