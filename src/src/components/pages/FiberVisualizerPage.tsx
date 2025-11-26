import React from 'react';
import { ContentCard } from '../ui/ContentCard';
import { FiberTreeVisualizer } from '../diagrams/FiberTreeVisualizer';

export const FiberVisualizerPage: React.FC = () => {
  return (
    <ContentCard title="Fiber 树可视化">
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        输入 JSX 代码，实时查看对应的 Fiber 树结构。了解 React 如何将你的组件转换为内部数据结构。
      </p>
      <FiberTreeVisualizer />
    </ContentCard>
  );
};
