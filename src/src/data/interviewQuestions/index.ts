/**
 * 面试题数据模块统一导出
 */

// 类型导出
export type {
  InterviewQuestion,
  InterviewCategory,
  DifficultyLevel,
  DifficultyConfig,
  CategoryConfig,
} from "./types";

// 配置导出
export { categories, difficultyConfigMap, fuseOptions } from "./categories";

// 各级别题目导出
export { level1Questions } from "./level1-basic";
export { level2Questions } from "./level2-advanced";
export { level3Questions } from "./level3-expert";

// 导入并合并所有题目
import { level1Questions } from "./level1-basic";
import { level2Questions } from "./level2-advanced";
import { level3Questions } from "./level3-expert";

/**
 * 所有面试题（合并）
 */
export const allInterviewQuestions = [
  ...level1Questions,
  ...level2Questions,
  ...level3Questions,
];

/**
 * 按难度获取题目
 */
export const getQuestionsByLevel = (level: 1 | 2 | 3) => {
  switch (level) {
    case 1:
      return level1Questions;
    case 2:
      return level2Questions;
    case 3:
      return level3Questions;
  }
};

/**
 * 题目统计
 */
export const questionStats = {
  total:
    level1Questions.length + level2Questions.length + level3Questions.length,
  level1: level1Questions.length,
  level2: level2Questions.length,
  level3: level3Questions.length,
};
