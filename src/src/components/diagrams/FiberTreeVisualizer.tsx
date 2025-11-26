import React from "react";
import { PlayIcon, RefreshCwIcon } from "../icons";
import { useFiberVisualizer } from "../../hooks/useFiberVisualizer";
import type { FiberNode } from "../../utils/fiberParser";

// 渲染单个 Fiber 节点
const FiberNodeComponent: React.FC<{
  node: FiberNode;
  depth: number;
  index: number;
  isLast: boolean;
  parentType?: string;
  nextSibling?: FiberNode | null;
}> = ({ node, depth, index, isLast, parentType, nextSibling }) => {
  const colors = [
    "border-blue-500 bg-blue-500/10",
    "border-green-500 bg-green-500/10",
    "border-purple-500 bg-purple-500/10",
    "border-yellow-500 bg-yellow-500/10",
    "border-pink-500 bg-pink-500/10",
  ];

  const color = colors[depth % colors.length];

  return (
    <div className="relative">
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
      <div className={`border-2 rounded-lg p-3 mb-2 ${color}`}>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-200">
            {node.type}
          </span>
          {node.key && (
            <span className="text-[10px] bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 px-1.5 py-0.5 rounded">
              key="{node.key}"
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
        </div>
      </div>

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
            />
          ))}
        </div>
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

  // 初始化时加载第一个示例
  React.useEffect(() => {
    loadExample(examples[0].jsx);
  }, []);

  return (
    <div className="space-y-6">
      {/* 输入区 */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 dark:text-white font-bold">输入 JSX</h3>
          <div className="flex gap-2">
            {examples.map((ex) => (
              <button
                key={ex.name}
                onClick={() => loadExample(ex.jsx)}
                className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded transition-colors"
              >
                {ex.name}
              </button>
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
          <button
            onClick={parse}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlayIcon size={14} />
            生成 Fiber 树
          </button>
          <button
            onClick={clear}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCwIcon size={14} />
            清空
          </button>
        </div>

        {parseError && (
          <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
            {parseError}
          </div>
        )}
      </div>

      {/* Fiber 树可视化 */}
      {fiberTree && (
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h3 className="text-slate-800 dark:text-white font-bold mb-4">
            Fiber 树结构
          </h3>

          <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700 overflow-auto">
            <FiberNodeComponent
              node={fiberTree}
              depth={0}
              index={0}
              isLast={true}
              parentType={undefined}
              nextSibling={null}
            />
          </div>

          {/* 图例 */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <span className="text-blue-500">↑ return</span>: 指向父节点
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-500">↓ child</span>: 指向第一个子节点
            </div>
            <div className="flex items-center gap-1">
              <span className="text-purple-500">→ sibling</span>:
              指向下一个兄弟节点
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
