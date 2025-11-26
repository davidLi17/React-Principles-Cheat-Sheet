import React from 'react';
import { ContentCard } from '../ui/ContentCard';
import { SourceCodeFlowDiagram } from '../diagrams/SourceCodeFlowDiagram';

export const SourceCodePage: React.FC = () => {
  return (
    <ContentCard title="源码调用链">
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        从 React 组件的调用开始，展示组件的渲染过程。支持自动播放演示。
      </p>
      <SourceCodeFlowDiagram />
    </ContentCard>
  );
};
