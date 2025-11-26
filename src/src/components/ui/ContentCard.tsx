import React from "react";

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  children,
  className = "",
}) => (
  <div
    className={`bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm rounded-xl p-6 md:p-8 animate-in ${className}`}
  >
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
      {title}
    </h2>
    {children}
  </div>
);
