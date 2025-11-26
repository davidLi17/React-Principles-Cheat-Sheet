import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, CpuIcon, GitCommitIcon, ZapIcon, ClockIcon } from "../icons";

interface PipelineStep {
  id: string;
  label: string;
  color: string;
  description: string;
  details: string[];
  coreFunction: string;
  badge: string;
}

const pipelineSteps: PipelineStep[] = [
  {
    id: "trigger",
    label: "Trigger",
    color: "blue",
    description: "setState / props change",
    details: [
      "用户交互触发事件",
      "调用 setState/dispatch",
      "创建 Update 对象",
      "将 Update 加入队列",
    ],
    coreFunction: "dispatchSetState()",
    badge: "入口",
  },
  {
    id: "schedule",
    label: "Schedule",
    color: "purple",
    description: "调度器分配优先级",
    details: [
      "根据事件类型确定 Lane",
      "将任务加入调度队列",
      "使用 MessageChannel 调度",
      "判断是否需要中断当前任务",
    ],
    coreFunction: "scheduleUpdateOnFiber()",
    badge: "调度",
  },
  {
    id: "render",
    label: "Render",
    color: "yellow",
    description: "调和 & Diff",
    details: [
      "从根节点开始深度遍历",
      "执行函数组件/类组件",
      "执行 Hooks 链表",
      "Diff 对比打 Flags 标记",
    ],
    coreFunction: "performUnitOfWork()",
    badge: "异步可中断",
  },
  {
    id: "commit",
    label: "Commit",
    color: "red",
    description: "操作真实 DOM",
    details: [
      "BeforeMutation: getSnapshotBeforeUpdate",
      "Mutation: 执行 DOM 操作",
      "Layout: 执行 useLayoutEffect",
      "切换 current 树指针",
    ],
    coreFunction: "commitRoot()",
    badge: "同步不可中断",
  },
];

// Render 阶段子步骤
const renderPhaseSteps = [
  { name: "beginWork", desc: "向下遍历，创建子 Fiber", color: "yellow" },
  { name: "reconcileChildren", desc: "Diff 算法核心", color: "orange" },
  { name: "completeWork", desc: "向上归并，创建 DOM 节点", color: "green" },
];

// Commit 阶段子步骤
const commitPhaseSteps = [
  { name: "BeforeMutation", desc: "DOM 操作前", color: "blue" },
  { name: "Mutation", desc: "执行 DOM 增删改", color: "red" },
  { name: "Layout", desc: "DOM 操作后", color: "purple" },
];

export const PipelineDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const playAnimation = async () => {
    const changeTime = 5000;

    if (isPlaying) return;
    setIsPlaying(true);
    setActiveStep(-1);

    for (let i = 0; i < pipelineSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, changeTime));
      setActiveStep(i);
    }

    await new Promise((resolve) => setTimeout(resolve, changeTime));
    setIsPlaying(false);
  };

  const getStepColor = (color: string, isActive: boolean) => {
    const colors: Record<
      string,
      { bg: string; border: string; text: string; glow: string; light: string }
    > = {
      blue: {
        bg: isActive ? "bg-blue-500" : "bg-blue-500/20",
        border: "border-blue-500",
        text: "text-blue-500",
        glow: "shadow-blue-500/50",
        light: "bg-blue-50 dark:bg-blue-900/20",
      },
      purple: {
        bg: isActive ? "bg-purple-500" : "bg-purple-500/20",
        border: "border-purple-500",
        text: "text-purple-500",
        glow: "shadow-purple-500/50",
        light: "bg-purple-50 dark:bg-purple-900/20",
      },
      yellow: {
        bg: isActive ? "bg-yellow-500" : "bg-yellow-500/20",
        border: "border-yellow-500",
        text: "text-yellow-500",
        glow: "shadow-yellow-500/50",
        light: "bg-yellow-50 dark:bg-yellow-900/20",
      },
      orange: {
        bg: isActive ? "bg-orange-500" : "bg-orange-500/20",
        border: "border-orange-500",
        text: "text-orange-500",
        glow: "shadow-orange-500/50",
        light: "bg-orange-50 dark:bg-orange-900/20",
      },
      red: {
        bg: isActive ? "bg-red-500" : "bg-red-500/20",
        border: "border-red-500",
        text: "text-red-500",
        glow: "shadow-red-500/50",
        light: "bg-red-50 dark:bg-red-900/20",
      },
      green: {
        bg: isActive ? "bg-green-500" : "bg-green-500/20",
        border: "border-green-500",
        text: "text-green-500",
        glow: "shadow-green-500/50",
        light: "bg-green-50 dark:bg-green-900/20",
      },
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* 流程图动画 */}
      <div className="relative pb-8">
        <div className="flex items-center justify-between gap-2 md:gap-4 overflow-x-hidden pb-4">
          {pipelineSteps.map((step, index) => {
            const isActive = activeStep >= index;
            const isCurrent = activeStep === index;
            const colors = getStepColor(step.color, isActive);

            return (
              <React.Fragment key={step.id}>
                <motion.div
                  className="flex flex-col items-center min-w-[90px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Badge */}
                  <motion.span
                    className={`text-[10px] px-2 py-0.5 rounded-full mb-2 ${
                      isActive
                        ? `${colors.bg} text-white`
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }`}
                    animate={{ scale: isCurrent ? [1, 1.1, 1] : 1 }}
                    transition={{
                      duration: 0.5,
                      repeat: isCurrent ? Infinity : 0,
                    }}
                  >
                    {step.badge}
                  </motion.span>

                  <motion.div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      border-2 ${colors.border} ${colors.bg}
                      transition-all duration-300 cursor-pointer relative
                      ${isActive ? `shadow-lg ${colors.glow}` : ""}
                    `}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      isCurrent
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(0,0,0,0)",
                              "0 0 25px 8px rgba(var(--glow-color),0.4)",
                              "0 0 0 0 rgba(0,0,0,0)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.8,
                      repeat: isCurrent ? Infinity : 0,
                    }}
                    onClick={() =>
                      setActiveStep(activeStep === index ? -1 : index)
                    }
                  >
                    <span
                      className={`text-lg font-bold ${
                        isActive ? "text-white" : colors.text
                      }`}
                    >
                      {index + 1}
                    </span>

                    {/* 当前步骤指示器 */}
                    {isCurrent && (
                      <motion.div
                        className="absolute -inset-1 rounded-full border-2 border-dashed"
                        style={{ borderColor: `var(--${step.color}-500)` }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </motion.div>

                  <motion.span
                    className={`mt-2 text-sm font-bold ${
                      isActive ? colors.text : "text-slate-400"
                    }`}
                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                  >
                    {step.label}
                  </motion.span>
                  <span className="text-[10px] text-slate-500 text-center mt-0.5">
                    {step.description}
                  </span>
                </motion.div>

                {index < pipelineSteps.length - 1 && (
                  <div className="flex-1 h-1.5 min-w-[30px] relative self-center mb-8">
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        getStepColor(pipelineSteps[index + 1].color, true).bg
                      }`}
                      initial={{ width: "0%" }}
                      animate={{ width: activeStep > index ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {/* 箭头 */}
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderLeft: `10px solid ${
                          activeStep > index
                            ? pipelineSteps[index + 1].color === "blue"
                              ? "#3b82f6"
                              : pipelineSteps[index + 1].color === "purple"
                              ? "#a855f7"
                              : pipelineSteps[index + 1].color === "yellow"
                              ? "#eab308"
                              : pipelineSteps[index + 1].color === "red"
                              ? "#ef4444"
                              : "#94a3b8"
                            : "#cbd5e1"
                        }`,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 播放按钮 */}
        <motion.button
          onClick={playAnimation}
          disabled={isPlaying}
          className={`
            absolute -bottom-4 left-1/2 -translate-x-1/2
            flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            text-white text-sm font-medium
            shadow-lg hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlayIcon size={14} />
          {isPlaying ? "播放中..." : "▶ 演示完整流程"}
        </motion.button>
      </div>

      {/* 当前步骤详情 */}
      <AnimatePresence mode="wait">
        {activeStep >= 0 && showDetails && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-8"
          >
            <div
              className={`p-5 rounded-xl border-2 ${
                getStepColor(pipelineSteps[activeStep].color, true).border
              } ${getStepColor(pipelineSteps[activeStep].color, false).light}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4
                  className={`text-lg font-bold ${
                    getStepColor(pipelineSteps[activeStep].color, true).text
                  }`}
                >
                  Step {activeStep + 1}: {pipelineSteps[activeStep].label}
                </h4>
                <code className="text-xs bg-slate-800 text-green-400 px-3 py-1 rounded-full font-mono">
                  {pipelineSteps[activeStep].coreFunction}
                </code>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">
                    执行步骤：
                  </p>
                  <ul className="space-y-2">
                    {pipelineSteps[activeStep].details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <span
                          className={`w-5 h-5 rounded-full ${
                            getStepColor(pipelineSteps[activeStep].color, true)
                              .bg
                          } text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          {i + 1}
                        </span>
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Render 阶段子流程 */}
                {activeStep === 2 && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-3 font-medium">
                      Render 阶段工作循环：
                    </p>
                    <div className="space-y-2">
                      {renderPhaseSteps.map((phase, i) => (
                        <motion.div
                          key={phase.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            getStepColor(phase.color, false).light
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg ${
                              getStepColor(phase.color, true).bg
                            } flex items-center justify-center`}
                          >
                            <span className="text-white text-xs font-bold">
                              {i + 1}
                            </span>
                          </div>
                          <div>
                            <code
                              className={`text-xs font-mono font-bold ${
                                getStepColor(phase.color, true).text
                              }`}
                            >
                              {phase.name}()
                            </code>
                            <p className="text-xs text-slate-500">
                              {phase.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">
                      * 深度优先遍历：先向下 beginWork，再向上 completeWork
                    </p>
                  </div>
                )}

                {/* Commit 阶段子流程 */}
                {activeStep === 3 && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-3 font-medium">
                      Commit 三个子阶段：
                    </p>
                    <div className="space-y-2">
                      {commitPhaseSteps.map((phase, i) => (
                        <motion.div
                          key={phase.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            getStepColor(phase.color, false).light
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg ${
                              getStepColor(phase.color, true).bg
                            } flex items-center justify-center`}
                          >
                            <span className="text-white text-xs font-bold">
                              {i + 1}
                            </span>
                          </div>
                          <div>
                            <code
                              className={`text-xs font-mono font-bold ${
                                getStepColor(phase.color, true).text
                              }`}
                            >
                              {phase.name}
                            </code>
                            <p className="text-xs text-slate-500">
                              {phase.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">
                      * useEffect 在 Layout 后异步执行，useLayoutEffect 在
                      Layout 阶段同步执行
                    </p>
                  </div>
                )}

                {/* Trigger 阶段说明 */}
                {activeStep === 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-3 font-medium">
                      触发更新的方式：
                    </p>
                    <div className="space-y-2">
                      {[
                        { method: "setState()", desc: "类组件状态更新" },
                        { method: "useState setter", desc: "函数组件状态更新" },
                        {
                          method: "useReducer dispatch",
                          desc: "Reducer 状态更新",
                        },
                        { method: "forceUpdate()", desc: "强制重新渲染" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <code className="text-blue-500 font-mono text-xs">
                            {item.method}
                          </code>
                          <span className="text-slate-500 text-xs">
                            {item.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule 阶段说明 */}
                {activeStep === 1 && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-3 font-medium">
                      优先级 Lane 类型：
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { lane: "SyncLane", priority: "同步", color: "red" },
                        {
                          lane: "InputContinuousLane",
                          priority: "连续输入",
                          color: "orange",
                        },
                        {
                          lane: "DefaultLane",
                          priority: "默认",
                          color: "blue",
                        },
                        { lane: "IdleLane", priority: "空闲", color: "gray" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className={`w-2 h-2 rounded-full bg-${item.color}-500`}
                          />
                          <code className="font-mono text-purple-500">
                            {item.lane}
                          </code>
                          <span className="text-slate-400">→</span>
                          <span className="text-slate-500">
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 两阶段对比卡片 */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {/* Render Phase */}
        <motion.div
          className={`bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 
            border-2 ${
              activeStep === 2
                ? "border-yellow-500 shadow-lg shadow-yellow-500/20"
                : "border-yellow-200 dark:border-yellow-800"
            } 
            rounded-xl p-4 relative overflow-hidden transition-all duration-300`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            阶段一:渲染
          </div>
          <div className="flex items-center gap-2 mb-3 mt-2">
            <CpuIcon size={20} className="text-yellow-600" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200">
              调和阶段 (Reconciliation)
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              构建 workInProgress Fiber 树
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              执行组件函数，调用 Hooks
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              Diff 对比，标记 Flags (副作用)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              收集副作用形成 Effect List
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-[10px] px-2 py-1 rounded-full">
              ⚡ 异步
            </span>
            <span className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-[10px] px-2 py-1 rounded-full">
              🔄 可中断
            </span>
            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-[10px] px-2 py-1 rounded-full">
              ↻ 可重复
            </span>
          </div>
        </motion.div>

        {/* Commit Phase */}
        <motion.div
          className={`bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 
            border-2 ${
              activeStep === 3
                ? "border-red-500 shadow-lg shadow-red-500/20"
                : "border-red-200 dark:border-red-800"
            } 
            rounded-xl p-4 relative overflow-hidden transition-all duration-300`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            阶段二:提交
          </div>
          <div className="flex items-center gap-2 mb-3 mt-2">
            <GitCommitIcon size={20} className="text-red-600" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200">
              提交阶段 (Commit)
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              遍历 Effect List 执行副作用
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              操作真实 DOM (增/删/改)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              切换 FiberRoot.current 指针
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              调度 useEffect 异步回调
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-[10px] px-2 py-1 rounded-full">
              🔒 同步
            </span>
            <span className="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-[10px] px-2 py-1 rounded-full">
              ⛔ 不可中断
            </span>
            <span className="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-[10px] px-2 py-1 rounded-full">
              📍 一次性
            </span>
          </div>
        </motion.div>
      </div>

      {/* 知识点提示 */}
      <motion.div
        className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ClockIcon size={16} className="text-blue-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            💡 核心要点
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Render 阶段在内存中进行，不影响页面</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Commit 阶段会导致浏览器重排重绘</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>双缓冲机制避免渲染不完整的 UI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
