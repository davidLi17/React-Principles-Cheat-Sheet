import React from "react";
import type { ThemeMode } from "../../types";
import { NavItem } from "../../components/ui/NavItem";
import {
  LayoutIcon,
  CpuIcon,
  LayersIcon,
  GitBranchIcon,
  CodeIcon,
  TreeIcon,
  HelpCircleIcon,
  ArrowRightIcon,
  FileTextIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
} from "../../components/icons";

interface SidebarProps {
  pathname: string;
  theme: ThemeMode;
  toggleTheme: () => void;
  onNavigate: (id: string) => void;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pathname,
  theme,
  toggleTheme,
  onNavigate,
  onOpenSearch,
}) => {
  return (
    <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col h-auto md:h-screen">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
          React Internals
        </h1>
        <p className="text-xs text-slate-500 mt-1">深度原理全景通关手册</p>
      </div>

      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 text-sm transition-colors"
        >
          <SearchIcon size={16} />
          <span>搜索...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">⌘K</kbd>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
          title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
        >
          {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <NavItem id="mental-model" label="核心世界观" icon={LayoutIcon} active={pathname === "/"} onClick={onNavigate} />
        <NavItem id="engine" label="引擎室 (架构)" icon={CpuIcon} active={pathname === "/engine"} onClick={onNavigate} />
        <NavItem id="pipeline" label="渲染流水线" icon={LayersIcon} active={pathname === "/pipeline"} onClick={onNavigate} />
        <NavItem id="source-code" label="源码调用链" icon={GitBranchIcon} active={pathname === "/source-code"} onClick={onNavigate} />
        <NavItem id="api" label="API 原理" icon={CodeIcon} active={pathname === "/api"} onClick={onNavigate} />

        <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>

        <NavItem id="fiber-visualizer" label="Fiber 可视化" icon={TreeIcon} active={pathname === "/fiber-visualizer"} onClick={onNavigate} />
        <NavItem id="interview" label="面试作弊表" icon={HelpCircleIcon} active={pathname === "/interview"} onClick={onNavigate} />
        <NavItem id="path" label="学习路线" icon={ArrowRightIcon} active={pathname === "/path"} onClick={onNavigate} />

        <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>

        <NavItem id="notes" label="我的笔记" icon={FileTextIcon} active={pathname === "/notes"} onClick={onNavigate} />
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center hidden md:block">
        React Principle Mastery v2.0
      </div>
    </div>
  );
};

