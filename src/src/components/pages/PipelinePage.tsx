import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  Chip,
  Progress,
} from "@nextui-org/react";
import { Highlight, themes } from "prism-react-renderer";
import { ContentCard } from "../ui/ContentCard";
import { PipelineDiagram } from "../diagrams/PipelineDiagram";
import {
  ZapIcon,
  RefreshCwIcon,
  CpuIcon,
  ClockIcon,
  LayersIcon,
  CodeIcon,
} from "../icons";

// Lane 优先级数据
const lanes = [
  {
    name: "SyncLane",
    value: 1,
    priority: "最高",
    color: "danger",
    desc: "同步更新 (flushSync)",
    binary: "0b0000001",
  },
  {
    name: "InputContinuousLane",
    value: 4,
    priority: "高",
    color: "warning",
    desc: "连续输入 (拖拽/滚动)",
    binary: "0b0000100",
  },
  {
    name: "DefaultLane",
    value: 16,
    priority: "默认",
    color: "primary",
    desc: "普通更新 (setState)",
    binary: "0b0010000",
  },
  {
    name: "TransitionLane",
    value: 64,
    priority: "低",
    color: "secondary",
    desc: "过渡更新 (startTransition)",
    binary: "0b1000000",
  },
  {
    name: "IdleLane",
    value: 536870912,
    priority: "空闲",
    color: "default",
    desc: "空闲时执行",
    binary: "0b10...",
  },
];

// Diff 算法演示数据
const diffExamples = [
  {
    title: "同级比较",
    before: `<div>
  <A />
  <B />
</div>`,
    after: `<span>
  <A />
  <B />
</span>`,
    result: "根节点类型变化，整棵树销毁重建",
    type: "destroy",
  },
  {
    title: "Key 的作用",
    before: `<ul>
  <li key="a">A</li>
  <li key="b">B</li>
</ul>`,
    after: `<ul>
  <li key="b">B</li>
  <li key="a">A</li>
</ul>`,
    result: "通过 Key 识别：仅移动，不重建",
    type: "move",
  },
  {
    title: "属性更新",
    before: `<div className="old">
  Hello
</div>`,
    after: `<div className="new">
  Hello
</div>`,
    result: "类型相同，仅更新 className 属性",
    type: "update",
  },
];

// 时间切片代码示例
const timeSliceCode = `// React 的时间切片机制
function workLoopConcurrent() {
  // 每个工作单元完成后检查是否需要让出
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

// shouldYield 检查是否超时 (约 5ms)
function shouldYield() {
  const currentTime = getCurrentTime();
  return currentTime >= deadline;
}`;

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

export const PipelinePage: React.FC = () => {
  const [selectedLane, setSelectedLane] = useState<number | null>(null);
  const [selectedDiff, setSelectedDiff] = useState(0);

  return (
    <ContentCard title="运行时：流水线">
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
          当你在组件中调用{" "}
          <code className="text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
            setState
          </code>{" "}
          时，React 内部发生了什么？点击下方按钮观看完整流程演示。
        </motion.p>

        {/* Pipeline 流程图 */}
        <motion.div variants={itemVariants}>
          <PipelineDiagram />
        </motion.div>

        {/* Tabs 内容组织 */}
        <motion.div variants={itemVariants} className="mt-8">
          <Tabs
            aria-label="Pipeline详解"
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
            {/* Tab 1: 调度器 */}
            <Tab
              key="scheduler"
              title={
                <div className="flex items-center gap-2">
                  <ZapIcon size={16} />
                  <span>Scheduler 调度器</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Lane 优先级模型
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        React 18 使用 Lane（车道）模型管理优先级，每个 Lane
                        是一个 31 位二进制数。 点击查看各优先级详情：
                      </p>
                    </div>

                    {/* Lane 可视化 */}
                    <div className="space-y-3">
                      {lanes.map((lane, index) => (
                        <motion.div
                          key={lane.name}
                          className={`
                            p-4 rounded-lg border cursor-pointer transition-all
                            ${
                              selectedLane === index
                                ? "border-primary bg-primary/10 shadow-md"
                                : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                            }
                          `}
                          onClick={() =>
                            setSelectedLane(
                              selectedLane === index ? null : index
                            )
                          }
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Chip
                                color={lane.color as any}
                                size="sm"
                                variant="flat"
                              >
                                {lane.priority}
                              </Chip>
                              <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-200">
                                {lane.name}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                              {lane.binary}
                            </span>
                          </div>

                          <AnimatePresence>
                            {selectedLane === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
                              >
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {lane.desc}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs text-slate-400">
                                    优先级值:
                                  </span>
                                  <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                    {lane.value}
                                  </code>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>

                    {/* 位运算说明 */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                        <CodeIcon size={16} />
                        为什么用位运算？
                      </h5>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        使用位运算可以高效地进行优先级合并、比较和提取。例如：
                        <code className="mx-1 bg-amber-100 dark:bg-amber-800 px-1 rounded">
                          lanes & SyncLane
                        </code>
                        可以 O(1) 判断是否包含同步任务。
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 2: Diff 算法 */}
            <Tab
              key="diff"
              title={
                <div className="flex items-center gap-2">
                  <RefreshCwIcon size={16} />
                  <span>Diff 算法</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        O(n) Diff 策略
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        传统 Diff 算法是 O(n³)，React 通过三个假设优化到 O(n)：
                      </p>
                    </div>

                    {/* Diff 假设 */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {["同层比较", "类型决定", "Key 标识"].map((item, i) => (
                        <motion.div
                          key={item}
                          className="text-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Diff 示例选择 */}
                    <div className="flex gap-2 mb-4">
                      {diffExamples.map((example, index) => (
                        <Chip
                          key={example.title}
                          className="cursor-pointer"
                          color={selectedDiff === index ? "primary" : "default"}
                          variant={
                            selectedDiff === index ? "solid" : "bordered"
                          }
                          onClick={() => setSelectedDiff(index)}
                        >
                          {example.title}
                        </Chip>
                      ))}
                    </div>

                    {/* Diff 对比演示 */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedDiff}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        {/* Before */}
                        <div>
                          <span className="text-xs text-slate-400 mb-2 block">
                            Before:
                          </span>
                          <Highlight
                            theme={themes.nightOwl}
                            code={diffExamples[selectedDiff].before}
                            language="jsx"
                          >
                            {({
                              style,
                              tokens,
                              getLineProps,
                              getTokenProps,
                            }) => (
                              <pre
                                className="p-3 rounded-lg text-xs overflow-x-auto"
                                style={style}
                              >
                                {tokens.map((line, i) => (
                                  <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                      <span
                                        key={key}
                                        {...getTokenProps({ token })}
                                      />
                                    ))}
                                  </div>
                                ))}
                              </pre>
                            )}
                          </Highlight>
                        </div>

                        {/* After */}
                        <div>
                          <span className="text-xs text-slate-400 mb-2 block">
                            After:
                          </span>
                          <Highlight
                            theme={themes.nightOwl}
                            code={diffExamples[selectedDiff].after}
                            language="jsx"
                          >
                            {({
                              style,
                              tokens,
                              getLineProps,
                              getTokenProps,
                            }) => (
                              <pre
                                className="p-3 rounded-lg text-xs overflow-x-auto"
                                style={style}
                              >
                                {tokens.map((line, i) => (
                                  <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                      <span
                                        key={key}
                                        {...getTokenProps({ token })}
                                      />
                                    ))}
                                  </div>
                                ))}
                              </pre>
                            )}
                          </Highlight>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* 结果说明 */}
                    <motion.div
                      key={`result-${selectedDiff}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`
                        p-4 rounded-lg border-l-4
                        ${
                          diffExamples[selectedDiff].type === "destroy"
                            ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                            : diffExamples[selectedDiff].type === "move"
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                            : "bg-green-50 dark:bg-green-900/20 border-green-500"
                        }
                      `}
                    >
                      <p className="text-sm font-medium">
                        {diffExamples[selectedDiff].result}
                      </p>
                    </motion.div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 3: 时间切片 */}
            <Tab
              key="timeslice"
              title={
                <div className="flex items-center gap-2">
                  <ClockIcon size={16} />
                  <span>时间切片</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Concurrent Mode 时间切片
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        React 将渲染工作拆分成小块，在浏览器空闲时执行，保证 UI
                        流畅。
                      </p>
                    </div>

                    {/* 时间切片可视化 */}
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-slate-500">
                          帧时间线 (16.6ms/帧)
                        </span>
                      </div>
                      <div className="relative h-8 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded"
                          initial={{ width: 0 }}
                          animate={{ width: "30%" }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <motion.div
                          className="absolute inset-y-0 bg-gradient-to-r from-green-500 to-green-400 rounded"
                          style={{ left: "32%" }}
                          initial={{ width: 0 }}
                          animate={{ width: "25%" }}
                          transition={{
                            duration: 0.8,
                            delay: 0.3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <motion.div
                          className="absolute inset-y-0 bg-gradient-to-r from-purple-500 to-purple-400 rounded"
                          style={{ left: "59%" }}
                          initial={{ width: 0 }}
                          animate={{ width: "20%" }}
                          transition={{
                            duration: 0.6,
                            delay: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        {/* 5ms 标记线 */}
                        <div className="absolute inset-y-0 left-[30%] w-px bg-red-500" />
                        <span className="absolute -bottom-5 left-[30%] text-[10px] text-red-500 -translate-x-1/2">
                          ~5ms
                        </span>
                      </div>
                      <div className="flex justify-between mt-6 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-blue-500" /> React
                          工作
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-green-500" />{" "}
                          浏览器绘制
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-purple-500" />{" "}
                          用户输入
                        </span>
                      </div>
                    </div>

                    {/* 代码示例 */}
                    <Highlight
                      theme={themes.nightOwl}
                      code={timeSliceCode}
                      language="javascript"
                    >
                      {({ style, tokens, getLineProps, getTokenProps }) => (
                        <pre
                          className="p-4 rounded-lg text-sm overflow-x-auto"
                          style={style}
                        >
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              <span className="text-slate-500 mr-4 select-none w-5 inline-block text-right">
                                {i + 1}
                              </span>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>

                    {/* shouldYield 说明 */}
                    <Accordion variant="bordered">
                      <AccordionItem
                        key="yield"
                        aria-label="shouldYield 详解"
                        title={
                          <span className="text-sm font-medium">
                            shouldYield() 如何工作？
                          </span>
                        }
                      >
                        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                          <p>
                            React 使用{" "}
                            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">
                              MessageChannel
                            </code>{" "}
                            实现调度：
                          </p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>
                              每次调度开始记录 deadline = currentTime + 5ms
                            </li>
                            <li>每个 Fiber 节点处理完后检查是否超时</li>
                            <li>超时则让出主线程，等待下次调度</li>
                            <li>高优先级任务可以打断低优先级渲染</li>
                          </ul>
                        </div>
                      </AccordionItem>
                      <AccordionItem
                        key="interrupt"
                        aria-label="中断恢复"
                        title={
                          <span className="text-sm font-medium">
                            中断后如何恢复？
                          </span>
                        }
                      >
                        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                          <p>Fiber 架构使中断恢复成为可能：</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>workInProgress 保存当前工作进度</li>
                            <li>每个 Fiber 节点记录自己的状态</li>
                            <li>下次调度从 workInProgress 继续</li>
                            <li>通过 return 指针可回溯到父节点</li>
                          </ul>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 4: 并发特性 */}
            <Tab
              key="concurrent"
              title={
                <div className="flex items-center gap-2">
                  <LayersIcon size={16} />
                  <span>并发特性</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        React 18 并发特性
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        基于 Fiber 架构和时间切片，React 18
                        提供了强大的并发能力：
                      </p>
                    </div>

                    {/* 并发特性卡片 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "useTransition",
                          desc: "标记低优先级更新，不阻塞用户输入",
                          code: "const [isPending, startTransition] = useTransition();",
                          color: "blue",
                        },
                        {
                          title: "useDeferredValue",
                          desc: "延迟更新非关键 UI，类似防抖",
                          code: "const deferredValue = useDeferredValue(value);",
                          color: "purple",
                        },
                        {
                          title: "Suspense",
                          desc: "声明式加载状态，配合 lazy/数据获取",
                          code: "<Suspense fallback={<Loading />}>",
                          color: "green",
                        },
                        {
                          title: "Automatic Batching",
                          desc: "自动合并多个 setState，减少渲染次数",
                          code: "// 异步回调中也会自动批处理",
                          color: "orange",
                        },
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          className={`
                            p-4 rounded-lg border-l-4 bg-slate-50 dark:bg-slate-800
                            border-${feature.color}-500
                          `}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <h5
                            className={`font-bold text-${feature.color}-600 dark:text-${feature.color}-400 mb-2`}
                          >
                            {feature.title}
                          </h5>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            {feature.desc}
                          </p>
                          <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded block">
                            {feature.code}
                          </code>
                        </motion.div>
                      ))}
                    </div>

                    {/* 优先级抢占示意 */}
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <h5 className="font-medium text-slate-700 dark:text-slate-200 mb-3">
                        优先级抢占示意
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 w-20">
                            低优先级
                          </span>
                          <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-blue-400 rounded"
                              initial={{ width: "40%" }}
                              animate={{ width: ["40%", "60%", "40%"] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                            <motion.div
                              className="absolute inset-y-0 bg-red-500 rounded"
                              style={{ left: "45%" }}
                              initial={{ width: 0, opacity: 0 }}
                              animate={{
                                width: [0, "30%", 0],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: 1,
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center">
                          红色高优先级任务插入，蓝色低优先级任务被中断
                        </p>
                      </div>
                    </div>
                  </div>
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
                Fiber 让渲染可中断、可恢复
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Lane 模型实现优先级调度
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                时间切片保证 UI 流畅
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Diff 算法优化到 O(n)
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
                        pendingProps/memoizedState
                      </code>{" "}
                      - 状态
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
                    <li>无法区分优先级 → Lane 模型实现优先级调度</li>
                  </ul>
                </div>
              </AccordionItem>

              <AccordionItem
                key="diff"
                aria-label="Diff"
                title={
                  <span className="text-sm font-medium">
                    Q: React 的 Diff 算法复杂度？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>O(n) 复杂度</strong>（传统树 Diff 是 O(n³)）
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    三个优化假设：
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-xs">
                    <li>
                      <strong>同层比较</strong>
                      ：不跨层级比对，层级变化直接销毁重建
                    </li>
                    <li>
                      <strong>类型决定</strong>
                      ：节点类型变化（div→span），整棵子树销毁重建
                    </li>
                    <li>
                      <strong>Key 标识</strong>：同类型节点通过 key
                      判断是复用还是新建
                    </li>
                  </ol>
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs">
                    💡 这就是为什么 key 不能用 index：列表顺序变化时，index 作为
                    key 会导致错误复用
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem
                key="transition"
                aria-label="Transition"
                title={
                  <span className="text-sm font-medium">
                    Q: useTransition 和 useDeferredValue 区别？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="font-bold text-blue-600 dark:text-blue-400 mb-1">
                        useTransition
                      </p>
                      <ul className="space-y-1">
                        <li>
                          • 包裹<strong>状态更新</strong>
                        </li>
                        <li>• 返回 isPending 状态</li>
                        <li>• 主动标记低优先级</li>
                        <li>• 用于：搜索、Tab 切换</li>
                      </ul>
                      <code className="block mt-1 bg-slate-100 dark:bg-slate-700 p-1 rounded text-[10px]">
                        startTransition(() =&gt; setState(x))
                      </code>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <p className="font-bold text-purple-600 dark:text-purple-400 mb-1">
                        useDeferredValue
                      </p>
                      <ul className="space-y-1">
                        <li>
                          • 包裹<strong>值本身</strong>
                        </li>
                        <li>• 返回延迟后的值</li>
                        <li>• 被动延迟更新</li>
                        <li>• 用于：列表过滤、防抖</li>
                      </ul>
                      <code className="block mt-1 bg-slate-100 dark:bg-slate-700 p-1 rounded text-[10px]">
                        const deferred = useDeferredValue(value)
                      </code>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    简单记：Transition 包更新函数，Deferred 包值
                  </p>
                </div>
              </AccordionItem>

              <AccordionItem
                key="key"
                aria-label="Key"
                title={
                  <span className="text-sm font-medium">
                    Q: 为什么 key 不能用 index？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>会导致状态错乱和性能问题</strong>
                  </p>
                  <div className="text-xs space-y-2">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="font-bold text-red-600 dark:text-red-400">
                        ❌ 用 index 的问题：
                      </p>
                      <p>列表 [A, B, C] 在头部插入 D 变成 [D, A, B, C]</p>
                      <ul className="mt-1 space-y-0.5">
                        <li>index=0: A → D (被认为是更新，复用 A 的状态)</li>
                        <li>index=1: B → A (被认为是更新，复用 B 的状态)</li>
                        <li>index=2: C → B (被认为是更新，复用 C 的状态)</li>
                        <li>index=3: 新建 C</li>
                      </ul>
                      <p className="mt-1 text-red-500">
                        结果：4 次 DOM 操作，状态全乱！
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="font-bold text-green-600 dark:text-green-400">
                        ✅ 用唯一 ID：
                      </p>
                      <p>React 正确识别 A、B、C 只是移动，D 是新建</p>
                      <p className="mt-1 text-green-500">
                        结果：1 次插入操作，状态正确！
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </motion.div>
      </motion.div>
    </ContentCard>
  );
};
