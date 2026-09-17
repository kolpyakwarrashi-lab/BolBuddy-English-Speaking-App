import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BuddyAvatarType } from '../types';

interface BolBuddyAvatarProps {
  type?: BuddyAvatarType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  mood?: 'happy' | 'encouraging' | 'waving' | 'thinking' | 'celebrating';
  className?: string;
}

export const BolBuddyAvatar: React.FC<BolBuddyAvatarProps> = ({
  type = 'boy',
  size = 'md',
  isSpeaking = false,
  mood = 'happy',
  className = ''
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  const sizeDimensions = {
    sm: { w: 48, h: 48, scale: 0.5 },
    md: { w: 84, h: 84, scale: 0.8 },
    lg: { w: 120, h: 120, scale: 1.1 },
    xl: { w: 180, h: 180, scale: 1.6 }
  }[size];

  const themeColors = {
    boy: {
      primary: '#3B82F6', // Blue
      secondary: '#60A5FA',
      accent: '#F59E0B',
      skin: '#FCD34D',
      hair: '#78350F',
      shirt: '#2563EB',
      cap: '#EF4444'
    },
    girl: {
      primary: '#EC4899', // Pink
      secondary: '#F472B6',
      accent: '#8B5CF6',
      skin: '#FDE68A',
      hair: '#92400E',
      shirt: '#DB2777',
      cap: '#A855F7'
    },
    robot: {
      primary: '#10B981', // Emerald
      secondary: '#34D399',
      accent: '#FBBF24',
      skin: '#E2E8F0',
      hair: '#64748B',
      shirt: '#059669',
      cap: '#0284C7'
    }
  }[type];

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: sizeDimensions.w, height: sizeDimensions.h }}
      animate={
        mood === 'celebrating'
          ? { y: [0, -12, 0, -8, 0], rotate: [0, -4, 4, -2, 0] }
          : mood === 'waving'
          ? { y: [0, -4, 0] }
          : { y: [0, -3, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: mood === 'celebrating' ? 1.2 : 3,
        ease: 'easeInOut'
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        {/* Soft Background Glow / Halo */}
        <circle cx="50" cy="50" r="46" fill={themeColors.secondary} opacity="0.25" />

        {/* Character Head / Base */}
        {type === 'robot' ? (
          // Robot Head
          <g>
            {/* Robot Antenna */}
            <line x1="50" y1="20" x2="50" y2="8" stroke={themeColors.primary} strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="8" r="5" fill={themeColors.accent}>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {/* Robot Face Box */}
            <rect x="22" y="20" width="56" height="52" rx="14" fill={themeColors.skin} stroke={themeColors.primary} strokeWidth="3" />
            {/* Screen inner */}
            <rect x="28" y="26" width="44" height="40" rx="8" fill="#1E293B" />
          </g>
        ) : (
          // Boy or Girl Human Character
          <g>
            {/* Hair Back */}
            <circle cx="50" cy="46" r="34" fill={themeColors.hair} />
            {type === 'girl' && (
              <>
                {/* Girl Pigtails / Buns */}
                <circle cx="18" cy="40" r="12" fill={themeColors.hair} />
                <circle cx="82" cy="40" r="12" fill={themeColors.hair} />
                <circle cx="18" cy="40" r="6" fill={themeColors.shirt} />
                <circle cx="82" cy="40" r="6" fill={themeColors.shirt} />
              </>
            )}
            {/* Head */}
            <circle cx="50" cy="48" r="30" fill={themeColors.skin} />
            {/* Hair Front Bangs */}
            {type === 'boy' ? (
              <path
                d="M 22 42 C 28 26, 72 26, 78 42 C 68 34, 48 32, 22 42 Z"
                fill={themeColors.hair}
              />
            ) : (
              <path
                d="M 20 40 C 26 24, 74 24, 80 40 C 72 32, 60 36, 50 32 C 40 36, 28 32, 20 40 Z"
                fill={themeColors.hair}
              />
            )}
            {/* Cute Cap / Headband */}
            {type === 'boy' ? (
              <path
                d="M 22 36 C 30 20, 70 20, 78 36 L 86 36 C 88 36, 88 32, 82 30 C 72 16, 28 16, 18 30 C 12 32, 12 36, 22 36 Z"
                fill={themeColors.cap}
              />
            ) : (
              <path
                d="M 24 38 C 30 26, 70 26, 76 38"
                fill="none"
                stroke={themeColors.cap}
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
          </g>
        )}

        {/* Cheeks blush */}
        <ellipse cx="33" cy="56" rx="5" ry="3" fill="#F43F5E" opacity="0.35" />
        <ellipse cx="67" cy="56" rx="5" ry="3" fill="#F43F5E" opacity="0.35" />

        {/* Eyes */}
        {isBlinking ? (
          // Blinking eyes (smiling slits)
          <g stroke={type === 'robot' ? '#38BDF8' : '#1F2937'} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 33 48 Q 38 52 43 48" />
            <path d="M 57 48 Q 62 52 67 48" />
          </g>
        ) : (
          // Open bright sparkly eyes
          <g>
            <circle cx="38" cy="48" r="5.5" fill={type === 'robot' ? '#38BDF8' : '#1F2937'} />
            <circle cx="36" cy="46" r="2" fill="#FFFFFF" />
            <circle cx="62" cy="48" r="5.5" fill={type === 'robot' ? '#38BDF8' : '#1F2937'} />
            <circle cx="60" cy="46" r="2" fill="#FFFFFF" />
          </g>
        )}

        {/* Mouth with speaking animation */}
        {isSpeaking ? (
          <ellipse
            cx="50"
            cy="62"
            rx="6"
            ry="5"
            fill="#E11D48"
          >
            <animate attributeName="ry" values="2;6;2" dur="0.25s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          // Warm smiling mouth
          <path
            d="M 42 60 Q 50 68 58 60"
            fill="none"
            stroke={type === 'robot' ? '#38BDF8' : '#B91C1C'}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        )}

        {/* Waving Hand for mood === 'waving' or celebrating */}
        {(mood === 'waving' || mood === 'celebrating') && (
          <g className="origin-bottom-right">
            <motion.path
              d="M 80 62 C 86 54, 94 56, 95 65 C 95 72, 85 75, 78 72 Z"
              fill={themeColors.skin}
              stroke={themeColors.primary}
              strokeWidth="2"
              animate={{ rotate: [0, 18, -12, 18, 0] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              style={{ originX: '80px', originY: '70px' }}
            />
            {/* Little spark waves */}
            <motion.path
              d="M 92 48 Q 96 52 92 56"
              fill="none"
              stroke={themeColors.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </g>
        )}

        {/* Star Badge near collar */}
        <polygon
          points="50,72 52,77 57,77 53,80 55,85 50,82 45,85 47,80 43,77 48,77"
          fill="#F59E0B"
        />
      </svg>
    </motion.div>
  );
};
