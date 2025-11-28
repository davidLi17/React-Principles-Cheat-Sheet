/**
 * 面试题分类类型
 */
export type InterviewCategory =
  | "concept" // 核心概念
  | "hooks" // Hooks
  | "fiber" // Fiber 架构
  | "performance" // 性能优化
  | "concurrent"; // 并发特性

/**
 * 难度等级
 * 1 = 基础认知
 * 2 = 进阶原理
 * 3 = 专家/源码
 */
export type DifficultyLevel = 1 | 2 | 3;

/**
 * 面试题数据结构
 */
export interface InterviewQuestion {
  /** 唯一标识 */
  id: string;
  /** 问题 */
  question: string;
  /** 核心答案 */
  answer: string;
  /** 难度等级 */
  difficulty: DifficultyLevel;
  /** 分类 */
  category: InterviewCategory;
  /** 代码示例（可选） */
  code?: string;
  /** 关键要点（可选） */
  keyPoints?: string[];
  /** 可能的追问（可选） */
  followUp?: string;
}

/**
 * 难度配置
 */
export interface DifficultyConfig {
  color: "success" | "warning" | "danger";
  bg: string;
  border: string;
  text: string;
  label: string;
}

/**
 * 分类配置
 */
export interface CategoryConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}
