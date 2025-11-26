import React from 'react';
import { CpuIcon, GitCommitIcon } from '../icons';

export const PipelineDiagram: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Phase 1 */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 border-dashed rounded-xl p-4 relative">
          <div className="absolute -top-3 left-4 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded">
            Phase 1: Render
          </div>
          <div className="flex items-center gap-2 mb-2">
            <CpuIcon size={18} className="text-yellow-500" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200">调和 (Reconciliation)</h4>
          </div>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-4">
            <li>在 WIP 树上执行组件函数</li>
            <li>执行 Hooks 链表</li>
            <li>Diff 算法 (打标签 Flags)</li>
          </ul>
          <div className="mt-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-[10px] px-2 py-1 rounded inline-block">
            异步 · 可中断 · 可重复
          </div>
        </div>

        {/* Phase 2 */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 relative">
          <div className="absolute -top-3 left-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
            Phase 2: Commit
          </div>
          <div className="flex items-center gap-2 mb-2">
            <GitCommitIcon size={18} className="text-red-500" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200">提交 (Commit)</h4>
          </div>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-4">
            <li>操作真实 DOM (增删改)</li>
            <li>切换 current 指针</li>
            <li>执行 useEffect 副作用</li>
          </ul>
          <div className="mt-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-[10px] px-2 py-1 rounded inline-block">
            同步 · 不可打断
          </div>
        </div>
      </div>
    </div>
  );
};
