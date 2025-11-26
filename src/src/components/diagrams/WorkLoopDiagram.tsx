import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { PlayIcon, PauseIcon, RefreshCwIcon } from "../icons";

// 工作循环步骤定义
const workLoopSteps = [
  {
    id: "schedule",
    label: "scheduleUpdateOnFiber",
    desc: "调度更新入口",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  {
    id: "ensureRoot",
    label: "ensureRootIsScheduled",
    desc: "确保 Root 被调度",
    color: "bg-orange-500",
    textColor: "text-orange-500",
  },
  {
    id: "perform",
    label: "performSyncWorkOnRoot",
    desc: "执行同步工作",
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  {
    id: "workLoop",
    label: "workLoopSync/Concurrent",
    desc: "工作循环核心",
    color: "bg-purple-500",
    textColor: "text-purple-500",
  },
  {
    id: "unitOfWork",
    label: "performUnitOfWork",
    desc: "处理单个 Fiber",
    color: "bg-cyan-500",
    textColor: "text-cyan-500",
  },
  {
    id: "beginWork",
    label: "beginWork",
    desc: "递阶段：创建子 Fiber",
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  {
    id: "completeWork",
    label: "completeWork",
    desc: "归阶段：收集副作用",
    color: "bg-pink-500",
    textColor: "text-pink-500",
  },
];

// 时间切片代码
const workLoopCode = `// 同步模式 - 不可中断
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// 并发模式 - 可中断
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

// shouldYield: 检查是否需要让出主线程
// 默认 5ms 时间片`;

const performUnitOfWorkCode = `function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  
  // 递：处理当前节点，返回子节点
  let next = beginWork(current, unitOfWork, lanes);
  
  if (next === null) {
    // 归：没有子节点，完成当前节点
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}`;

export const WorkLoopDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTimeSlice, setShowTimeSlice] = useState(false);

  // 自动播放
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= workLoopSteps.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const resetAnimation = () => {
    setActiveStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* 标题和控制按钮 */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              duration: 1,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
          >
            <RefreshCwIcon size={20} className="text-purple-500" />
          </motion.div>
          WorkLoop 工作循环
        </h4>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isPlaying ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            {isPlaying ? "暂停" : "播放"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetAnimation}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            重置
          </motion.button>
        </div>
      </div>

      {/* 工作流程可视化 */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {workLoopSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`relative px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                activeStep === index
                  ? `${step.color} border-transparent text-white shadow-lg`
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-slate-400"
              }`}
              onClick={() => setActiveStep(index)}
              animate={
                activeStep === index
                  ? { scale: 1.1, y: -5 }
                  : { scale: 1, y: 0 }
              }
              whileHover={{ scale: activeStep === index ? 1.1 : 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === index
                      ? "bg-white/30 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-sm font-mono font-medium ${
                    activeStep !== index ? step.textColor : ""
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {/* 连接箭头 */}
              {index < workLoopSteps.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-slate-400 hidden lg:block">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 当前步骤描述 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border-l-4 ${workLoopSteps[activeStep].color} bg-white dark:bg-slate-800`}
          >
            <h5
              className={`font-bold ${workLoopSteps[activeStep].textColor} mb-1`}
            >
              {workLoopSteps[activeStep].label}
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {workLoopSteps[activeStep].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 时间切片演示 */}
      <motion.div
        className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-bold text-slate-800 dark:text-white">
            时间切片演示
          </h5>
          <button
            onClick={() => setShowTimeSlice(!showTimeSlice)}
            className="text-xs text-blue-500 hover:underline"
          >
            {showTimeSlice ? "隐藏动画" : "显示动画"}
          </button>
        </div>

        {showTimeSlice && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4"
          >
            <div className="bg-slate-200 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500">
                  帧时间线 (16.6ms/帧)
                </span>
              </div>
              <div className="relative h-8 bg-slate-300 dark:bg-slate-700 rounded overflow-hidden">
                {/* React 工作块 */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-y-0 bg-gradient-to-r from-purple-500 to-purple-400 rounded"
                    style={{ left: `${i * 35}%`, width: "28%" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.8,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                  />
                ))}
                {/* 5ms 标记 */}
                <div className="absolute inset-y-0 left-[30%] w-px bg-red-500" />
                <div className="absolute inset-y-0 left-[65%] w-px bg-red-500" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-purple-500" /> React 工作
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-px h-3 bg-red-500" /> shouldYield 检查点
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 代码示例 */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-500 mb-2 block">
              workLoop 核心代码：
            </span>
            <Highlight
              theme={themes.nightOwl}
              code={workLoopCode}
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
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
          <div>
            <span className="text-xs text-slate-500 mb-2 block">
              performUnitOfWork：
            </span>
            <Highlight
              theme={themes.nightOwl}
              code={performUnitOfWorkCode}
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
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </motion.div>

      {/* 递归与归的说明 */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          whileHover={{ scale: 1.02 }}
        >
          <h5 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
            <span className="text-lg">↓</span> 递阶段 (beginWork)
          </h5>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>• 根据 Fiber 类型调用不同处理函数</li>
            <li>• 比较新旧 props/state，标记更新</li>
            <li>• 创建或复用子 Fiber 节点</li>
            <li>• 返回第一个子节点继续向下</li>
          </ul>
        </motion.div>
        <motion.div
          className="p-4 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800"
          whileHover={{ scale: 1.02 }}
        >
          <h5 className="font-bold text-pink-600 dark:text-pink-400 mb-2 flex items-center gap-2">
            <span className="text-lg">↑</span> 归阶段 (completeWork)
          </h5>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>• 创建或更新真实 DOM 节点</li>
            <li>• 处理 props 变化</li>
            <li>• 将副作用节点加入 Effect List</li>
            <li>• 向上返回到兄弟或父节点</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
