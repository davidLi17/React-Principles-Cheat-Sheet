import React, { useState, useEffect } from "react";

// Context
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

// Components
import { NavItem } from "../components/ui/NavItem";
import { SearchModal } from "../components/ui/SearchModal";

// Icons
import {
  LayoutIcon,
  CpuIcon,
  LayersIcon,
  CodeIcon,
  HelpCircleIcon,
  ArrowRightIcon,
  GitBranchIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
  TreeIcon,
  FileTextIcon,
} from "../components/icons";

// Pages
import {
  MentalModelPage,
  EnginePage,
  PipelinePage,
  SourceCodePage,
  ApiPage,
  InterviewPage,
  LearningPathPage,
  FiberVisualizerPage,
  NotesPage,
} from "../components/pages";

type TabId =
  | "mental-model"
  | "engine"
  | "pipeline"
  | "source-code"
  | "api"
  | "interview"
  | "path"
  | "fiber-visualizer"
  | "notes";

// 主应用内容组件
const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("mental-model");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (pageId: string) => {
    console.log("🔍LHG:app/ReactInternalsApp.tsx pageId:::", pageId);
    setActiveTab(pageId as TabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "mental-model":
        return <MentalModelPage />;
      case "engine":
        return <EnginePage />;
      case "pipeline":
        return <PipelinePage />;
      case "source-code":
        return <SourceCodePage />;
      case "api":
        return <ApiPage />;
      case "interview":
        return <InterviewPage />;
      case "path":
        return <LearningPathPage />;
      case "fiber-visualizer":
        return <FiberVisualizerPage />;
      case "notes":
        return <NotesPage currentPage={activeTab} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-blue-500/30 flex flex-col md:flex-row overflow-hidden ${
        theme === "light" ? "bg-slate-50" : "bg-slate-950"
      }`}
    >
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col h-auto md:h-screen">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
            React Internals
          </h1>
          <p className="text-xs text-slate-500 mt-1">深度原理全景通关手册</p>
        </div>

        {/* 工具栏 */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          {/* 搜索按钮 */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 text-sm transition-colors"
          >
            <SearchIcon size={16} />
            <span>搜索...</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">
              ⌘K
            </kbd>
          </button>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
            title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavItem
            id="mental-model"
            label="核心世界观"
            icon={LayoutIcon}
            active={activeTab === "mental-model"}
            onClick={handleNavigate}
          />
          <NavItem
            id="engine"
            label="引擎室 (架构)"
            icon={CpuIcon}
            active={activeTab === "engine"}
            onClick={handleNavigate}
          />
          <NavItem
            id="pipeline"
            label="渲染流水线"
            icon={LayersIcon}
            active={activeTab === "pipeline"}
            onClick={handleNavigate}
          />
          <NavItem
            id="source-code"
            label="源码调用链"
            icon={GitBranchIcon}
            active={activeTab === "source-code"}
            onClick={handleNavigate}
          />
          <NavItem
            id="api"
            label="API 原理"
            icon={CodeIcon}
            active={activeTab === "api"}
            onClick={handleNavigate}
          />

          <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>

          <NavItem
            id="fiber-visualizer"
            label="Fiber 可视化"
            icon={TreeIcon}
            active={activeTab === "fiber-visualizer"}
            onClick={handleNavigate}
          />
          <NavItem
            id="interview"
            label="面试作弊表"
            icon={HelpCircleIcon}
            active={activeTab === "interview"}
            onClick={handleNavigate}
          />
          <NavItem
            id="path"
            label="学习路线"
            icon={ArrowRightIcon}
            active={activeTab === "path"}
            onClick={handleNavigate}
          />

          <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>

          <NavItem
            id="notes"
            label="我的笔记"
            icon={FileTextIcon}
            active={activeTab === "notes"}
            onClick={handleNavigate}
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center hidden md:block">
          React Principle Mastery v2.0
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto p-4 md:p-8 relative h-screen ${
          theme === "light" ? "bg-slate-50" : ""
        }`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-500/5 dark:bg-blue-900/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 pb-20">
          {renderContent()}
        </div>
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

// 根组件 - 包含 Provider
export const ReactInternalsApp: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default ReactInternalsApp;
