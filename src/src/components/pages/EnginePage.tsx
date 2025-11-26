import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { ContentCard } from "../ui/ContentCard";
import { FiberStructureDiagram } from "../diagrams/FiberStructureDiagram";
import { DoubleBufferingDiagram } from "../diagrams/DoubleBufferingDiagram";
import { WorkLoopDiagram } from "../diagrams/WorkLoopDiagram";
import { EffectListDiagram } from "../diagrams/EffectListDiagram";
import {
  CpuIcon,
  LayersIcon,
  RefreshCwIcon,
  ZapIcon,
  GitBranchIcon,
  ClockIcon,
} from "../icons";

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const EnginePage: React.FC = () => {
  return (
    <ContentCard title="底层架构：引擎室">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 介绍 */}
        <motion.p
          className="text-slate-500 dark:text-slate-400"
          variants={itemVariants}
        >
          深入 React 的核心引擎：Fiber 架构、双缓存机制、WorkLoop
          工作循环和副作用处理。 理解这些底层机制，是掌握 React
          性能优化和源码阅读的基础。
        </motion.p>

        {/* Tabs 内容组织 */}
        <motion.div variants={itemVariants}>
          <Tabs
            aria-label="Engine Tabs"
            color="primary"
            variant="underlined"
            classNames={{
              tabList:
                "gap-4 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "bg-primary",
              tab: "max-w-fit px-4 h-10",
              tabContent: "group-data-[selected=true]:text-primary font-medium",
            }}
          >
            {/* Tab 1: Fiber 架构 */}
            <Tab
              key="fiber"
              title={
                <div className="flex items-center gap-2">
                  <GitBranchIcon size={16} />
                  <span>Fiber 架构</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Fiber 是什么？
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Fiber 既是一种
                        <strong className="text-blue-500">数据结构</strong>
                        （链表节点）， 也是一种
                        <strong className="text-blue-500">执行单元</strong>
                        （工作单元）。 它让 React 的渲染过程变得
                        <strong className="text-green-500">
                          可中断、可恢复
                        </strong>
                        。
                      </p>
                    </div>

                    <FiberStructureDiagram />

                    {/* 核心要点 */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <motion.div
                        className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h5 className="font-bold text-blue-600 dark:text-blue-400 mb-2">
                          为什么需要 Fiber？
                        </h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• React 15 的 Stack Reconciler 是递归的</li>
                          <li>• 递归无法中断，大组件树会阻塞主线程</li>
                          <li>• Fiber 用链表替代递归，可随时暂停</li>
                        </ul>
                      </motion.div>
                      <motion.div
                        className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h5 className="font-bold text-green-600 dark:text-green-400 mb-2">
                          Fiber 的遍历顺序
                        </h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>1. 先处理当前节点 (beginWork)</li>
                          <li>2. 有 child？深入子节点</li>
                          <li>3. 无 child？完成当前 (completeWork)</li>
                          <li>4. 有 sibling？处理兄弟；无则 return 父节点</li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 2: 双缓存机制 */}
            <Tab
              key="double-buffer"
              title={
                <div className="flex items-center gap-2">
                  <LayersIcon size={16} />
                  <span>双缓存机制</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Double Buffering
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        React 在内存中同时维护两棵 Fiber
                        树，类似游戏开发中的双缓冲技术。 这使得 React
                        可以在后台准备新的 UI，完成后瞬间切换，避免视觉闪烁。
                      </p>
                    </div>

                    <DoubleBufferingDiagram />

                    {/* 两棵树说明 */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <motion.div
                        className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h5 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Current Tree
                        </h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• 当前屏幕上显示的 UI 对应的树</li>
                          <li>• 只读，不会被修改</li>
                          <li>• 通过 root.current 访问</li>
                        </ul>
                      </motion.div>
                      <motion.div
                        className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h5 className="font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                          WorkInProgress Tree
                        </h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• 后台正在构建的新树</li>
                          <li>• 可写，接收所有更新</li>
                          <li>• 完成后变成新的 current</li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 3: WorkLoop */}
            <Tab
              key="workloop"
              title={
                <div className="flex items-center gap-2">
                  <RefreshCwIcon size={16} />
                  <span>WorkLoop</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <WorkLoopDiagram />
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 4: Effect & Commit */}
            <Tab
              key="effect"
              title={
                <div className="flex items-center gap-2">
                  <ZapIcon size={16} />
                  <span>Effect & Commit</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <EffectListDiagram />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </motion.div>

        {/* 底部总结卡片 */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <motion.div
            className="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-slate-800 dark:text-white font-bold mb-3 flex items-center gap-2">
              <ZapIcon size={18} className="text-yellow-500" />
              核心要点
            </h4>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>Fiber</strong> 是链表结构，实现可中断渲染
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>双缓存</strong> 在后台构建新树，瞬间切换
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>WorkLoop</strong> 是调度核心，实现时间切片
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>Effect</strong> 通过 flags 标记，在 Commit 阶段处理
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.01 }}
          >
            <h4 className="text-slate-800 dark:text-white font-bold mb-4 flex items-center gap-2">
              <CpuIcon size={18} className="text-blue-500" />
              面试高频 Q&A
            </h4>
            <Accordion variant="splitted" selectionMode="multiple">
              <AccordionItem
                key="fiber"
                aria-label="Fiber"
                title={
                  <span className="text-sm font-medium">
                    Q: Fiber 是什么？解决了什么问题？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>
                      Fiber 是 React 16 引入的新协调引擎的核心数据结构。
                    </strong>
                  </p>
                  <p>每个 Fiber 节点对应一个 React 元素，包含：</p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>
                      <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">
                        type
                      </code>{" "}
                      - 组件类型
                    </li>
                    <li>
                      <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">
                        child/sibling/return
                      </code>{" "}
                      - 树结构指针
                    </li>
                    <li>
                      <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">
                        memoizedState
                      </code>{" "}
                      - Hooks 链表
                    </li>
                    <li>
                      <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">
                        flags
                      </code>{" "}
                      - 副作用标记
                    </li>
                  </ul>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    解决的问题：
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>旧版递归调用栈无法中断 → Fiber 链表结构可中断/恢复</li>
                    <li>大组件树阻塞主线程 → 时间切片分批执行</li>
                  </ul>
                </div>
              </AccordionItem>

              <AccordionItem
                key="double-buffer"
                aria-label="DoubleBuffer"
                title={
                  <span className="text-sm font-medium">
                    Q: 双缓存机制的作用？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>避免渲染过程中的视觉闪烁和不一致。</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Current 树：当前屏幕显示的 UI</li>
                    <li>WorkInProgress 树：后台构建的新 UI</li>
                    <li>
                      通过{" "}
                      <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">
                        alternate
                      </code>{" "}
                      指针互相引用
                    </li>
                    <li>Commit 阶段只需修改 root.current 指针</li>
                  </ul>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    还支持并发模式下的"丢弃"——如果高优先级任务插入，可以直接丢弃未完成的
                    WIP 树。
                  </p>
                </div>
              </AccordionItem>

              <AccordionItem
                key="workloop"
                aria-label="WorkLoop"
                title={
                  <span className="text-sm font-medium">
                    Q: WorkLoop 是如何实现时间切片的？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>通过 shouldYield() 检查是否需要让出主线程。</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>同步模式：while 循环，不检查 shouldYield</li>
                    <li>
                      并发模式：每处理完一个 Fiber，检查是否超时（约 5ms）
                    </li>
                    <li>超时则暂停，用 MessageChannel 调度下次执行</li>
                    <li>高优先级任务可以打断低优先级渲染</li>
                  </ul>
                </div>
              </AccordionItem>

              <AccordionItem
                key="commit"
                aria-label="Commit"
                title={
                  <span className="text-sm font-medium">
                    Q: Commit 阶段为什么不能中断？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>因为涉及真实 DOM 操作，必须保证一致性。</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Render 阶段只是打标记，可以中断重来</li>
                    <li>Commit 阶段操作真实 DOM，中断会导致 UI 不一致</li>
                    <li>分为 beforeMutation → mutation → layout 三个子阶段</li>
                    <li>
                      useLayoutEffect 在 layout 同步执行，useEffect 异步调度
                    </li>
                  </ul>
                </div>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </motion.div>
      </motion.div>
    </ContentCard>
  );
};
