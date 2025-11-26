import React from 'react';
import { ContentCard } from '../ui/ContentCard';
import { QuestionCard } from '../ui/QuestionCard';
import { interviewQuestions } from '../../data';

export const InterviewPage: React.FC = () => {
  const level1 = interviewQuestions.filter(q => q.difficulty === 1);
  const level2 = interviewQuestions.filter(q => q.difficulty === 2);
  const level3 = interviewQuestions.filter(q => q.difficulty === 3);

  return (
    <ContentCard title="面试题库 (Cheat Sheet)">
      <div className="space-y-6">
        <div>
          <h3 className="text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-wider mb-3">
            Level 1: 基础认知
          </h3>
          {level1.map(q => (
            <QuestionCard
              key={q.id}
              question={q.question}
              answer={q.answer}
              difficulty={q.difficulty}
            />
          ))}
        </div>

        <div>
          <h3 className="text-yellow-600 dark:text-yellow-400 text-sm font-bold uppercase tracking-wider mb-3 mt-6">
            Level 2: 进阶原理
          </h3>
          {level2.map(q => (
            <QuestionCard
              key={q.id}
              question={q.question}
              answer={q.answer}
              difficulty={q.difficulty}
            />
          ))}
        </div>

        <div>
          <h3 className="text-red-600 dark:text-red-400 text-sm font-bold uppercase tracking-wider mb-3 mt-6">
            Level 3: 专家/源码
          </h3>
          {level3.map(q => (
            <QuestionCard
              key={q.id}
              question={q.question}
              answer={q.answer}
              difficulty={q.difficulty}
            />
          ))}
        </div>
      </div>
    </ContentCard>
  );
};
