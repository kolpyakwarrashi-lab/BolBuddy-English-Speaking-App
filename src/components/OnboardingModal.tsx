import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Check, User, School, Globe } from 'lucide-react';
import { ClassGrade, PreferredLanguage, BuddyAvatarType, UserProfile } from '../types';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { sounds } from '../utils/soundEffects';

interface OnboardingModalProps {
  initialAvatar?: BuddyAvatarType;
  onComplete: (profile: Partial<UserProfile>) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialAvatar = 'boy',
  onComplete,
  onClose
}) => {
  const [step, setStep] = useState<'name' | 'class' | 'lang' | 'auth'>('name');
  const [name, setName] = useState('');
  const [classGrade, setClassGrade] = useState<ClassGrade>('4th');
  const [preferredLang, setPreferredLang] = useState<PreferredLanguage>('en');
  const [avatar] = useState<BuddyAvatarType>(initialAvatar);
  const [authMode, setAuthMode] = useState<'create' | 'login'>('create');
  const [secretPin, setSecretPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const classOptions: { grade: ClassGrade; label: string; ageHint: string }[] = [
    { grade: '2nd', label: '2nd Standard', ageHint: 'Age 6-7' },
    { grade: '3rd', label: '3rd Standard', ageHint: 'Age 7-8' },
    { grade: '4th', label: '4th Standard', ageHint: 'Age 8-9' },
    { grade: '5th', label: '5th Standard', ageHint: 'Age 9-10' },
    { grade: '6th', label: '6th Standard', ageHint: 'Age 10-11' },
    { grade: '7th', label: '7th Standard', ageHint: 'Age 11-12' },
    { grade: '8th', label: '8th Standard', ageHint: 'Age 12-14' }
  ];

  const handleNextFromName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please tell BolBuddy your name! 😊');
      sounds.playGentleBeep();
      return;
    }
    setErrorMsg('');
    sounds.playPop();
    setStep('class');
  };

  const handleNextFromClass = () => {
    sounds.playPop();
    setStep('lang');
  };

  const handleNextFromLang = () => {
    sounds.playPop();
    setStep('auth');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    onComplete({
      name: name.trim() || 'Young Explorer',
      classGrade,
      preferredLanguage: preferredLang,
      avatarType: avatar,
      xp: 100, // Welcome bonus XP!
      streak: 1
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl border border-purple-200/80 relative text-slate-800 my-auto"
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-slate-500 border border-purple-200 cursor-pointer transition-colors"
            >
              ✕
            </button>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <BolBuddyAvatar type={avatar} size="sm" mood="happy" />
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">BolBuddy Journey</span>
                <h2 className="text-base font-black text-slate-900 font-heading">
                  {step === 'name' && "What's your name?"}
                  {step === 'class' && "Which class are you in?"}
                  {step === 'lang' && "Preferred help language?"}
                  {step === 'auth' && "Welcome to BolBuddy 👋"}
                </h2>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 bg-amber-100 border border-amber-200 text-amber-800 rounded-full shrink-0">
              {step === 'name' && '1/4'}
              {step === 'class' && '2/4'}
              {step === 'lang' && '3/4'}
              {step === 'auth' && '4/4'}
            </span>
          </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: NAME */}
          {step === 'name' && (
            <motion.form
              key="step-name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNextFromName}
              className="space-y-4"
            >
              <div className="text-center my-4">
                <p className="text-sm font-semibold text-slate-600">
                  BolBuddy wants to know your first name so we can chat like best friends!
                </p>
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Riya, Aarav, Kabir..."
                  maxLength={25}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-lg font-bold text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-rose-500 text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-lg shadow-md shadow-amber-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.form>
          )}

          {/* STEP 2: CLASS SELECTION */}
          {step === 'class' && (
            <motion.div
              key="step-class"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-xs font-bold text-slate-600">
                  We will adjust games and speaking practice to match your class!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {classOptions.map((opt) => (
                  <button
                    key={opt.grade}
                    type="button"
                    onClick={() => {
                      setClassGrade(opt.grade);
                      sounds.playPop();
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                      classGrade === opt.grade
                        ? 'border-purple-400 bg-purple-50 shadow-xs text-slate-900'
                        : 'border-slate-200 bg-white hover:border-purple-200 hover:bg-purple-50/50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-black text-base">{opt.label}</div>
                      <div className="text-xs font-semibold text-slate-500">{opt.ageHint}</div>
                    </div>
                    {classGrade === opt.grade && (
                      <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('name')}
                  className="px-4 py-3 rounded-2xl border border-purple-200 bg-purple-50 text-slate-700 font-bold hover:bg-purple-100 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextFromClass}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-base shadow-md shadow-amber-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Class</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREFERRED LANGUAGE */}
          {step === 'lang' && (
            <motion.div
              key="step-lang"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-xs font-bold text-slate-600">
                  If you ever get stuck, which language should BolBuddy use to explain?
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPreferredLang('en');
                    sounds.playPop();
                  }}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    preferredLang === 'en'
                      ? 'border-purple-400 bg-purple-50 text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-purple-50/50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇬🇧</span>
                    <div className="text-left">
                      <div className="font-black text-slate-900">English</div>
                      <div className="text-xs text-slate-500 font-semibold">Speak & learn in pure English</div>
                    </div>
                  </div>
                  {preferredLang === 'en' && <Check className="w-5 h-5 text-purple-600 stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreferredLang('hi');
                    sounds.playPop();
                  }}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    preferredLang === 'hi'
                      ? 'border-purple-400 bg-purple-50 text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-purple-50/50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇮🇳</span>
                    <div className="text-left">
                      <div className="font-black text-slate-900">हिंदी (Hindi)</div>
                      <div className="text-xs text-slate-500 font-semibold">मदद और संकेत हिंदी में मिलेंगे</div>
                    </div>
                  </div>
                  {preferredLang === 'hi' && <Check className="w-5 h-5 text-purple-600 stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreferredLang('mr');
                    sounds.playPop();
                  }}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    preferredLang === 'mr'
                      ? 'border-purple-400 bg-purple-50 text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-purple-50/50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇮🇳</span>
                    <div className="text-left">
                      <div className="font-black text-slate-900">मराठी (Marathi)</div>
                      <div className="text-xs text-slate-500 font-semibold">मदत आणि टिप्स मराठीमध्ये मिळतील</div>
                    </div>
                  </div>
                  {preferredLang === 'mr' && <Check className="w-5 h-5 text-purple-600 stroke-[3]" />}
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-500 font-semibold">
                  (You can always change this anytime in Settings)
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('class')}
                  className="px-4 py-3 rounded-2xl border border-purple-200 bg-purple-50 text-slate-700 font-bold hover:bg-purple-100 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextFromLang}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-base shadow-md shadow-amber-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: LOGIN / SIGNUP */}
          {step === 'auth' && (
            <motion.form
              key="step-auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleFinalSubmit}
              className="space-y-4"
            >
              <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg">
                  {name ? name.charAt(0).toUpperCase() : 'B'}
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-900">{name || 'Young Explorer'}</div>
                  <div className="text-xs text-slate-600 font-semibold">
                    {classGrade} Standard • {preferredLang === 'en' ? 'English' : preferredLang === 'hi' ? 'हिंदी' : 'मराठी'}
                  </div>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex p-1 bg-purple-50 border border-purple-200 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAuthMode('create')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    authMode === 'create' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Login
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {authMode === 'create' ? 'Create a 4-Digit Secret PIN (Easy to remember)' : 'Enter your 4-Digit Secret PIN'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={secretPin}
                  onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-center text-2xl tracking-widest font-black text-slate-900 outline-none"
                />
                <p className="text-[11px] text-slate-500 text-center mt-1">
                  🛡️ Safe & Private: No emails, phone numbers, or passwords needed!
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('lang')}
                  className="px-4 py-3 rounded-2xl border border-purple-200 bg-purple-50 text-slate-700 font-bold hover:bg-purple-100 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg shadow-md shadow-emerald-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{authMode === 'create' ? 'Start My Journey 🌟' : 'Welcome Back 🚀'}</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
