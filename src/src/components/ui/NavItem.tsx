import React from "react";
import type { IconProps } from "../icons";

interface NavItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  active: boolean;
  onClick: (id: string) => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  id,
  label,
  icon: Icon,
  active,
  onClick,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active
        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:bg-blue-600/20 dark:text-blue-400"
        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
    }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm md:text-base">{label}</span>
  </button>
);
