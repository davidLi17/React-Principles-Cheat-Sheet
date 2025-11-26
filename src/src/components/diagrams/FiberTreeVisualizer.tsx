import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Tabs, Tab, Switch } from "@nextui-org/react";
import { PlayIcon, RefreshCwIcon, ZapIcon, LayersIcon } from "../icons";
import { useFiberVisualizer } from "../../hooks/useFiberVisualizer";
import type { FiberNode } from "../../utils/fiberParser";

// Fiber 节点标记类型
type FiberFlag = "none" | "placement" | "update" | "deletion";

// 渲染单个 Fiber 节点（增强版）
const FiberNodeComponent: React.FC<{
  node: FiberNode;
  depth: number;
  index: number;
  isLast: boolean;
  parentType?: string;
  nextSibling?: FiberNode | null;
  isHighlighted?: boolean;
  flag?: FiberFlag;
  showAlternate?: boolean;
  isWIP?: boolean;
}> = ({
  node,
  depth,
  index,
  isLast,
  parentType,
  nextSibling,
  isHighlighted,
  flag = "none",
  showAlternate,
  isWIP,
}) => {
  const colors = [
    "border-blue-500 bg-blue-500/10",
    "border-green-500 bg-green-500/10",
    "border-purple-500 bg-purple-500/10",
    "border-yellow-500 bg-yellow-500/10",
    "border-pink-500 bg-pink-500/10",
  ];

  const flagColors: Record<FiberFlag, string> = {
    none: "",
    placement: "ring-2 ring-green-500 ring-offset-2",
    update: "ring-2 ring-yellow-500 ring-offset-2",
    deletion: "ring-2 ring-red-500 ring-offset-2 opacity-50",
  };

  const flagLabels: Record<FiberFlag, { text: string; color: string }> = {
    none: { text: "", color: "" },
    placement: { text: "Placement", color: "success" },
    update: { text: "Update", color: "warning" },
    deletion: { text: "Deletion", color: "danger" },
  };

  const color = colors[depth % colors.length];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 + depth * 0.1 }}
    >
      {/* 连接线 */}
      {depth > 0 && (
        <>
          <div className="absolute -left-6 top-4 w-6 h-0.5 bg-slate-300 dark:bg-slate-600" />
          {!isLast && (
            <div className="absolute -left-6 top-4 w-0.5 h-full bg-slate-300 dark:bg-slate-600" />
          )}
        </>
      )}

      {/* 节点 */}
      <motion.div
        className={`border-2 rounded-lg p-3 mb-2 ${color} ${flagColors[flag]} ${
          isHighlighted ? "shadow-lg shadow-blue-500/30" : ""
        } ${isWIP ? "border-dashed" : ""}`}
        whileHover={{ scale: 1.02 }}
        animate={isHighlighted ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-200">
            {node.type}
          </span>
          {node.key && (
            <span className="text-[10px] bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 px-1.5 py-0.5 rounded">
              key="{node.key}"
            </span>
          )}
          {flag !== "none" && (
            <Chip
              size="sm"
              color={flagLabels[flag].color as any}
              variant="flat"
            >
              {flagLabels[flag].text}
            </Chip>
          )}
          {isWIP && (
            <span className="text-[10px] bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded">
              WIP
            </span>
          )}
        </div>

        {/* Fiber 属性 - 真实的链表指针 */}
        <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5">
          {/* return 指向父节点 */}
          <div>
            return:{" "}
            {parentType ? (
              <span className="text-blue-500">↑ {parentType}</span>
            ) : (
              <span className="text-slate-400">null (FiberRoot)</span>
            )}
          </div>

          {/* child 指向第一个子节点 */}
          {node.children && node.children.length > 0 ? (
            <div>
              child:{" "}
              <span className="text-green-500">↓ {node.children[0].type}</span>
            </div>
          ) : (
            <div>
              child: <span className="text-slate-400">null</span>
            </div>
          )}

          {/* sibling 指向下一个兄弟节点 */}
          <div>
            sibling:{" "}
            {nextSibling ? (
              <span className="text-purple-500">
                → {nextSibling.type}
                {nextSibling.key ? ` [${nextSibling.key}]` : ""}
              </span>
            ) : (
              <span className="text-slate-400">null</span>
            )}
          </div>

          {/* alternate 指针 */}
          {showAlternate && (
            <div>
              alternate:{" "}
              <span className="text-orange-500">
                ⟷ {isWIP ? "current" : "workInProgress"}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* 子节点 */}
      {node.children && node.children.length > 0 && (
        <div className="ml-8 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
          {node.children.map((child, i) => (
            <FiberNodeComponent
              key={`${child.type}-${child.key || i}`}
              node={child}
              depth={depth + 1}
              index={i}
              isLast={i === (node.children?.length || 0) - 1}
              parentType={node.type}
              nextSibling={
                node.children && i < node.children.length - 1
                  ? node.children[i + 1]
                  : null
              }
              showAlternate={showAlternate}
              isWIP={isWIP}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// 双缓存演示组件
const DoubleBufferDemo: React.FC<{
  currentTree: FiberNode | null;
  wipTree: FiberNode | null;
}> = ({ currentTree, wipTree }) => {
  const [phase, setPhase] = useState<"idle" | "render" | "commit">("idle");
  const [isCommitted, setIsCommitted] = useState(false);

  const simulateUpdate = () => {
    setPhase("render");
    setIsCommitted(false);
    setTimeout(() => {
      setPhase("commit");
      setTimeout(() => {
        setIsCommitted(true);
        setPhase("idle");
      }, 1000);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* 控制区 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={simulateUpdate}
            disabled={phase !== "idle"}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              phase !== "idle"
                ? "bg-slate-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            <ZapIcon size={14} />
            模拟更新
          </motion.button>

          {/* 阶段指示器 */}
          <div className="flex items-center gap-2">
            {["idle", "render", "commit"].map((p, i) => (
              <React.Fragment key={p}>
                <motion.div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    phase === p
                      ? p === "render"
                        ? "bg-yellow-500 text-white"
                        : p === "commit"
                        ? "bg-green-500 text-white"
                        : "bg-slate-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                  animate={phase === p ? { scale: [1, 1.1, 1] } : {}}
                >
                  {p === "idle"
                    ? "空闲"
                    : p === "render"
                    ? "Render 阶段"
                    : "Commit 阶段"}
                </motion.div>
                {i < 2 && <span className="text-slate-400">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 双树展示 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Current Tree */}
        <motion.div
          className={`p-4 rounded-xl border-2 ${
            isCommitted && phase === "idle"
              ? "border-slate-400 bg-slate-100 dark:bg-slate-800/50"
              : "border-green-500 bg-green-50 dark:bg-green-900/10"
          }`}
          animate={phase === "commit" ? { opacity: [1, 0.5, 1] } : {}}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCommitted ? "bg-slate-400" : "bg-green-500"
                }`}
              ></span>
              Current Tree
            </h4>
            <Chip
              size="sm"
              color={isCommitted ? "default" : "success"}
              variant="flat"
            >
              {isCommitted ? "旧树" : "屏幕显示"}
            </Chip>
          </div>
          {currentTree ? (
            <div className="max-h-[1200px] overflow-auto">
              <FiberNodeComponent
                node={currentTree}
                depth={0}
                index={0}
                isLast={true}
                showAlternate={true}
                isWIP={false}
              />
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">暂无树结构</div>
          )}
        </motion.div>

        {/* WorkInProgress Tree */}
        <motion.div
          className={`p-4 rounded-xl border-2 ${
            phase === "render"
              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
              : isCommitted
              ? "border-green-500 bg-green-50 dark:bg-green-900/10"
              : "border-slate-400 border-dashed bg-slate-50 dark:bg-slate-800/50"
          }`}
          animate={
            phase === "render"
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(234, 179, 8, 0)",
                    "0 0 20px 5px rgba(234, 179, 8, 0.3)",
                    "0 0 0 0 rgba(234, 179, 8, 0)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 1,
            repeat: phase === "render" ? Infinity : 0,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  phase === "render"
                    ? "bg-yellow-500"
                    : isCommitted
                    ? "bg-green-500"
                    : "bg-slate-400"
                }`}
              ></span>
              WorkInProgress Tree
            </h4>
            <Chip
              size="sm"
              color={
                phase === "render"
                  ? "warning"
                  : isCommitted
                  ? "success"
                  : "default"
              }
              variant="flat"
            >
              {phase === "render"
                ? "构建中..."
                : isCommitted
                ? "新 Current"
                : "等待更新"}
            </Chip>
          </div>
          {wipTree ? (
            <div className="max-h-[1200px] overflow-auto">
              <FiberNodeComponent
                node={wipTree}
                depth={0}
                index={0}
                isLast={true}
                showAlternate={true}
                isWIP={!isCommitted}
              />
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">暂无树结构</div>
          )}
        </motion.div>
      </div>

      {/* 说明 */}
      <motion.div
        className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-slate-600 dark:text-slate-300">
          {phase === "idle" &&
            !isCommitted &&
            '💡 点击"模拟更新"查看双缓存工作流程'}
          {phase === "render" &&
            "🔄 Render 阶段：在 WorkInProgress 树上进行 Diff 计算，不影响屏幕显示"}
          {phase === "commit" &&
            "✨ Commit 阶段：切换 root.current 指针，WIP 树变成新的 Current 树"}
          {phase === "idle" &&
            isCommitted &&
            "✅ 更新完成！原 WIP 树现在是 Current 树，原 Current 树等待下次更新时复用"}
        </p>
      </motion.div>
    </div>
  );
};

// 遍历动画组件
const TraversalAnimation: React.FC<{ tree: FiberNode | null }> = ({ tree }) => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [traversalType, setTraversalType] = useState<
    "beginWork" | "completeWork"
  >("beginWork");

  // 收集所有节点路径
  const collectNodes = (node: FiberNode, path: string[] = []): string[][] => {
    const currentNodePath = [...path, node.type];
    const paths: string[][] = [currentNodePath];

    if (node.children) {
      node.children.forEach((child) => {
        paths.push(...collectNodes(child, currentNodePath));
      });
    }

    return paths;
  };

  const startTraversal = () => {
    if (!tree || isRunning) return;
    setIsRunning(true);

    const allPaths = collectNodes(tree);
    const paths =
      traversalType === "beginWork" ? allPaths : [...allPaths].reverse();

    let i = 0;
    const interval = setInterval(() => {
      if (i < paths.length) {
        setCurrentPath(paths[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentPath([]);
          setIsRunning(false);
        }, 500);
      }
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startTraversal}
          disabled={isRunning || !tree}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
            isRunning || !tree
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-500"
          }`}
        >
          <PlayIcon size={14} />
          {isRunning ? "遍历中..." : "开始遍历"}
        </motion.button>

        <div className="flex items-center gap-2">
          <Chip
            className="cursor-pointer"
            color={traversalType === "beginWork" ? "success" : "default"}
            variant={traversalType === "beginWork" ? "solid" : "bordered"}
            onClick={() => !isRunning && setTraversalType("beginWork")}
          >
            ↓ beginWork (递)
          </Chip>
          <Chip
            className="cursor-pointer"
            color={traversalType === "completeWork" ? "warning" : "default"}
            variant={traversalType === "completeWork" ? "solid" : "bordered"}
            onClick={() => !isRunning && setTraversalType("completeWork")}
          >
            ↑ completeWork (归)
          </Chip>
        </div>
      </div>

      {currentPath.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
        >
          <span className="text-xs text-slate-500">当前路径：</span>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {currentPath.map((node, i) => (
              <React.Fragment key={i}>
                <Chip size="sm" color="primary" variant="flat">
                  {node}
                </Chip>
                {i < currentPath.length - 1 && (
                  <span className="text-slate-400">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 预设示例
const examples = [
  {
    name: "简单列表",
    jsx: `<ul>
  <li key="a">Item A</li>
  <li key="b">Item B</li>
  <li key="c">Item C</li>
</ul>`,
  },
  {
    name: "嵌套组件",
    jsx: `<div>
  <header>
    <h1>Title</h1>
  </header>
  <main>
    <p>Content</p>
  </main>
</div>`,
  },
  {
    name: "表单结构",
    jsx: `<form>
  <input />
  <input />
  <button>Submit</button>
</form>`,
  },
  {
    name: "复杂嵌套",
    jsx: `<div>
  <nav>
    <a key="home">Home</a>
    <a key="about">About</a>
  </nav>
  <article>
    <h1>Title</h1>
    <section>
      <p>Paragraph 1</p>
      <p>Paragraph 2</p>
    </section>
  </article>
  <footer>
    <span>Copyright</span>
  </footer>
</div>`,
  },
];

export const FiberTreeVisualizer: React.FC = () => {
  const {
    jsxInput,
    setInput,
    fiberTree,
    parseError,
    parse,
    loadExample,
    clear,
  } = useFiberVisualizer({
    initialJSX: examples[0].jsx,
  });

  const [activeTab, setActiveTab] = useState("tree");
  const [showAlternate, setShowAlternate] = useState(false);

  // 初始化时加载第一个示例
  useEffect(() => {
    loadExample(examples[0].jsx);
  }, []);

  return (
    <div className="space-y-6">
      {/* 输入区 */}
      <motion.div
        className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 dark:text-white font-bold flex items-center gap-2">
            <LayersIcon size={18} className="text-blue-500" />
            输入 JSX
          </h3>
          <div className="flex gap-2 flex-wrap">
            {examples.map((ex) => (
              <motion.button
                key={ex.name}
                onClick={() => loadExample(ex.jsx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded transition-colors"
              >
                {ex.name}
              </motion.button>
            ))}
          </div>
        </div>

        <textarea
          value={jsxInput}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-3 font-mono text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入 JSX 代码..."
        />

        <div className="flex gap-2 mt-3">
          <motion.button
            onClick={parse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlayIcon size={14} />
            生成 Fiber 树
          </motion.button>
          <motion.button
            onClick={clear}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCwIcon size={14} />
            清空
          </motion.button>
        </div>

        {parseError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm"
          >
            {parseError}
          </motion.div>
        )}
      </motion.div>

      {/* Fiber 树可视化 - 使用 Tabs */}
      {fiberTree && (
        <motion.div
          className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs
            aria-label="Fiber 可视化选项"
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
            {/* Tab 1: 树结构 */}
            <Tab
              key="tree"
              title={
                <div className="flex items-center gap-2">
                  <LayersIcon size={16} />
                  <span>树结构</span>
                </div>
              }
            >
              <div className="mt-4 space-y-4">
                {/* 选项 */}
                <div className="flex items-center gap-4">
                  <Switch
                    size="sm"
                    isSelected={showAlternate}
                    onValueChange={setShowAlternate}
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      显示 alternate 指针
                    </span>
                  </Switch>
                </div>

                <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700 overflow-auto max-h-[1200px]">
                  <FiberNodeComponent
                    node={fiberTree}
                    depth={0}
                    index={0}
                    isLast={true}
                    parentType={undefined}
                    nextSibling={null}
                    showAlternate={showAlternate}
                  />
                </div>

                {/* 图例 */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-500">↑ return</span>: 指向父节点
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">↓ child</span>:
                    指向第一个子节点
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-500">→ sibling</span>:
                    指向下一个兄弟节点
                  </div>
                  {showAlternate && (
                    <div className="flex items-center gap-1">
                      <span className="text-orange-500">⟷ alternate</span>:
                      指向另一棵树的对应节点
                    </div>
                  )}
                </div>
              </div>
            </Tab>

            {/* Tab 2: 遍历动画 */}
            <Tab
              key="traversal"
              title={
                <div className="flex items-center gap-2">
                  <PlayIcon size={16} />
                  <span>遍历动画</span>
                </div>
              }
            >
              <div className="mt-4 space-y-4">
                <TraversalAnimation tree={fiberTree} />

                <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700 overflow-auto max-h-[1200px]">
                  <FiberNodeComponent
                    node={fiberTree}
                    depth={0}
                    index={0}
                    isLast={true}
                    parentType={undefined}
                    nextSibling={null}
                  />
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    <strong>遍历顺序说明：</strong>
                  </p>
                  <ul className="mt-1 space-y-1">
                    <li>
                      •{" "}
                      <strong className="text-green-500">beginWork (递)</strong>
                      ：从根节点开始，沿 child 指针向下
                    </li>
                    <li>
                      •{" "}
                      <strong className="text-yellow-500">
                        completeWork (归)
                      </strong>
                      ：从叶子节点开始，沿 return 指针向上
                    </li>
                  </ul>
                </div>
              </div>
            </Tab>

            {/* Tab 3: 双缓存演示 */}
            <Tab
              key="double-buffer"
              title={
                <div className="flex items-center gap-2">
                  <RefreshCwIcon size={16} />
                  <span>双缓存</span>
                </div>
              }
            >
              <div className="mt-4">
                <DoubleBufferDemo currentTree={fiberTree} wipTree={fiberTree} />
              </div>
            </Tab>
          </Tabs>
        </motion.div>
      )}

      {/* 底部说明 */}
      <motion.div
        className="grid md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          {
            title: "Fiber 节点",
            desc: "每个 React 元素对应一个 Fiber 节点，包含 type、props、state 等信息",
            color: "blue",
          },
          {
            title: "链表结构",
            desc: "通过 child、sibling、return 三个指针形成链表，支持中断和恢复",
            color: "green",
          },
          {
            title: "双缓存",
            desc: "Current 和 WorkInProgress 两棵树交替使用，实现无闪烁更新",
            color: "purple",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            className={`p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 border border-${item.color}-200 dark:border-${item.color}-800 rounded-lg`}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <h4
              className={`font-bold text-${item.color}-600 dark:text-${item.color}-400 mb-1 text-sm`}
            >
              {item.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
