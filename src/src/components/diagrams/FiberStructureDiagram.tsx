import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip } from "@nextui-org/react";

// Fiber 节点核心属性
const fiberProperties = [
  {
    name: "tag",
    desc: "组件类型标识",
    example: "FunctionComponent = 0",
    color: "blue",
  },
  {
    name: "type",
    desc: "组件函数/类/标签名",
    example: 'App / "div"',
    color: "cyan",
  },
  {
    name: "stateNode",
    desc: "真实 DOM 节点引用",
    example: "HTMLDivElement",
    color: "green",
  },
  {
    name: "return",
    desc: "父 Fiber 指针",
    example: "parentFiber",
    color: "blue",
  },
  {
    name: "child",
    desc: "第一个子 Fiber",
    example: "firstChildFiber",
    color: "green",
  },
  {
    name: "sibling",
    desc: "下一个兄弟 Fiber",
    example: "nextSiblingFiber",
    color: "purple",
  },
  {
    name: "alternate",
    desc: "对应的另一棵树节点",
    example: "workInProgress / current",
    color: "yellow",
  },
  {
    name: "flags",
    desc: "副作用标记",
    example: "Placement | Update",
    color: "red",
  },
  {
    name: "lanes",
    desc: "优先级车道",
    example: "DefaultLane",
    color: "orange",
  },
  {
    name: "memoizedState",
    desc: "Hooks 链表头",
    example: "{ memoizedState, next }",
    color: "pink",
  },
];

// 节点定义
const nodes = [
  {
    id: "parent",
    label: "App",
    type: "FunctionComponent",
    x: 150,
    y: 20,
    color: "#3b82f6",
  },
  {
    id: "child",
    label: "Header",
    type: "FunctionComponent",
    x: 30,
    y: 140,
    color: "#10b981",
  },
  {
    id: "sibling",
    label: "Main",
    type: "FunctionComponent",
    x: 250,
    y: 140,
    color: "#a855f7",
  },
];

export const FiberStructureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [highlightedPointer, setHighlightedPointer] = useState<string | null>(
    null
  );

  return (
    <div className="space-y-4">
      {/* 主图表区域 */}
      <motion.div
        className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-2 right-2 text-xs text-slate-500 font-mono">
          Fiber Node Structure
        </div>

        <svg
          width="100%"
          height="280"
          viewBox="0 0 400 240"
          className="max-w-md"
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
            </marker>
            <marker
              id="arrow-blue"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
            </marker>
            <marker
              id="arrow-green"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
            </marker>
            <marker
              id="arrow-purple"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* Parent Node */}
          <motion.g
            transform="translate(150, 40)"
            whileHover={{ scale: 1.05 }}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setSelectedNode(selectedNode === "parent" ? null : "parent")
            }
          >
            <motion.rect
              x="0"
              y="0"
              width="100"
              height="60"
              rx="8"
              fill="#1e293b"
              stroke="#3b82f6"
              strokeWidth={selectedNode === "parent" ? 3 : 2}
              animate={{
                boxShadow:
                  selectedNode === "parent"
                    ? "0 0 20px rgba(59, 130, 246, 0.5)"
                    : "none",
              }}
            />
            <text
              x="50"
              y="25"
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="14"
              fontWeight="bold"
            >
              App
            </text>
            <text
              x="50"
              y="45"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              FunctionComponent
            </text>
          </motion.g>

          {/* Child Node */}
          <motion.g
            transform="translate(50, 160)"
            whileHover={{ scale: 1.05 }}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setSelectedNode(selectedNode === "child" ? null : "child")
            }
          >
            <motion.rect
              x="0"
              y="0"
              width="100"
              height="60"
              rx="8"
              fill="#1e293b"
              stroke="#10b981"
              strokeWidth={selectedNode === "child" ? 3 : 2}
            />
            <text
              x="50"
              y="25"
              textAnchor="middle"
              fill="#6ee7b7"
              fontSize="14"
              fontWeight="bold"
            >
              Header
            </text>
            <text
              x="50"
              y="45"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              FunctionComponent
            </text>
          </motion.g>

          {/* Sibling Node */}
          <motion.g
            transform="translate(250, 160)"
            whileHover={{ scale: 1.05 }}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setSelectedNode(selectedNode === "sibling" ? null : "sibling")
            }
          >
            <motion.rect
              x="0"
              y="0"
              width="100"
              height="60"
              rx="8"
              fill="#1e293b"
              stroke="#a855f7"
              strokeWidth={selectedNode === "sibling" ? 3 : 2}
            />
            <text
              x="50"
              y="25"
              textAnchor="middle"
              fill="#d8b4fe"
              fontSize="14"
              fontWeight="bold"
            >
              Main
            </text>
            <text
              x="50"
              y="45"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              FunctionComponent
            </text>
          </motion.g>

          {/* Lines with animation */}
          {/* Parent to Child (child pointer) */}
          <motion.path
            d="M 200 100 L 100 155"
            stroke="#10b981"
            strokeWidth={highlightedPointer === "child" ? 3 : 2}
            markerEnd="url(#arrow-green)"
            strokeDasharray="5,2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onMouseEnter={() => setHighlightedPointer("child")}
            onMouseLeave={() => setHighlightedPointer(null)}
            style={{ cursor: "pointer" }}
          />
          <motion.text
            x="130"
            y="125"
            fill="#10b981"
            fontSize="11"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            child
          </motion.text>

          {/* Child to Sibling (sibling pointer) */}
          <motion.path
            d="M 155 190 L 245 190"
            stroke="#a855f7"
            strokeWidth={highlightedPointer === "sibling" ? 3 : 2}
            markerEnd="url(#arrow-purple)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onMouseEnter={() => setHighlightedPointer("sibling")}
            onMouseLeave={() => setHighlightedPointer(null)}
            style={{ cursor: "pointer" }}
          />
          <motion.text
            x="200"
            y="180"
            textAnchor="middle"
            fill="#a855f7"
            fontSize="11"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            sibling
          </motion.text>

          {/* Child to Parent (return pointer) */}
          <motion.path
            d="M 80 160 C 60 120, 140 120, 150 105"
            stroke="#3b82f6"
            strokeWidth={highlightedPointer === "return" ? 3 : 2}
            markerEnd="url(#arrow-blue)"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onMouseEnter={() => setHighlightedPointer("return")}
            onMouseLeave={() => setHighlightedPointer(null)}
            style={{ cursor: "pointer" }}
          />
          <motion.text
            x="80"
            y="130"
            fill="#3b82f6"
            fontSize="11"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            return
          </motion.text>
        </svg>

        <motion.div
          className="mt-4 text-slate-600 dark:text-slate-400 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>
            Fiber 将递归树变成了
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {" "}
              链表
            </span>
            。 点击节点查看详情。
          </p>
          <p className="text-xs opacity-70">
            任务可以随时中断，下次通过指针找回位置。
          </p>
        </motion.div>
      </motion.div>

      {/* 指针说明 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { name: "return", color: "blue", desc: "指向父节点" },
          { name: "child", color: "green", desc: "指向第一个子节点" },
          { name: "sibling", color: "purple", desc: "指向下一个兄弟" },
        ].map((pointer) => (
          <motion.div
            key={pointer.name}
            className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
              highlightedPointer === pointer.name
                ? `bg-${pointer.color}-100 dark:bg-${pointer.color}-900/30 border-2 border-${pointer.color}-500`
                : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            }`}
            onMouseEnter={() => setHighlightedPointer(pointer.name)}
            onMouseLeave={() => setHighlightedPointer(null)}
            whileHover={{ scale: 1.05 }}
          >
            <code
              className={`text-${pointer.color}-600 dark:text-${pointer.color}-400 text-sm font-bold`}
            >
              {pointer.name}
            </code>
            <p className="text-xs text-slate-500 mt-1">{pointer.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 展开/收起 Fiber 属性 */}
      <motion.button
        onClick={() => setShowProperties(!showProperties)}
        className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{showProperties ? "收起" : "展开"} Fiber 节点完整属性</span>
        <motion.span
          animate={{ rotate: showProperties ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Fiber 属性列表 */}
      <AnimatePresence>
        {showProperties && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 gap-2 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              {fiberProperties.map((prop, index) => (
                <motion.div
                  key={prop.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Chip
                      size="sm"
                      color={prop.color as any}
                      variant="flat"
                      className="font-mono text-xs"
                    >
                      {prop.name}
                    </Chip>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {prop.desc}
                  </p>
                  <code className="text-[10px] text-slate-400 block mt-1">
                    {prop.example}
                  </code>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
