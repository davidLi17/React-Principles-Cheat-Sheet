import React from 'react';
import { ContentCard } from '../ui/ContentCard';
import { BookOpenIcon } from '../icons';

export const LearningPathPage: React.FC = () => {
  return (
    <ContentCard title="学习路线 (Learning Path)">
      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-12 py-4">
        {/* Step 1 */}
        <div className="relative pl-8">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-green-500"></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            阶段一：熟练工 (API)
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
            能写出 Bug 少的业务代码。
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
              useState / useEffect
            </span>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
              Props 通信
            </span>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
              列表渲染
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-8">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500"></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            阶段二：设计师 (逻辑与性能)
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
            代码优雅，复用性高，性能好。
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
              自定义 Hooks
            </span>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
              React.memo / useMemo
            </span>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
              Zustand / Redux
            </span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-8">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-purple-500 animate-pulse"></div>
          <h3 className="text-xl font-bold text-purple-600 dark:text-purple-300 mb-2 flex items-center gap-2">
            阶段三：架构师 (源码与原理)
            <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-300 dark:border-purple-500/50">
              Current
            </span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
            理解框架瓶颈，解决复杂问题。
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border border-purple-300 dark:border-purple-700 px-2 py-1 rounded">
              Fiber 架构
            </span>
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border border-purple-300 dark:border-purple-700 px-2 py-1 rounded">
              调度器 Scheduler
            </span>
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border border-purple-300 dark:border-purple-700 px-2 py-1 rounded">
              Render / Commit
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-lg flex items-start gap-3">
        <BookOpenIcon className="text-blue-500 shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-blue-700 dark:text-blue-300 font-bold text-sm mb-1">
            最后建议
          </h4>
          <p className="text-xs text-blue-600 dark:text-blue-200/70 leading-relaxed">
            不要死磕每一行源码。掌握 <strong>Fiber 链表</strong>、
            <strong>双缓存</strong>、<strong>二进制优先级</strong>{' '}
            这些设计思想比背代码重要得多。
            如果面试能把这些图画出来，你就是 Top 10%。
          </p>
        </div>
      </div>
    </ContentCard>
  );
};
