import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, AlertCircle, Sparkles } from 'lucide-react';
import { cleanSpeechTranscript } from '../utils/speechCleaner';
import { sounds } from '../utils/soundEffects';

interface VoiceButtonProps {
  onTranscript: (cleanedText: string, rawText: string) => void;
  selectedLanguage?: 'en' | 'hi' | 'mr';
  onLanguageChange?: (lang: 'en' | 'hi' | 'mr') => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  selectedLanguage = 'en',
  onLanguageChange,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const langCodes: Record<'en' | 'hi' | 'mr', string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN'
  };

  useEffect(() => {
    // Check Web Speech API availability in window
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    if (disabled) return;
    setErrorMessage(null);
    setInterimText('');

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage("Voice practice isn't supported in this browser. Try Chrome or another supported browser.");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = langCodes[selectedLanguage] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        sounds.playPop();
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTrans += transcript;
          } else {
            interimTrans += transcript;
          }
        }

        if (interimTrans) {
          setInterimText(interimTrans);
        }

        if (finalTrans) {
          // Apply speech-to-text cleaning per Section 10
          const cleaned = cleanSpeechTranscript(finalTrans);
          setInterimText(cleaned);
          sounds.playStarDing();
          onTranscript(cleaned, finalTrans);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setErrorMessage('Please allow microphone access to practice speaking with BolBuddy!');
        } else if (event.error !== 'no-speech') {
          setErrorMessage('Could not hear clearly. Please tap the mic and try speaking again!');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMessage('Could not start voice recognition. Please try again!');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
    sounds.playPop();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto select-none px-2">
      {/* Voice Language Selector - Clean Light Rounded Selector */}
      <div className="flex flex-wrap items-center justify-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-purple-200/80 shadow-xs mb-1.5 max-w-full">
        <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 pl-2 pr-1">Language:</span>
        {(['en', 'hi', 'mr'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => {
              if (onLanguageChange) onLanguageChange(lang);
              sounds.playPop();
            }}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              selectedLanguage === lang
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs border border-purple-400/40'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
            }`}
          >
            {lang === 'en' && '🎤 English'}
            {lang === 'hi' && '🎤 हिंदी'}
            {lang === 'mr' && '🎤 मराठी'}
          </button>
        ))}
      </div>

      {/* Large Microphone Action Button with Soft Glow */}
      <div className="relative flex items-center justify-center my-1">
        {/* Animated Sound Wave Rings while Listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-rose-400/30 -z-10 blur-sm pointer-events-none"
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            />
            <motion.div
              className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-purple-400/30 -z-10 blur-xs pointer-events-none"
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.1, delay: 0.2 }}
            />
          </>
        )}

        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full flex flex-col items-center justify-center text-white transition-all cursor-pointer border-3 sm:border-4 ${
            isListening
              ? 'bg-gradient-to-b from-rose-400 to-pink-500 border-rose-200 shadow-[0_8px_25px_rgba(244,63,94,0.35)]'
              : 'bg-gradient-to-b from-purple-500 via-indigo-500 to-sky-400 border-white shadow-[0_8px_25px_rgba(147,51,234,0.3)] hover:brightness-105'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 animate-pulse text-white" />
              <span className="bg-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-600 px-1.5 py-0.5 rounded-full animate-pulse mt-0.5 shadow-xs">
                Listening
              </span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-sm" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white mt-0.5 drop-shadow-xs">
                TAP TO SPEAK
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Real-time speech preview / hint */}
      <div className="min-h-[22px] text-center px-4 mt-0.5">
        {isListening ? (
          <p className="text-xs md:text-sm font-black text-purple-800 animate-pulse flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Listening to your voice... Speak now!</span>
          </p>
        ) : interimText ? (
          <p className="text-xs font-semibold text-purple-900 italic line-clamp-2">
            "{interimText}"
          </p>
        ) : (
          <p className="text-[11px] sm:text-xs font-bold text-slate-500">
            Tap microphone to speak with BolBuddy!
          </p>
        )}
      </div>

      {/* Error or Browser compatibility banner */}
      {(!isSupported || errorMessage) && (
        <div className="mt-1.5 p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-bold shadow-xs max-w-sm text-left">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>
            {errorMessage || "Voice practice isn't supported in this browser. Try Chrome or another supported browser."}
          </span>
        </div>
      )}
    </div>
  );
};
