import { BookOpenIcon, CodeIcon, ZapIcon } from "../../components/icons";
import type {
  CategoryConfig,
  DifficultyConfig,
  DifficultyLevel,
} from "./types";

/**
 * 分类配置
 */
export const categories: CategoryConfig[] = [
  { key: "all", label: "全部", icon: BookOpenIcon },
  { key: "concept", label: "核心概念", icon: BookOpenIcon },
  { key: "hooks", label: "Hooks", icon: CodeIcon },
  { key: "fiber", label: "Fiber 架构", icon: ZapIcon },
  { key: "performance", label: "性能优化", icon: ZapIcon },
  { key: "concurrent", label: "并发特性", icon: ZapIcon },
];

/**
 * 难度配置
 */
export const difficultyConfigMap: Record<DifficultyLevel, DifficultyConfig> = {
  1: {
    color: "success",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-600 dark:text-green-400",
    label: "基础",
  },
  2: {
    color: "warning",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-600 dark:text-yellow-400",
    label: "进阶",
  },
  3: {
    color: "danger",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-600 dark:text-red-400",
    label: "专家",
  },
};

/**
 * Fuse.js 模糊搜索配置
 */
export const fuseOptions = {
  keys: [
    { name: "question", weight: 0.4 },
    { name: "answer", weight: 0.3 },
    { name: "keyPoints", weight: 0.2 },
    { name: "code", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
};
