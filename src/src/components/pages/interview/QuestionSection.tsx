import React from "react";
import { Chip } from "@nextui-org/react";
import type {
  InterviewQuestion,
  DifficultyLevel,
} from "../../../data/interviewQuestions";
import { EnhancedQuestionCard } from "./EnhancedQuestionCard";

interface QuestionSectionProps {
  level: DifficultyLevel;
  questions: InterviewQuestion[];
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
}

/**
 * Level 配置
 */
const levelConfig: Record<
  DifficultyLevel,
  { title: string; color: string; chipColor: "success" | "warning" | "danger" }
> = {
  1: {
    title: "Level 1: 基础认知",
    color: "bg-green-500",
    chipColor: "success",
  },
  2: {
    title: "Level 2: 进阶原理",
    color: "bg-yellow-500",
    chipColor: "warning",
  },
  3: {
    title: "Level 3: 专家/源码",
    color: "bg-red-500",
    chipColor: "danger",
  },
};

/**
 * 问题分组组件
 */
export const QuestionSection: React.FC<QuestionSectionProps> = ({
  level,
  questions,
  completedIds,
  onToggleComplete,
}) => {
  if (questions.length === 0) return null;

  const config = levelConfig[level];
  const textColorMap: Record<DifficultyLevel, string> = {
    1: "text-green-600 dark:text-green-400",
    2: "text-yellow-600 dark:text-yellow-400",
    3: "text-red-600 dark:text-red-400",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        <h3
          className={`${textColorMap[level]} text-sm font-bold uppercase tracking-wider`}
        >
          {config.title}
        </h3>
        <Chip size="sm" variant="flat" color={config.chipColor}>
          {questions.length} 题
        </Chip>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <EnhancedQuestionCard
            key={q.id}
            question={q}
            index={i}
            isCompleted={completedIds.has(q.id)}
            onToggleComplete={() => onToggleComplete(q.id)}
          />
        ))}
      </div>
    </div>
  );
};
