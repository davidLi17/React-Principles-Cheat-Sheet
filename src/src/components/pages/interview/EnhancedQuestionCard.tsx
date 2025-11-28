import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip } from "@nextui-org/react";
import { Highlight, themes } from "prism-react-renderer";
import { ChevronRightIcon, CheckIcon } from "../../icons";
import type {
  InterviewQuestion,
  DifficultyConfig,
} from "../../../data/interviewQuestions";
import { difficultyConfigMap } from "../../../data/interviewQuestions";

interface EnhancedQuestionCardProps {
  question: InterviewQuestion;
  index: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

/**
 * 增强版问答卡片组件
 */
export const EnhancedQuestionCard: React.FC<EnhancedQuestionCardProps> = ({
  question: q,
  index,
  isCompleted,
  onToggleComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const config: DifficultyConfig = difficultyConfigMap[q.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-xl overflow-hidden ${config.border} ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      {/* 问题标题 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-4 flex justify-between items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${config.bg}`}
      >
        <div className="flex items-start gap-3 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              isCompleted
                ? "bg-green-500 border-green-500"
                : "border-slate-300 dark:border-slate-600"
            }`}
          >
            {isCompleted && <CheckIcon size={12} className="text-white" />}
          </motion.button>
          <span
            className={`font-medium text-slate-700 dark:text-slate-200 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {q.question}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Chip size="sm" color={config.color} variant="flat">
            {config.label}
          </Chip>
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
            <ChevronRightIcon size={16} className="text-slate-400" />
          </motion.div>
        </div>
      </button>

      {/* 答案展开 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-slate-900 space-y-4 border-t border-slate-100 dark:border-slate-800">
              {/* 核心答案 */}
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {q.answer}
              </p>

              {/* 关键要点 */}
              {q.keyPoints && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    关键要点
                  </h5>
                  <ul className="space-y-1">
                    {q.keyPoints.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span className={`${config.text} mt-0.5`}>•</span>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 代码示例 */}
              {q.code && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    代码示例
                  </h5>
                  <Highlight
                    theme={themes.nightOwl}
                    code={q.code.trim()}
                    language="tsx"
                  >
                    {({ style, tokens, getLineProps, getTokenProps }) => (
                      <pre
                        className="p-3 rounded-lg text-xs overflow-x-auto"
                        style={style}
                      >
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              )}

              {/* 追问 */}
              {q.followUp && (
                <div
                  className={`p-3 rounded-lg ${config.bg} border ${config.border}`}
                >
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    💡 可能的追问：
                  </span>
                  <p className={`text-sm mt-1 ${config.text} font-medium`}>
                    {q.followUp}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
