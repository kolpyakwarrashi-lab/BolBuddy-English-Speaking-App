import React, { useState } from 'react';
import { Theater, Sparkles } from 'lucide-react';
import { SCENARIOS } from '../data/learningContent';
import { Scenario, ClassGrade } from '../types';
import { ScenarioCard } from './ScenarioCard';
import { sounds } from '../utils/soundEffects';

interface ScenariosViewProps {
  currentGrade: ClassGrade;
  onSelectScenario: (scenario: Scenario) => void;
  onBack: () => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  currentGrade,
  onSelectScenario,
  onBack
}) => {
  const [filter, setFilter] = useState<'all' | 'my-grade'>('all');

  const filteredScenarios = filter === 'my-grade'
    ? SCENARIOS.filter((s) => s.targetGrades.includes(currentGrade))
    : SCENARIOS;

  const handleSelect = (scenario: Scenario) => {
    sounds.playPop();
    onSelectScenario(scenario);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Banner - Light Child-Friendly Theme */}
      <div className="bg-gradient-to-br from-indigo-100/90 via-purple-50/90 to-pink-100/80 rounded-3xl p-6 md:p-8 text-slate-800 shadow-sm relative overflow-hidden border border-purple-200/80 backdrop-blur-xl">
        <div className="absolute right-4 bottom-2 text-8xl opacity-15 select-none pointer-events-none">
          🎭
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-purple-800 border border-purple-200 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Real-Life English Practice</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-heading bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-indigo-700 to-pink-600">
              Real-Life Conversation Scenarios 🎭
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1 max-w-xl">
              Practice ordering food, speaking with doctors, greeting new friends, answering phone calls and more with BolBuddy!
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-bold border border-purple-200 text-xs shrink-0 shadow-xs cursor-pointer transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Filter Tabs - Clean Light Rounded Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-purple-200/80 shadow-xs max-w-full">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs border border-purple-400/40'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
            }`}
          >
            All 10 Scenarios
          </button>
          <button
            type="button"
            onClick={() => setFilter('my-grade')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'my-grade'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs border border-purple-400/40'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
            }`}
          >
            Recommended for {currentGrade} Standard
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500 hidden sm:inline">
          Showing {filteredScenarios.length} scenarios
        </span>
      </div>

      {/* Grid of 10 Real-life scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};
