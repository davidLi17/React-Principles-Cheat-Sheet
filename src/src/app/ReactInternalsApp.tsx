import { useKeyPress } from "ahooks";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

import { SearchModal } from "@/components/ui/SearchModal";
import { routePaths, type TabId } from "./constants/routes";
import { AppRoutes } from "./layout/AppRoutes";
import { Sidebar } from "./layout/Sidebar";

const AppContent: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useKeyPress(
    ["ctrl.k", "meta.k"],
    (e) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName?.toLowerCase();

      const isEditable =
        !!el?.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (tag === "div" && el?.getAttribute("role") === "textbox");

      if (e.isComposing || isEditable) return;

      e.preventDefault();
      setIsSearchOpen(true);
    },
    { exactMatch: true }
  );
  const handleNavigate = (pageId: string) => {
    const id = pageId as TabId;
    navigate(routePaths[id]);
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-blue-500/30 flex flex-col md:flex-row overflow-hidden ${
        theme === "light" ? "bg-slate-50" : "bg-slate-950"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        pathname={location.pathname}
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto p-4 md:p-8 relative h-screen ${
          theme === "light" ? "bg-slate-50" : ""
        }`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-500/5 dark:bg-blue-900/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 pb-20">
          <AppRoutes />
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
