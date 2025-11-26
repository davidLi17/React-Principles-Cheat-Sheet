import React from 'react';
import { ContentCard } from '../ui/ContentCard';
import { CodeIcon } from '../icons';

export const ApiPage: React.FC = () => {
  return (
    <ContentCard title="开发者接口 (API)">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CodeIcon size={20} className="text-pink-500" /> Hooks 原理
            </h3>
            <div className="text-slate-500 dark:text-slate-400 text-sm space-y-2 leading-relaxed">
              <p>
                Hooks 在底层其实是 Fiber 节点上的一个{' '}
                <strong className="text-slate-700 dark:text-slate-200">单向链表</strong> (
                <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">
                  memoizedState
                </code>
                )。
              </p>
              <p className="p-3 bg-red-100 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded text-red-600 dark:text-red-300">
                <strong>铁律：</strong>不能在 if/for 里调用 Hooks。
              </p>
              <p>
                因为 React 完全依赖 <strong className="text-slate-700 dark:text-slate-200">调用顺序 (Index)</strong>{' '}
                来找到对应的 State。如果顺序乱了，State 就会张冠李戴。
              </p>
            </div>
          </div>
          {/* Hooks Chain Visualization */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 mb-2">
              Fiber Node's memoizedState
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-48 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-2 rounded text-xs text-center relative">
                useState (count)
                <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <div className="w-48 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-2 rounded text-xs text-center mt-2 relative">
                useEffect (title)
                <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <div className="w-48 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-2 rounded text-xs text-center mt-2">
                useState (user)
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-slate-800 dark:text-white font-bold mb-2">
              合成事件 (Synthetic Events)
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              React 不会将事件绑定在具体的 DOM 节点上，而是利用
              <strong className="text-slate-700 dark:text-slate-200">事件委托</strong>绑定在 Root
              容器上。这抹平了浏览器差异，也极大地减少了内存消耗。
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-slate-800 dark:text-white font-bold mb-2">
              并发特性 (Concurrent)
            </h4>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
              <li>
                <code className="text-yellow-600 dark:text-yellow-400">useTransition</code>:
                将更新标记为"非紧急"，允许被中断。
              </li>
              <li>
                <code className="text-yellow-600 dark:text-yellow-400">useDeferredValue</code>:
                创建数据的延迟副本，实现 UI 的智能防抖。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ContentCard>
  );
};
