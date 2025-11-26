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
} from "@nextui-org/react";
import { Highlight, themes } from "prism-react-renderer";
import { ContentCard } from "../ui/ContentCard";
import {
  CodeIcon,
  ZapIcon,
  LayersIcon,
  CpuIcon,
  RefreshCwIcon,
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

// Hooks 链表数据
const hooksChain = [
  { name: "useState", param: "count", color: "bg-blue-500", index: 0 },
  { name: "useEffect", param: "title sync", color: "bg-purple-500", index: 1 },
  { name: "useMemo", param: "computed", color: "bg-green-500", index: 2 },
  { name: "useState", param: "user", color: "bg-blue-500", index: 3 },
  { name: "useCallback", param: "handler", color: "bg-orange-500", index: 4 },
];

// Hook 数据结构代码
const hookStructureCode = `// 每个 Hook 在 Fiber 上的数据结构
interface Hook {
  memoizedState: any;    // 当前状态值
  baseState: any;        // 初始状态
  baseQueue: Update;     // 未处理的更新队列
  queue: UpdateQueue;    // 更新队列
  next: Hook | null;     // 指向下一个 Hook
}

// Fiber.memoizedState 指向第一个 Hook
// 形成单向链表：hook1 -> hook2 -> hook3 -> null`;

// useState 实现代码
const useStateCode = `function useState(initialState) {
  // mount 阶段
  const hook = mountWorkInProgressHook();
  hook.memoizedState = initialState;
  
  const dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    hook.queue
  );
  
  return [hook.memoizedState, dispatch];
}

// update 阶段
function updateState() {
  const hook = updateWorkInProgressHook();
  // 处理 queue 中的更新，计算新 state
  return [hook.memoizedState, hook.queue.dispatch];
}`;

// 合成事件代码
const syntheticEventCode = `// React 17+ 事件委托到 root 容器
const root = document.getElementById('root');

// 所有事件统一注册在 root 上
root.addEventListener('click', (e) => {
  // 1. 通过 e.target 找到触发的 Fiber 节点
  const targetFiber = getClosestFiber(e.target);
  
  // 2. 收集路径上所有同类型事件监听器
  const listeners = collectListeners(targetFiber, 'onClick');
  
  // 3. 创建合成事件对象
  const syntheticEvent = new SyntheticEvent(e);
  
  // 4. 按顺序执行（捕获 -> 目标 -> 冒泡）
  executeDispatch(listeners, syntheticEvent);
});`;

// 并发特性代码
const concurrentCode = `// useTransition - 标记低优先级更新
function SearchResults() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  
  const handleChange = (e) => {
    // 输入框更新 - 高优先级（立即响应）
    setQuery(e.target.value);
    
    // 搜索结果更新 - 低优先级（可中断）
    startTransition(() => {
      setSearchResults(search(e.target.value));
    });
  };
  
  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList results={searchResults} />
    </>
  );
}`;

// 事件委托可视化组件
const EventDelegationDiagram: React.FC = () => {
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [eventPath, setEventPath] = useState<string[]>([]);

  const handleNodeClick = (node: string) => {
    setClickedNode(node);
    // 模拟事件冒泡路径
    const paths: Record<string, string[]> = {
      button: ["button", "div", "section", "root"],
      span: ["span", "button", "div", "section", "root"],
      div: ["div", "section", "root"],
    };
    setEventPath(paths[node] || []);
    setTimeout(() => {
      setClickedNode(null);
      setEventPath([]);
    }, 2000);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="text-xs text-slate-500 mb-3 text-center">
        点击节点查看事件冒泡路径
      </div>
      <div className="flex flex-col items-center gap-2">
        {/* Root */}
        <motion.div
          className={`w-64 p-2 rounded border-2 text-center text-xs font-mono transition-colors ${
            eventPath.includes("root")
              ? "border-red-500 bg-red-100 dark:bg-red-900/30"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          }`}
          animate={eventPath.includes("root") ? { scale: [1, 1.02, 1] } : {}}
        >
          #root (事件委托点)
          {eventPath.includes("root") && (
            <span className="ml-2 text-red-500">← 处理事件</span>
          )}
        </motion.div>
        <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-600"></div>

        {/* Section */}
        <motion.div
          className={`w-56 p-2 rounded border-2 text-center text-xs font-mono transition-colors ${
            eventPath.includes("section")
              ? "border-orange-500 bg-orange-100 dark:bg-orange-900/30"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          }`}
        >
          {"<section>"}
        </motion.div>
        <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-600"></div>

        {/* Div */}
        <motion.div
          className={`w-48 p-2 rounded border-2 text-center text-xs font-mono cursor-pointer transition-colors ${
            eventPath.includes("div")
              ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-400"
          }`}
          onClick={() => handleNodeClick("div")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {"<div onClick={...}>"}
        </motion.div>
        <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-600"></div>

        {/* Button */}
        <motion.div
          className={`w-40 p-2 rounded border-2 text-center text-xs font-mono cursor-pointer transition-colors ${
            eventPath.includes("button")
              ? "border-green-500 bg-green-100 dark:bg-green-900/30"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-400"
          }`}
          onClick={() => handleNodeClick("button")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {"<button onClick={...}>"}
          <div className="w-0.5 h-2 bg-slate-300 dark:bg-slate-600 mx-auto mt-1"></div>
          <motion.div
            className={`mt-1 px-2 py-1 rounded text-[10px] cursor-pointer ${
              eventPath.includes("span")
                ? "border-2 border-blue-500 bg-blue-100 dark:bg-blue-900/30"
                : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick("span");
            }}
            whileHover={{ scale: 1.05 }}
          >
            {"<span>Click</span>"}
          </motion.div>
        </motion.div>
      </div>

      {clickedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-center"
        >
          事件从 <code className="text-blue-600">{clickedNode}</code> 冒泡到{" "}
          <code className="text-red-600">root</code>， 由 root 统一分发处理
        </motion.div>
      )}
    </div>
  );
};

// Hooks 链表可视化组件
const HooksChainDiagram: React.FC = () => {
  const [selectedHook, setSelectedHook] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startTraversal = () => {
    setIsAnimating(true);
    let i = 0;
    const interval = setInterval(() => {
      setSelectedHook(i);
      i++;
      if (i > hooksChain.length) {
        clearInterval(interval);
        setTimeout(() => {
          setSelectedHook(null);
          setIsAnimating(false);
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs text-slate-500">Fiber.memoizedState 链表</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startTraversal}
          disabled={isAnimating}
          className={`px-2 py-1 rounded text-xs ${
            isAnimating
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isAnimating ? "遍历中..." : "模拟遍历"}
        </motion.button>
      </div>

      <div className="flex flex-col items-center gap-1">
        {hooksChain.map((hook, index) => (
          <React.Fragment key={index}>
            <motion.div
              className={`w-52 p-2 rounded border-2 text-xs text-center relative transition-all ${
                selectedHook === index
                  ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              }`}
              animate={
                selectedHook === index
                  ? { scale: 1.05, x: 10 }
                  : { scale: 1, x: 0 }
              }
              onClick={() =>
                setSelectedHook(selectedHook === index ? null : index)
              }
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center justify-between">
                <Chip
                  size="sm"
                  color={
                    hook.name.includes("State")
                      ? "primary"
                      : hook.name.includes("Effect")
                      ? "secondary"
                      : "success"
                  }
                  variant="flat"
                >
                  {hook.name}
                </Chip>
                <span className="text-slate-500">({hook.param})</span>
              </div>
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                [{index}]
              </div>
            </motion.div>
            {index < hooksChain.length - 1 && (
              <motion.div
                className={`w-0.5 h-4 ${
                  selectedHook === index
                    ? "bg-yellow-500"
                    : "bg-slate-400 dark:bg-slate-600"
                }`}
                animate={selectedHook === index ? { scaleY: [1, 1.5, 1] } : {}}
              >
                <div className="relative">
                  <span className="absolute left-2 -top-1 text-[10px] text-slate-400">
                    next
                  </span>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}
        <div className="mt-2 text-xs text-slate-400">null (链表结束)</div>
      </div>
    </div>
  );
};

export const ApiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("hooks");

  return (
    <ContentCard title="开发者接口 (API)">
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
          深入理解 React 提供给开发者的核心 API：Hooks
          的底层实现、合成事件系统、以及 React 18 的并发特性。
          掌握这些原理，才能写出更高效的 React 代码。
        </motion.p>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs
            aria-label="API Tabs"
            color="primary"
            variant="underlined"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            classNames={{
              tabList:
                "gap-4 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "bg-primary",
              tab: "max-w-fit px-4 h-10",
              tabContent: "group-data-[selected=true]:text-primary font-medium",
            }}
          >
            {/* Tab 1: Hooks 原理 */}
            <Tab
              key="hooks"
              title={
                <div className="flex items-center gap-2">
                  <CodeIcon size={16} />
                  <span>Hooks 原理</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Hooks 的底层实现
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Hooks 本质上是 Fiber 节点上的一个
                        <strong className="text-blue-500">单向链表</strong>，
                        存储在{" "}
                        <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">
                          fiber.memoizedState
                        </code>{" "}
                        中。 React 通过
                        <strong className="text-blue-500">调用顺序</strong>
                        来匹配每个 Hook 和它的状态。
                      </p>
                    </div>

                    {/* Hooks 链表可视化 */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      <HooksChainDiagram />

                      <div className="space-y-4">
                        {/* 警告 */}
                        <motion.div
                          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                          whileHover={{ scale: 1.02 }}
                        >
                          <h5 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                            ⚠️ Hooks 规则
                          </h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>
                              • <strong>不能</strong>在 if/for/while 中调用
                            </li>
                            <li>
                              • <strong>不能</strong>在普通函数中调用
                            </li>
                            <li>
                              • <strong>只能</strong>在函数组件或自定义 Hook
                              顶层调用
                            </li>
                          </ul>
                          <p className="text-xs text-slate-500 mt-2">
                            原因：React 依赖调用顺序匹配
                            Hook，条件语句会打乱顺序
                          </p>
                        </motion.div>

                        {/* Hook 类型 */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              name: "useState",
                              desc: "状态管理",
                              color: "primary",
                            },
                            {
                              name: "useEffect",
                              desc: "副作用",
                              color: "secondary",
                            },
                            {
                              name: "useMemo",
                              desc: "计算缓存",
                              color: "success",
                            },
                            {
                              name: "useCallback",
                              desc: "函数缓存",
                              color: "warning",
                            },
                            {
                              name: "useRef",
                              desc: "可变引用",
                              color: "danger",
                            },
                            {
                              name: "useContext",
                              desc: "上下文",
                              color: "default",
                            },
                          ].map((hook) => (
                            <motion.div
                              key={hook.name}
                              className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Chip
                                size="sm"
                                color={hook.color as any}
                                variant="flat"
                              >
                                {hook.name}
                              </Chip>
                              <span className="ml-2 text-slate-500">
                                {hook.desc}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 代码示例 */}
                    <div className="grid lg:grid-cols-2 gap-4 mt-6">
                      <div>
                        <span className="text-xs text-slate-500 mb-2 block">
                          Hook 数据结构：
                        </span>
                        <Highlight
                          theme={themes.nightOwl}
                          code={hookStructureCode}
                          language="typescript"
                        >
                          {({ style, tokens, getLineProps, getTokenProps }) => (
                            <pre
                              className="p-3 rounded-lg text-xs overflow-x-auto"
                              style={style}
                            >
                              {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                  <span className="text-slate-500 mr-3 select-none w-4 inline-block text-right">
                                    {i + 1}
                                  </span>
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
                      <div>
                        <span className="text-xs text-slate-500 mb-2 block">
                          useState 简化实现：
                        </span>
                        <Highlight
                          theme={themes.nightOwl}
                          code={useStateCode}
                          language="javascript"
                        >
                          {({ style, tokens, getLineProps, getTokenProps }) => (
                            <pre
                              className="p-3 rounded-lg text-xs overflow-x-auto"
                              style={style}
                            >
                              {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                  <span className="text-slate-500 mr-3 select-none w-4 inline-block text-right">
                                    {i + 1}
                                  </span>
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
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 2: 合成事件 */}
            <Tab
              key="events"
              title={
                <div className="flex items-center gap-2">
                  <ZapIcon size={16} />
                  <span>合成事件</span>
                </div>
              }
            >
              <Card className="mt-4">
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Synthetic Events 合成事件
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        React 不会将事件直接绑定在 DOM 节点上，而是利用
                        <strong className="text-blue-500">事件委托</strong>，
                        将所有事件统一注册在 Root
                        容器上。这样可以抹平浏览器差异，大幅减少内存消耗。
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <EventDelegationDiagram />

                      <div className="space-y-4">
                        {/* 特点卡片 */}
                        {[
                          {
                            title: "事件委托",
                            desc: "React 17+ 将事件绑定到 root 容器，而非 document",
                            color: "blue",
                          },
                          {
                            title: "事件池 (已废弃)",
                            desc: "React 17 前会复用事件对象，现在每次创建新对象",
                            color: "yellow",
                          },
                          {
                            title: "跨浏览器一致性",
                            desc: "SyntheticEvent 封装了原生事件，提供统一的 API",
                            color: "green",
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={item.title}
                            className={`p-3 bg-${item.color}-50 dark:bg-${item.color}-900/20 border border-${item.color}-200 dark:border-${item.color}-800 rounded-lg`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <h5
                              className={`font-bold text-${item.color}-600 dark:text-${item.color}-400 text-sm mb-1`}
                            >
                              {item.title}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              {item.desc}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* 代码示例 */}
                    <div>
                      <span className="text-xs text-slate-500 mb-2 block">
                        事件委托机制：
                      </span>
                      <Highlight
                        theme={themes.nightOwl}
                        code={syntheticEventCode}
                        language="javascript"
                      >
                        {({ style, tokens, getLineProps, getTokenProps }) => (
                          <pre
                            className="p-3 rounded-lg text-xs overflow-x-auto"
                            style={style}
                          >
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line })}>
                                <span className="text-slate-500 mr-3 select-none w-4 inline-block text-right">
                                  {i + 1}
                                </span>
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

                    {/* 注意事项 */}
                    <motion.div
                      className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                      whileHover={{ scale: 1.01 }}
                    >
                      <h5 className="font-bold text-amber-600 dark:text-amber-400 mb-2">
                        💡 注意事项
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>
                          •{" "}
                          <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded text-xs">
                            e.stopPropagation()
                          </code>{" "}
                          只能阻止 React 事件冒泡
                        </li>
                        <li>• 原生事件和 React 事件混用时要注意执行顺序</li>
                        <li>
                          •{" "}
                          <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded text-xs">
                            e.nativeEvent
                          </code>{" "}
                          可以获取原生事件对象
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            {/* Tab 3: 并发特性 */}
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
                        React 18 引入了并发渲染，允许 React 同时准备多个 UI
                        版本。 通过{" "}
                        <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">
                          useTransition
                        </code>{" "}
                        和{" "}
                        <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">
                          useDeferredValue
                        </code>{" "}
                        可以控制更新优先级。
                      </p>
                    </div>

                    {/* 并发特性卡片 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "useTransition",
                          desc: '将状态更新标记为"非紧急"，可被更高优先级打断',
                          usage:
                            "const [isPending, startTransition] = useTransition()",
                          example: "搜索框输入、Tab 切换、列表筛选",
                          color: "blue",
                        },
                        {
                          name: "useDeferredValue",
                          desc: "创建一个值的延迟版本，类似自动防抖",
                          usage:
                            "const deferredValue = useDeferredValue(value)",
                          example: "搜索结果显示、大列表渲染",
                          color: "purple",
                        },
                        {
                          name: "Suspense",
                          desc: "声明式地处理异步加载状态",
                          usage: "<Suspense fallback={<Loading />}>",
                          example: "懒加载组件、数据获取",
                          color: "green",
                        },
                        {
                          name: "Automatic Batching",
                          desc: "自动合并多个状态更新，减少渲染次数",
                          usage: "// 所有 setState 自动批处理",
                          example: "异步回调、Promise、setTimeout",
                          color: "orange",
                        },
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.name}
                          className={`p-4 rounded-lg border-l-4 border-${feature.color}-500 bg-slate-50 dark:bg-slate-800`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <h5
                            className={`font-bold text-${feature.color}-600 dark:text-${feature.color}-400 mb-2`}
                          >
                            {feature.name}
                          </h5>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                            {feature.desc}
                          </p>
                          <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded block mb-2">
                            {feature.usage}
                          </code>
                          <p className="text-xs text-slate-400">
                            <span className="text-slate-500">适用场景：</span>
                            {feature.example}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* 代码示例 */}
                    <div>
                      <span className="text-xs text-slate-500 mb-2 block">
                        useTransition 实际使用：
                      </span>
                      <Highlight
                        theme={themes.nightOwl}
                        code={concurrentCode}
                        language="jsx"
                      >
                        {({ style, tokens, getLineProps, getTokenProps }) => (
                          <pre
                            className="p-3 rounded-lg text-xs overflow-x-auto"
                            style={style}
                          >
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line })}>
                                <span className="text-slate-500 mr-3 select-none w-4 inline-block text-right">
                                  {i + 1}
                                </span>
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

                    {/* 对比 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.div
                        className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h5 className="font-bold text-blue-600 dark:text-blue-400 mb-2">
                          useTransition
                        </h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>
                            • 包裹<strong>状态更新函数</strong>
                          </li>
                          <li>• 返回 isPending 状态</li>
                          <li>
                            • <strong>主动</strong>标记低优先级
                          </li>
                        </ul>
                      </motion.div>
                      <motion.div
                        className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h5 className="font-bold text-purple-600 dark:text-purple-400 mb-2">
                          useDeferredValue
                        </h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>
                            • 包裹<strong>值本身</strong>
                          </li>
                          <li>• 返回延迟后的值</li>
                          <li>
                            • <strong>被动</strong>延迟更新
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </motion.div>

        {/* 底部总结 */}
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
                  <strong>Hooks</strong> 是 Fiber 上的链表，依赖调用顺序
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>合成事件</strong>通过事件委托绑定在 root 上
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>useTransition</strong> 标记低优先级状态更新
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>useDeferredValue</strong> 延迟非关键值的更新
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
                key="hooks-rule"
                aria-label="Hooks规则"
                title={
                  <span className="text-sm font-medium">
                    Q: 为什么 Hooks 不能在条件语句中调用？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>因为 React 依赖调用顺序来匹配 Hook 和状态。</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Hooks 存储在 Fiber.memoizedState 链表中</li>
                    <li>每次渲染按顺序遍历链表取值</li>
                    <li>条件语句会导致顺序不一致，状态错乱</li>
                  </ul>
                </div>
              </AccordionItem>

              <AccordionItem
                key="synthetic-event"
                aria-label="合成事件"
                title={
                  <span className="text-sm font-medium">
                    Q: React 的事件和原生事件有什么区别？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>React 使用合成事件系统：</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>事件委托到 root 容器，不在具体 DOM 上绑定</li>
                    <li>SyntheticEvent 封装了原生事件，跨浏览器一致</li>
                    <li>原生事件先执行，React 事件后执行</li>
                    <li>stopPropagation 只能阻止 React 事件冒泡</li>
                  </ul>
                </div>
              </AccordionItem>

              <AccordionItem
                key="transition"
                aria-label="Transition"
                title={
                  <span className="text-sm font-medium">
                    Q: useTransition 和 useDeferredValue 的区别？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        useTransition
                      </p>
                      <p>包裹 setState 函数</p>
                      <p>主动标记低优先级</p>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <p className="font-bold text-purple-600 dark:text-purple-400">
                        useDeferredValue
                      </p>
                      <p>包裹值本身</p>
                      <p>被动延迟更新</p>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem
                key="batching"
                aria-label="Batching"
                title={
                  <span className="text-sm font-medium">
                    Q: React 18 的自动批处理是什么？
                  </span>
                }
                className="bg-white dark:bg-slate-800"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    <strong>自动合并多个状态更新为一次渲染。</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>React 17：只在事件处理函数中批处理</li>
                    <li>
                      React 18：setTimeout、Promise、原生事件中也自动批处理
                    </li>
                    <li>使用 flushSync 可以强制同步更新</li>
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
