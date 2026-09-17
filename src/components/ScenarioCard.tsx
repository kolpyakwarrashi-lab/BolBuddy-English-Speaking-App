import React from 'react';
import { motion } from 'motion/react';
import { Scenario } from '../types';
import { ArrowRight } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(scenario)}
      className="bg-white rounded-3xl p-5 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-4xl p-2.5 rounded-2xl bg-purple-50 border border-purple-100 inline-block group-hover:scale-110 transition-transform shadow-xs">
            {scenario.icon}
          </span>
          <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 bg-purple-100 border border-purple-200 text-purple-800 rounded-full">
            {scenario.recommendedGrade}
          </span>
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-purple-700 transition-colors font-heading">
          {scenario.title}
        </h3>
        <p className="text-xs font-semibold text-slate-600 leading-relaxed">
          {scenario.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-purple-700 group-hover:text-purple-900 text-xs font-black transition-colors">
        <span>Roleplay with BolBuddy</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};
