import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Globe, School, ShieldCheck, UserCheck, Volume2 } from 'lucide-react';
import { UserProfile, ClassGrade, PreferredLanguage, BuddyAvatarType } from '../types';
import { BolBuddyAvatar } from './BolBuddyAvatar';
import { sounds } from '../utils/soundEffects';

interface SettingsModalProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  onUpdateUser,
  onClose
}) => {
  const [name, setName] = useState(user.name);
  const [classGrade, setClassGrade] = useState<ClassGrade>(user.classGrade);
  const [preferredLanguage, setPreferredLanguage] = useState<PreferredLanguage>(user.preferredLanguage);
  const [avatarType, setAvatarType] = useState<BuddyAvatarType>(user.avatarType);

  const grades: ClassGrade[] = ['2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const handleSave = () => {
    sounds.playSuccess();
    onUpdateUser({
      name: name.trim() || user.name,
      classGrade,
      preferredLanguage,
      avatarType
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl border border-purple-200/80 relative text-left text-slate-800 my-auto"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-slate-500 border border-purple-200 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

        <h2 className="text-xl font-black text-slate-900 font-heading mb-4 flex items-center gap-2">
          <span>Settings & Profile</span>
          <span>⚙️</span>
        </h2>

        <div className="space-y-5">
          {/* Avatar Chooser */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 block mb-2 tracking-wider">
              Choose your AI Buddy Avatar:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['boy', 'girl', 'robot'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setAvatarType(type);
                    sounds.playPop();
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    avatarType === type
                      ? 'border-purple-400 bg-purple-50 shadow-xs text-purple-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <BolBuddyAvatar type={type} size="sm" />
                  <span className="text-xs font-bold capitalize mt-1">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Child Name */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 block mb-1 tracking-wider">
              Your Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={25}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm transition-all"
            />
          </div>

          {/* Class Grade */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 block mb-1.5 tracking-wider">
              Which class are you in?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {grades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => {
                    setClassGrade(grade);
                    sounds.playPop();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    classGrade === grade
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs border border-purple-400/40'
                      : 'bg-purple-50 text-slate-700 hover:bg-purple-100 border border-purple-200/60'
                  }`}
                >
                  {grade} Standard
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 block mb-1.5 tracking-wider">
              Preferred Language for Help:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreferredLanguage('en');
                  sounds.playPop();
                }}
                className={`p-2.5 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  preferredLanguage === 'en'
                    ? 'border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs font-black'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreferredLanguage('hi');
                  sounds.playPop();
                }}
                className={`p-2.5 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  preferredLanguage === 'hi'
                    ? 'border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs font-black'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                🇮🇳 हिंदी
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreferredLanguage('mr');
                  sounds.playPop();
                }}
                className={`p-2.5 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  preferredLanguage === 'mr'
                    ? 'border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs font-black'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                🇮🇳 मराठी
              </button>
            </div>
          </div>

          {/* Safe for Kids Notice */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>BolBuddy protects children's safety and privacy.</span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-slate-950 font-black text-base shadow-md shadow-amber-200 hover:scale-[1.02] transition-all cursor-pointer"
          >
            Save Settings 🌟
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  );
};
