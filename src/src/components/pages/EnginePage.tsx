import React from 'react';
import { ContentCard } from '../ui/ContentCard';
import { FiberStructureDiagram } from '../diagrams/FiberStructureDiagram';
import { DoubleBufferingDiagram } from '../diagrams/DoubleBufferingDiagram';

export const EnginePage: React.FC = () => {
  return (
    <ContentCard title="底层架构：引擎室">
      <div className="space-y-10">
        {/* Fiber */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Fiber 架构</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-slate-500 dark:text-slate-400 text-sm space-y-4">
              <p>
                <strong className="text-slate-700 dark:text-slate-200">是什么：</strong>Fiber
                既是一种数据结构（链表节点），也是一种执行单元。
              </p>
              <p>
                <strong className="text-slate-700 dark:text-slate-200">目的：</strong>
                实现可中断的渲染。将"递归调用栈"变成了"链表循环"。
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>
                  <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-blue-600 dark:text-blue-300">
                    return
                  </code>
                  ：指向父节点
                </li>
                <li>
                  <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-green-600 dark:text-green-300">
                    child
                  </code>
                  ：指向第一个子节点
                </li>
                <li>
                  <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-purple-600 dark:text-purple-300">
                    sibling
                  </code>
                  ：指向下一个兄弟节点
                </li>
              </ul>
            </div>
            <FiberStructureDiagram />
          </div>
        </section>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Double Buffering */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              双缓存机制 (Double Buffering)
            </h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <DoubleBufferingDiagram />
            </div>
            <div className="order-1 lg:order-2 text-slate-500 dark:text-slate-400 text-sm space-y-4 flex flex-col justify-center">
              <p>React 在内存中同时维护两棵树：</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>
                    <strong className="text-slate-700 dark:text-slate-200">Current Tree:</strong> 屏幕上显示的（只读）。
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  <span>
                    <strong className="text-slate-700 dark:text-slate-200">WorkInProgress Tree:</strong>{' '}
                    后台正在构建的（可写）。
                  </span>
                </li>
              </ul>
              <p className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-slate-500 border-l-4 border-yellow-500">
                <strong className="text-slate-700 dark:text-slate-200">核心作用：</strong>
                支持并发模式下的"丢弃"和"回滚"，防止页面渲染过程中的视觉抖动。
              </p>
            </div>
          </div>
        </section>
      </div>
    </ContentCard>
  );
};
