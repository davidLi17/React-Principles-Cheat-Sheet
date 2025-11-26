import React from 'react';
import { ContentCard } from '../ui/ContentCard';
import { PipelineDiagram } from '../diagrams/PipelineDiagram';
import { ZapIcon, RefreshCwIcon } from '../icons';

export const PipelinePage: React.FC = () => {
  return (
    <ContentCard title="运行时：流水线">
      <div className="space-y-8">
        <p className="text-slate-500 dark:text-slate-400">
          当你在组件中调用 <code className="text-blue-500">setState</code>{' '}
          时，React 内部发生了什么？
        </p>

        <PipelineDiagram />

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-slate-800 dark:text-white font-bold mb-3 flex items-center gap-2">
              <ZapIcon size={18} className="text-yellow-500" />
              Scheduler (调度器)
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              React 自己实现的"交通指挥官"。
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
                <span>SyncLane (1)</span>
                <span className="text-red-500">最高优 (同步)</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
                <span>InputContinuousLane</span>
                <span className="text-yellow-500">高优 (输入)</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>DefaultLane</span>
                <span className="text-blue-500">低优 (数据请求)</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">
              * 利用位运算 (Bitwise) 高效处理优先级。
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-slate-800 dark:text-white font-bold mb-3 flex items-center gap-2">
              <RefreshCwIcon size={18} className="text-blue-500" />
              Diff 策略
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              为了达到 O(n) 复杂度，React 做了大胆假设：
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-4">
              <li>
                <strong className="text-slate-700 dark:text-slate-200">同级比较：</strong> 不跨层级比对。
              </li>
              <li>
                <strong className="text-slate-700 dark:text-slate-200">类型比较：</strong> 组件 Type 变了 (Div {'->'}{' '}
                P)，直接销毁重建。
              </li>
              <li>
                <strong className="text-slate-700 dark:text-slate-200">Key：</strong> 在列表更新中，通过 Key
                识别节点是"移动"了还是"销毁"了。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ContentCard>
  );
};
