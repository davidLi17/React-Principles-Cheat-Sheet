import React, { useState } from 'react';
import { RefreshCwIcon } from '../icons';

export const DoubleBufferingDiagram: React.FC = () => {
  const [isSwapped, setIsSwapped] = useState(false);

  return (
    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 items-center">
        <h3 className="text-slate-700 dark:text-slate-300 font-bold">内存中的两棵树</h3>
        <button
          onClick={() => setIsSwapped(!isSwapped)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-full flex items-center gap-2 transition-colors"
        >
          <RefreshCwIcon
            size={12}
            className={isSwapped ? 'animate-spin' : ''}
          />
          模拟 Commit 交换
        </button>
      </div>

      <div className="relative w-full h-48 flex items-center justify-center gap-8">
        {/* Tree A */}
        <div
          className={`transition-all duration-700 absolute w-40 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2
          ${
            isSwapped
              ? 'translate-x-32 border-green-500 bg-green-100 dark:bg-green-900/10'
              : '-translate-x-32 border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800/30'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-current opacity-80 mb-2"></div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-current opacity-60"></div>
            <div className="w-6 h-6 rounded-full bg-current opacity-60"></div>
          </div>
          <span
            className={`mt-2 text-xs font-bold uppercase ${
              isSwapped ? 'text-green-600 dark:text-green-500' : 'text-slate-500'
            }`}
          >
            {isSwapped ? 'Current (屏幕显示)' : 'WorkInProgress (后台)'}
          </span>
        </div>

        {/* Tree B */}
        <div
          className={`transition-all duration-700 absolute w-40 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2
          ${
            isSwapped
              ? '-translate-x-32 border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800/30'
              : 'translate-x-32 border-green-500 bg-green-100 dark:bg-green-900/10'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-current opacity-80 mb-2"></div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-current opacity-60"></div>
            <div className="w-6 h-6 rounded-full bg-current opacity-60"></div>
          </div>
          <span
            className={`mt-2 text-xs font-bold uppercase ${
              isSwapped ? 'text-slate-500' : 'text-green-600 dark:text-green-500'
            }`}
          >
            {isSwapped ? 'WorkInProgress (后台)' : 'Current (屏幕显示)'}
          </span>
        </div>

        {/* Arrows indicating swap */}
        <div className="absolute text-slate-400 dark:text-slate-600 pointer-events-none">
          <RefreshCwIcon size={32} />
        </div>
      </div>
      <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 text-center max-w-sm">
        后台构建 WIP 树，计算完成后，React 只需要修改
        <span className="text-yellow-600 dark:text-yellow-400 font-mono">root.current</span>
        指针指向新树。瞬间完成，无闪烁。
      </p>
    </div>
  );
};
