import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip } from "@nextui-org/react";
import { Highlight, themes } from "prism-react-renderer";

// Effect flags 定义
const effectFlags = [
  {
    name: "Placement",
    value: "0b0000000000000010",
    desc: "新节点需要插入 DOM",
    color: "success",
    bgColor: "bg-green-500",
    isAnimated: false,
  },
  {
    name: "Update",
    value: "0b0000000000000100",
    desc: "节点属性需要更新",
    color: "warning",
    bgColor: "bg-yellow-500",
    isAnimated: false,
  },
  {
    name: "Deletion",
    value: "0b0000000000001000",
    desc: "节点需要从 DOM 删除",
    color: "danger",
    bgColor: "bg-gradient-to-r from-red-500 via-pink-500 to-rose-500",
    isAnimated: true,
  },
  {
    name: "Passive",
    value: "0b0000010000000000",
    desc: "useEffect 副作用",
    color: "secondary",
    bgColor: "bg-purple-500",
    isAnimated: false,
  },
  {
    name: "LayoutMask",
    value: "0b0000000100000100",
    desc: "useLayoutEffect 副作用",
    color: "primary",
    bgColor: "bg-blue-500",
    isAnimated: false,
  },
];

// Commit 三阶段
const commitPhases = [
  {
    name: "Before Mutation",
    desc: "执行 DOM 操作前",
    tasks: ["getSnapshotBeforeUpdate", "调度 useEffect"],
    color: "bg-amber-500",
    textColor: "text-amber-500",
  },
  {
    name: "Mutation",
    desc: "执行 DOM 操作",
    tasks: ["插入节点 (Placement)", "更新节点 (Update)", "删除节点 (Deletion)"],
    color: "bg-red-500",
    textColor: "text-red-500",
  },
  {
    name: "Layout",
    desc: "DOM 操作完成后",
    tasks: ["useLayoutEffect", "componentDidMount/Update", "更新 ref"],
    color: "bg-green-500",
    textColor: "text-green-500",
  },
];

// 代码示例
const effectListCode = `// completeWork 中收集副作用
function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;
  
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  
  completedWork.subtreeFlags |= subtreeFlags;
}`;

const commitCode = `// Commit 阶段入口
function commitRoot(root) {
  const finishedWork = root.finishedWork;
  
  // 1. Before Mutation
  commitBeforeMutationEffects(root, finishedWork);
  
  // 2. Mutation - 操作 DOM
  commitMutationEffects(root, finishedWork);
  
  // 切换 current 指针
  root.current = finishedWork;
  
  // 3. Layout - DOM 完成后
  commitLayoutEffects(finishedWork, root);
}`;

export const EffectListDiagram: React.FC = () => {
  const [activePhase, setActivePhase] = useState(1);
  const [selectedFlag, setSelectedFlag] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center"
        >
          <span className="text-purple-500 text-sm">⚡</span>
        </motion.div>
        副作用收集与 Commit 阶段
      </h4>

      {/* Effect Flags 展示 */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h5 className="font-bold text-slate-700 dark:text-slate-200 mb-4">
          Fiber Flags (副作用标记)
        </h5>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {effectFlags.map((flag, index) => (
            <motion.div
              key={flag.name}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedFlag === index
                  ? `border-${
                      flag.color === "success"
                        ? "green"
                        : flag.color === "warning"
                        ? "yellow"
                        : flag.color === "danger"
                        ? "red"
                        : flag.color === "secondary"
                        ? "purple"
                        : "blue"
                    }-500 ${flag.bgColor}/10 shadow-md`
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400"
              }`}
              onClick={() =>
                setSelectedFlag(selectedFlag === index ? null : index)
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${flag.bgColor}`}
                  ></span>
                  <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-200">
                    {flag.name}
                  </span>
                </div>
                <Chip size="sm" color={flag.color as any} variant="flat">
                  flag
                </Chip>
              </div>
              <AnimatePresence>
                {selectedFlag === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {flag.desc}
                    </p>
                    <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded block">
                      {flag.value}
                    </code>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* 位运算说明 */}
        <motion.div
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>subtreeFlags</strong>: 子树的合并标记。通过{" "}
            <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
              |=
            </code>{" "}
            位运算冒泡， 可以 O(1) 判断子树是否有副作用，避免不必要的遍历。
          </p>
        </motion.div>
      </div>

      {/* Commit 三阶段 */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h5 className="font-bold text-slate-700 dark:text-slate-200 mb-4">
          Commit 三阶段
        </h5>

        {/* 阶段选择器 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {commitPhases.map((phase, index) => (
            <motion.button
              key={phase.name}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activePhase === index
                  ? `${phase.color} text-white shadow-lg`
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => setActivePhase(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{index + 1}.</span>
              {phase.name}
            </motion.button>
          ))}
        </div>

        {/* 阶段详情 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-4 rounded-lg border-l-4 ${commitPhases[activePhase].color} bg-white dark:bg-slate-800`}
          >
            <h6
              className={`font-bold ${commitPhases[activePhase].textColor} mb-2`}
            >
              {commitPhases[activePhase].name}
            </h6>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              {commitPhases[activePhase].desc}
            </p>
            <ul className="space-y-2">
              {commitPhases[activePhase].tasks.map((task, i) => (
                <motion.li
                  key={task}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${commitPhases[activePhase].color}`}
                  ></span>
                  {task}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* 流程图示 */}
        <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto py-4">
          {commitPhases.map((phase, index) => (
            <React.Fragment key={phase.name}>
              <motion.div
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  activePhase === index
                    ? `${phase.color} text-white`
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
                animate={activePhase === index ? { scale: 1.1 } : { scale: 1 }}
              >
                {phase.name}
              </motion.div>
              {index < commitPhases.length - 1 && (
                <motion.span
                  className="text-slate-400"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 代码示例 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 mb-2 block">
            副作用冒泡收集：
          </span>
          <Highlight
            theme={themes.nightOwl}
            code={effectListCode}
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
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 mb-2 block">
            Commit 阶段入口：
          </span>
          <Highlight
            theme={themes.nightOwl}
            code={commitCode}
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

      {/* useEffect vs useLayoutEffect */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
          whileHover={{ scale: 1.02 }}
        >
          <h5 className="font-bold text-purple-600 dark:text-purple-400 mb-2">
            useEffect
          </h5>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>
              • 在 <strong>Before Mutation</strong> 调度
            </li>
            <li>
              • <strong>异步</strong>执行，不阻塞渲染
            </li>
            <li>• 执行时机：浏览器绑制完成后</li>
            <li>• 适用：数据获取、订阅、日志</li>
          </ul>
        </motion.div>
        <motion.div
          className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          whileHover={{ scale: 1.02 }}
        >
          <h5 className="font-bold text-blue-600 dark:text-blue-400 mb-2">
            useLayoutEffect
          </h5>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>
              • 在 <strong>Layout</strong> 阶段执行
            </li>
            <li>
              • <strong>同步</strong>执行，会阻塞绘制
            </li>
            <li>• 执行时机：DOM 变更后、绘制前</li>
            <li>• 适用：测量 DOM、同步样式修改</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
