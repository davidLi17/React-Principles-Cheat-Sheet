import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { PlayIcon, PauseIcon, ChevronRightIcon, GitBranchIcon } from "../icons";
import { useAutoPlay } from "../../hooks/useAutoPlay";
import { sourceCodeSteps } from "../../data";
import { useKeyPress } from "ahooks";

// 阶段配置
const phaseConfig = {
  trigger: {
    color: "yellow",
    bgClass: "bg-yellow-500/20 border-yellow-500/50",
    dotClass: "bg-yellow-500",
    label: "Trigger 触发",
    description: "用户交互触发状态更新",
  },
  render: {
    color: "blue",
    bgClass: "bg-blue-500/20 border-blue-500/50",
    dotClass: "bg-blue-500",
    label: "Render 渲染",
    description: "Fiber 树构建与 Diff",
  },
  commit: {
    color: "green",
    bgClass: "bg-green-500/20 border-green-500/50",
    dotClass: "bg-green-500",
    label: "Commit 提交",
    description: "操作真实 DOM",
  },
};

// 文件树节点
interface FileNode {
  name: string;
  type: "folder" | "file";
  children?: FileNode[];
  highlight?: boolean;
}

// React 源码文件树结构
const reactSourceTree: FileNode[] = [
  {
    name: "packages",
    type: "folder",
    children: [
      {
        name: "react",
        type: "folder",
        children: [
          {
            name: "src",
            type: "folder",
            children: [
              { name: "React.js", type: "file" },
              { name: "ReactHooks.js", type: "file" },
            ],
          },
        ],
      },
      {
        name: "react-reconciler",
        type: "folder",
        children: [
          {
            name: "src",
            type: "folder",
            children: [
              { name: "ReactFiberHooks.js", type: "file" },
              { name: "ReactFiberWorkLoop.js", type: "file" },
              { name: "ReactFiberBeginWork.js", type: "file" },
              { name: "ReactFiberCompleteWork.js", type: "file" },
              { name: "ReactFiberCommitWork.js", type: "file" },
              { name: "ReactFiberRootScheduler.js", type: "file" },
            ],
          },
        ],
      },
      {
        name: "react-dom",
        type: "folder",
        children: [
          {
            name: "src",
            type: "folder",
            children: [
              { name: "client", type: "folder" },
              { name: "events", type: "folder" },
            ],
          },
        ],
      },
      {
        name: "scheduler",
        type: "folder",
        children: [
          {
            name: "src",
            type: "folder",
            children: [{ name: "Scheduler.js", type: "file" }],
          },
        ],
      },
    ],
  },
];

// 文件树组件
const FileTree: React.FC<{
  nodes: FileNode[];
  currentFile: string;
  depth?: number;
}> = ({ nodes, currentFile, depth = 0 }) => {
  return (
    <div className="text-xs font-mono">
      {nodes.map((node) => {
        const isHighlighted =
          node.type === "file" && currentFile.includes(node.name);
        return (
          <div key={node.name}>
            <div
              className={`flex items-center gap-1 py-0.5 px-1 rounded transition-colors ${
                isHighlighted
                  ? "bg-blue-500/30 text-blue-300"
                  : "text-slate-400 hover:text-slate-300"
              }`}
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              {node.type === "folder" ? (
                <span className="text-yellow-500">📁</span>
              ) : (
                <span
                  className={isHighlighted ? "text-blue-400" : "text-slate-500"}
                >
                  📄
                </span>
              )}
              <span className={isHighlighted ? "font-bold" : ""}>
                {node.name}
              </span>
              {isHighlighted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1 text-[10px] bg-blue-500 text-white px-1 rounded"
                >
                  当前
                </motion.span>
              )}
            </div>
            {node.children && (
              <FileTree
                nodes={node.children}
                currentFile={currentFile}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// 代码高亮组件
const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language="javascript">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="p-4 rounded-lg overflow-x-auto text-xs leading-relaxed"
          style={{ ...style, background: "transparent" }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="table-row">
              <span className="table-cell pr-4 text-slate-600 select-none text-right w-8">
                {i + 1}
              </span>
              <span className="table-cell">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

// 速度选项
const speedOptions = [
  { label: "0.5x", value: 5000 },
  { label: "1x", value: 2500 },
  { label: "2x", value: 1250 },
];

export const SourceCodeFlowDiagram: React.FC = () => {
  const [speed, setSpeed] = useState(2500);
  const [showFileTree, setShowFileTree] = useState(true);

  const {
    currentStep,
    isPlaying,
    toggle,
    goToStep,
    nextStep,
    prevStep,
    progress,
  } = useAutoPlay({
    totalSteps: sourceCodeSteps.length,
    interval: speed,
  });

  const currentStepData = sourceCodeSteps[currentStep];
  const currentPhase = phaseConfig[currentStepData.phase];

  // 键盘快捷键 - 使用 ahooks 的 useKeyPress
  const shouldIgnoreKeyInput = (event: KeyboardEvent) => {
    return (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    );
  };

  const createKeyFilter = (keyName: string) => {
    return (event: KeyboardEvent) => !shouldIgnoreKeyInput(event) && event.key.toLowerCase() === keyName;
  };

  useKeyPress(
    createKeyFilter("arrowleft"),
    () => prevStep(),
    { exactMatch: true }
  );

  useKeyPress(
    createKeyFilter("arrowright"),
    () => nextStep(),
    { exactMatch: true }
  );

  useKeyPress(
    createKeyFilter(" "),
    (event: KeyboardEvent) => {
      event.preventDefault();
      toggle();
    },
    { exactMatch: true }
  );

  // 按阶段分组步骤
  const groupedSteps = {
    trigger: sourceCodeSteps.filter((s) => s.phase === "trigger"),
    render: sourceCodeSteps.filter((s) => s.phase === "render"),
    commit: sourceCodeSteps.filter((s) => s.phase === "commit"),
  };

  return (
    <div className="space-y-6">
      {/* 顶部横向时间线 */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 overflow-x-auto">
        <div className="flex items-stretch gap-2 min-w-[600px]">
          {(["trigger", "render", "commit"] as const).map((phase, phaseIdx) => (
            <React.Fragment key={phase}>
              <div
                className={`flex-1 rounded-lg p-3 border ${phaseConfig[phase].bgClass}`}
              >
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                  {phaseConfig[phase].label}
                </div>
                <div className="flex gap-1">
                  {groupedSteps[phase].map((step, idx) => {
                    const globalIdx = sourceCodeSteps.indexOf(step);
                    const isActive = globalIdx === currentStep;
                    const isPast = globalIdx < currentStep;

                    return (
                      <motion.button
                        key={step.name}
                        onClick={() => goToStep(globalIdx)}
                        className={`relative flex-1 p-2 rounded text-[10px] font-mono transition-all ${
                          isActive
                            ? `bg-white dark:bg-slate-800 shadow-lg border-2 border-${phaseConfig[phase].color}-500`
                            : isPast
                            ? "bg-white/50 dark:bg-slate-800/50"
                            : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className={`absolute inset-0 rounded border-2 border-${phaseConfig[phase].color}-500`}
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.4,
                            }}
                          />
                        )}
                        <div className="relative">
                          <div
                            className={`w-4 h-4 mx-auto rounded-full mb-1 flex items-center justify-center text-[8px] font-bold ${
                              isPast
                                ? "bg-green-500 text-white"
                                : isActive
                                ? `${phaseConfig[phase].dotClass} text-white animate-pulse`
                                : "bg-slate-300 dark:bg-slate-600 text-slate-500"
                            }`}
                          >
                            {isPast ? "✓" : globalIdx + 1}
                          </div>
                          <div
                            className={`truncate ${
                              isActive
                                ? "text-slate-800 dark:text-white font-bold"
                                : "text-slate-500"
                            }`}
                          >
                            {
                              step.name
                                .replace(/([A-Z])/g, "\n$1")
                                .split("\n")[0]
                            }
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              {phaseIdx < 2 && (
                <div className="flex items-center text-slate-400 dark:text-slate-600">
                  <ChevronRightIcon size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 控制栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className={`px-4 py-2 flex items-center gap-2 text-white text-sm rounded-lg transition-all ${
              isPlaying
                ? "bg-orange-500 hover:bg-orange-400"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
            {isPlaying ? "暂停" : "自动播放"}
          </button>

          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            {speedOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSpeed(opt.value)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  speed === opt.value
                    ? "bg-blue-500 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-30 text-slate-700 dark:text-white text-sm rounded-lg transition-colors"
          >
            ← 上一步
          </button>
          <span className="text-sm text-slate-500 min-w-[60px] text-center">
            {currentStep + 1} / {sourceCodeSteps.length}
          </span>
          <button
            onClick={nextStep}
            disabled={currentStep === sourceCodeSteps.length - 1}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-sm rounded-lg transition-colors"
          >
            下一步 →
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">
            ←
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">
            →
          </kbd>
          <span>切换</span>
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">
            Space
          </kbd>
          <span>播放</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 主内容区 - 双栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 左侧：文件树 */}
        <div
          className={`${
            showFileTree ? "block" : "hidden"
          } lg:block lg:col-span-1`}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-bold">
                <GitBranchIcon size={16} />
                React 源码结构
              </div>
              <button
                onClick={() => setShowFileTree(!showFileTree)}
                className="lg:hidden text-xs text-slate-500"
              >
                收起
              </button>
            </div>
            <FileTree
              nodes={reactSourceTree}
              currentFile={currentStepData.file}
            />

            <div className="mt-4 pt-4 border-t border-slate-700">
              <a
                href={currentStepData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>📎</span>
                <span>在 GitHub 查看源码</span>
              </a>
            </div>
          </div>
        </div>

        {/* 右侧：详情 */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
            >
              {/* 标题栏 */}
              <div
                className={`p-4 border-b border-slate-200 dark:border-slate-700 ${currentPhase.bgClass}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-3 h-3 rounded-full ${currentPhase.dotClass}`}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {currentPhase.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-mono text-slate-800 dark:text-white">
                      {currentStepData.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {currentStepData.file}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-300 dark:text-slate-600">
                      {String(currentStep + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              {/* 描述 */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentStepData.detail}
                </p>
              </div>

              {/* 关键点 */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  🔑 关键点
                </h4>
                <ul className="space-y-1">
                  {currentStepData.keyPoints.map((point, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* 代码 */}
              <div className="bg-[#011627] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span className="text-xs text-slate-400 font-mono">
                    {currentStepData.path}
                  </span>
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <CodeBlock code={currentStepData.code} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 justify-center text-xs">
        {(["trigger", "render", "commit"] as const).map((phase) => (
          <span key={phase} className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded ${phaseConfig[phase].dotClass}`}
            />
            <span className="text-slate-600 dark:text-slate-400">
              {phaseConfig[phase].label} - {phaseConfig[phase].description}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
