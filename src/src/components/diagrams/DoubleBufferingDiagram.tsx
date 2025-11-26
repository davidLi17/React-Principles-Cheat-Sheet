import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCwIcon, PlayIcon, PauseIcon } from "../icons";
import { Highlight, themes } from "prism-react-renderer";

// 双缓存切换代码
const doubleBufferCode = `// Commit 阶段末尾，切换 current 指针
function commitRoot(root) {
  // ... Mutation 阶段操作 DOM
  
  // 一行代码完成树的切换！
  root.current = finishedWork;
  
  // 原来的 current 变成新的 workInProgress
  // 下次更新时复用
}`;

// 更新流程步骤
const updateSteps = [
  { id: "trigger", label: "触发更新", desc: "setState / props 变化" },
  { id: "clone", label: "克隆 Fiber", desc: "基于 current 创建 WIP 节点" },
  { id: "reconcile", label: "Reconcile", desc: "在 WIP 树上执行 Diff" },
  { id: "commit", label: "Commit", desc: "切换 root.current 指针" },
];

export const DoubleBufferingDiagram: React.FC = () => {
  const [isSwapped, setIsSwapped] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCode, setShowCode] = useState(false);

  // 自动播放更新流程
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= updateSteps.length - 1) {
          setIsSwapped(true);
          setTimeout(() => {
            setIsAutoPlaying(false);
            setCurrentStep(0);
          }, 1500);
          return prev;
        }
        if (prev === updateSteps.length - 2) {
          setIsSwapped(true);
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
  };

  const startAutoPlay = () => {
    setIsSwapped(false);
    setCurrentStep(0);
    setIsAutoPlaying(true);
  };

  return (
    <div className="space-y-4">
      {/* 主图表区域 */}
      <motion.div
        className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 标题和控制按钮 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
            <motion.div
              animate={{ rotate: isSwapped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCwIcon size={18} className="text-yellow-500" />
            </motion.div>
            内存中的两棵树
          </h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startAutoPlay}
              disabled={isAutoPlaying}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isAutoPlaying
                  ? "bg-slate-400 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <PlayIcon size={12} />
              演示更新流程
            </motion.button>
            <motion.button
              onClick={handleSwap}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-full flex items-center gap-2 transition-colors"
            >
              <RefreshCwIcon
                size={12}
                className={isSwapped ? "animate-spin" : ""}
              />
              模拟 Commit 交换
            </motion.button>
          </div>
        </div>

        {/* 更新流程步骤指示器 */}
        <AnimatePresence>
          {isAutoPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex justify-between items-center px-4">
                {updateSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <motion.div
                      className={`flex flex-col items-center ${
                        currentStep >= index ? "opacity-100" : "opacity-40"
                      }`}
                      animate={
                        currentStep === index ? { scale: 1.1 } : { scale: 1 }
                      }
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep >= index
                            ? "bg-blue-500 text-white"
                            : "bg-slate-300 dark:bg-slate-700 text-slate-500"
                        }`}
                        animate={
                          currentStep === index ? { scale: [1, 1.2, 1] } : {}
                        }
                        transition={{ duration: 0.3 }}
                      >
                        {index + 1}
                      </motion.div>
                      <span className="text-[10px] text-slate-500 mt-1 text-center max-w-[60px]">
                        {step.label}
                      </span>
                    </motion.div>
                    {index < updateSteps.length - 1 && (
                      <motion.div
                        className={`flex-1 h-0.5 mx-2 ${
                          currentStep > index
                            ? "bg-blue-500"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: currentStep > index ? 1 : 0 }}
                        style={{ originX: 0 }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 双缓存可视化 */}
        <div className="relative w-full h-56 flex items-center justify-center gap-8">
          {/* FiberRoot 指针指示 */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-xs text-slate-500 font-mono mb-1">
              FiberRoot
            </div>
            <motion.div
              className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-500 mx-auto"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <div className="text-[10px] text-yellow-500 font-mono">
              root.current
            </div>
          </motion.div>

          {/* Tree A - Current/WIP */}
          <motion.div
            className={`transition-all duration-700 absolute w-44 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2
            ${
              isSwapped
                ? "translate-x-28 border-green-500 bg-green-50 dark:bg-green-900/10 shadow-lg shadow-green-500/20"
                : "-translate-x-28 border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800/30"
            }`}
            animate={{
              boxShadow: isSwapped ? "0 0 30px rgba(34, 197, 94, 0.3)" : "none",
            }}
          >
            {/* Tree visualization */}
            <motion.div
              className={`w-10 h-10 rounded-full ${
                isSwapped ? "bg-green-500" : "bg-slate-400"
              } mb-2 flex items-center justify-center`}
              animate={{ scale: isSwapped ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white text-xs font-bold">App</span>
            </motion.div>
            <div className="flex gap-3">
              <motion.div
                className={`w-7 h-7 rounded-full ${
                  isSwapped ? "bg-green-400" : "bg-slate-300"
                } flex items-center justify-center`}
              >
                <span className="text-white text-[8px]">H</span>
              </motion.div>
              <motion.div
                className={`w-7 h-7 rounded-full ${
                  isSwapped ? "bg-green-400" : "bg-slate-300"
                } flex items-center justify-center`}
              >
                <span className="text-white text-[8px]">M</span>
              </motion.div>
            </div>
            <motion.span
              className={`mt-2 text-xs font-bold uppercase ${
                isSwapped
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-500"
              }`}
              animate={{ scale: isSwapped ? 1.1 : 1 }}
            >
              {isSwapped ? "✓ Current" : "WorkInProgress"}
            </motion.span>
            <span className="text-[10px] text-slate-400">
              {isSwapped ? "屏幕显示" : "后台构建中..."}
            </span>
          </motion.div>

          {/* Tree B - WIP/Current */}
          <motion.div
            className={`transition-all duration-700 absolute w-44 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2
            ${
              isSwapped
                ? "-translate-x-28 border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800/30"
                : "translate-x-28 border-green-500 bg-green-50 dark:bg-green-900/10 shadow-lg shadow-green-500/20"
            }`}
            animate={{
              boxShadow: !isSwapped
                ? "0 0 30px rgba(34, 197, 94, 0.3)"
                : "none",
            }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full ${
                !isSwapped ? "bg-green-500" : "bg-slate-400"
              } mb-2 flex items-center justify-center`}
              animate={{ scale: !isSwapped ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white text-xs font-bold">App</span>
            </motion.div>
            <div className="flex gap-3">
              <motion.div
                className={`w-7 h-7 rounded-full ${
                  !isSwapped ? "bg-green-400" : "bg-slate-300"
                } flex items-center justify-center`}
              >
                <span className="text-white text-[8px]">H</span>
              </motion.div>
              <motion.div
                className={`w-7 h-7 rounded-full ${
                  !isSwapped ? "bg-green-400" : "bg-slate-300"
                } flex items-center justify-center`}
              >
                <span className="text-white text-[8px]">M</span>
              </motion.div>
            </div>
            <motion.span
              className={`mt-2 text-xs font-bold uppercase ${
                !isSwapped
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-500"
              }`}
              animate={{ scale: !isSwapped ? 1.1 : 1 }}
            >
              {!isSwapped ? "✓ Current" : "WorkInProgress"}
            </motion.span>
            <span className="text-[10px] text-slate-400">
              {!isSwapped ? "屏幕显示" : "后台构建中..."}
            </span>
          </motion.div>

          {/* Center swap indicator */}
          <motion.div
            className="absolute text-slate-300 dark:text-slate-600 pointer-events-none z-10"
            animate={{ rotate: isSwapped ? 180 : 0 }}
            transition={{ duration: 0.7 }}
          >
            <RefreshCwIcon size={36} />
          </motion.div>
        </div>

        {/* 说明文字 */}
        <motion.p
          className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          后台构建 WIP 树，计算完成后，React 只需修改
          <code className="text-yellow-600 dark:text-yellow-400 font-mono mx-1 bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
            root.current
          </code>
          指针指向新树。
          <span className="text-green-500 font-medium">瞬间完成，无闪烁。</span>
        </motion.p>
      </motion.div>

      {/* alternate 指针说明 */}
      <motion.div
        className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2 text-sm">
          alternate 指针
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          每个 Fiber 节点有{" "}
          <code className="bg-purple-100 dark:bg-purple-800 px-1 rounded">
            alternate
          </code>{" "}
          属性， 指向另一棵树中对应的节点。这样可以：
        </p>
        <ul className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
          <li>• 复用上次渲染的 Fiber 节点（减少内存分配）</li>
          <li>• 快速对比新旧 props/state</li>
          <li>• 实现 bailout 优化（跳过无变化的子树）</li>
        </ul>
      </motion.div>

      {/* 代码示例展开 */}
      <motion.button
        onClick={() => setShowCode(!showCode)}
        className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{showCode ? "收起" : "查看"} 源码实现</span>
        <motion.span
          animate={{ rotate: showCode ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Highlight
              theme={themes.nightOwl}
              code={doubleBufferCode}
              language="javascript"
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className="p-4 rounded-lg text-xs overflow-x-auto"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
