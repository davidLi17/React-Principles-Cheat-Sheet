// 类型定义
export interface IconProps {
  size?: number;
  className?: string;
  [key: string]: unknown;
}

export interface NavItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  active: boolean;
  onClick: (id: string) => void;
}

export interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface QuestionCardProps {
  question: string;
  answer: string;
  difficulty: 1 | 2 | 3;
}

export interface SearchItem {
  id: string;
  title: string;
  content: string;
  type: "concept" | "interview" | "page";
  page?: string;
}

export interface Note {
  id: string;
  content: string;
  pageId: string;
  createdAt: number;
  updatedAt: number;
}

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export interface FiberNode {
  type: string;
  props?: Record<string, unknown>;
  children?: FiberNode[];
}

export type TabId =
  | "mental-model"
  | "engine"
  | "pipeline"
  | "source-code"
  | "api"
  | "interview"
  | "path"
  | "fiber-visualizer"
  | "notes";
