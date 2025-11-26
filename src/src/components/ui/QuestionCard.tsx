import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '../icons';

interface QuestionCardProps {
  question: string;
  answer: string;
  difficulty: 1 | 2 | 3;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, difficulty }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = {
    1: 'border-green-500/50 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/10',
    2: 'border-yellow-500/50 text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/10',
    3: 'border-red-500/50 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/10',
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 overflow-hidden mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="font-medium text-slate-700 dark:text-slate-200 pr-4">{question}</span>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] px-2 py-0.5 rounded border ${colors[difficulty]}`}
          >
            Level {difficulty}
          </span>
          {isOpen ? (
            <ChevronDownIcon size={16} className="text-slate-400" />
          ) : (
            <ChevronRightIcon size={16} className="text-slate-400" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-slate-600 dark:text-slate-400 text-sm border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};
