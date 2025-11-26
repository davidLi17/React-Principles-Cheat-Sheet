import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, Tab, Chip, Progress, Input, Tooltip } from "@nextui-org/react";
import { Highlight, themes } from "prism-react-renderer";
import { useLocalStorageState, useDebounceFn } from "ahooks";
import Fuse from "fuse.js";
import { ContentCard } from "../ui/ContentCard";
import {
  ChevronRightIcon,
  SearchIcon,
  BookOpenIcon,
  CodeIcon,
  ZapIcon,
  CheckIcon,
  RefreshCwIcon,
} from "../icons";

// 增强版面试题数据
interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  difficulty: 1 | 2 | 3;
  category: "concept" | "hooks" | "fiber" | "performance" | "concurrent";
  code?: string;
  keyPoints?: string[];
  followUp?: string;
}

const interviewQuestions: InterviewQuestion[] = [
  // ========== Level 1: 基础认知 ==========
  {
    id: "q1",
    question: "为什么不能直接修改 State？",
    answer:
      "React 的状态更新是基于不可变数据原则的。直接修改 state 对象不会触发重新渲染，因为 React 使用 Object.is 比较来检测变化。",
    difficulty: 1,
    category: "concept",
    keyPoints: [
      "dispatch/setState 是唯一触发更新的方式",
      "直接修改破坏 PureComponent/memo 的浅比较",
      "不可变数据使状态变化可追踪",
    ],
    code: `// ❌ 错误：直接修改
state.items.push(newItem);
setState(state);

// ✅ 正确：创建新引用
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));`,
  },
  {
    id: "q2",
    question: "React 生命周期 (Hooks 版) 怎么理解？",
    answer:
      "函数组件通过 useEffect 模拟传统生命周期。关键在于理解依赖数组的作用：空数组=挂载，有依赖=更新时执行，返回函数=卸载清理。",
    difficulty: 1,
    category: "hooks",
    keyPoints: [
      "Mount: useEffect(() => {}, [])",
      "Update: useEffect(() => {}, [dep])",
      "Unmount: useEffect(() => () => cleanup, [])",
    ],
    code: `useEffect(() => {
  // componentDidMount + componentDidUpdate
  console.log('组件挂载或更新');
  
  return () => {
    // componentWillUnmount
    console.log('清理副作用');
  };
}, [dependency]); // 依赖数组`,
  },
  {
    id: "q3",
    question: "什么是受控组件和非受控组件？",
    answer:
      "受控组件的值由 React state 控制，每次输入都会触发更新；非受控组件的值由 DOM 自身管理，通过 ref 获取值。",
    difficulty: 1,
    category: "concept",
    keyPoints: [
      "受控：value + onChange，完全由 React 控制",
      "非受控：defaultValue + ref，由 DOM 控制",
      "受控组件更易于实现表单验证",
    ],
    code: `// 受控组件
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />

// 非受控组件
const inputRef = useRef();
<input defaultValue="" ref={inputRef} />
// 获取值: inputRef.current.value`,
  },
  {
    id: "q4",
    question: "React 中的 Props 和 State 有什么区别？",
    answer:
      "Props 是父组件传递给子组件的只读数据，子组件不能修改；State 是组件内部管理的可变数据，只能通过 setState 修改。",
    difficulty: 1,
    category: "concept",
    keyPoints: [
      "Props: 外部传入，只读，父→子单向数据流",
      "State: 内部管理，可变，触发重新渲染",
      "Props 改变会触发子组件重新渲染",
    ],
  },

  // ========== Level 2: 进阶原理 ==========
  {
    id: "q5",
    question: "React Fiber 解决了什么痛点？",
    answer:
      "Fiber 解决了 React 15 Stack Reconciler 递归更新阻塞主线程的问题。它将渲染工作拆分成小单元，支持中断和恢复，配合时间切片实现流畅的用户体验。",
    difficulty: 2,
    category: "fiber",
    keyPoints: [
      "从同步递归 → 异步可中断",
      "链表结构支持遍历中断/恢复",
      "时间切片避免长任务阻塞",
      "优先级调度，重要更新先执行",
    ],
    code: `// Fiber 节点结构（简化）
interface Fiber {
  type: any;           // 组件类型
  child: Fiber | null; // 第一个子节点
  sibling: Fiber | null; // 下一个兄弟
  return: Fiber | null;  // 父节点
  alternate: Fiber | null; // 双缓存对应节点
  flags: number;       // 副作用标记
  lanes: number;       // 优先级
}`,
    followUp: "能说说 Fiber 的遍历顺序吗？",
  },
  {
    id: "q6",
    question: "Key 的真正作用是什么？为什么不能用 index？",
    answer:
      "Key 是 Diff 算法识别节点身份的唯一标识。它告诉 React 哪些元素是同一个，从而复用 DOM 而非销毁重建。用 index 作为 key 在列表变化时会导致错误的复用。",
    difficulty: 2,
    category: "performance",
    keyPoints: [
      "Key 是节点的「身份证」",
      "相同 key = 复用节点（移动）",
      "不同 key = 销毁重建（开销大）",
      "index 在增删时导致错位复用",
    ],
    code: `// ❌ 问题：删除第一项后，所有 key 都变了
{items.map((item, index) => (
  <Item key={index} data={item} />
))}

// ✅ 正确：使用稳定唯一标识
{items.map(item => (
  <Item key={item.id} data={item} />
))}`,
    followUp: "如果列表是纯展示且不会变化，用 index 可以吗？",
  },
  {
    id: "q7",
    question: "useCallback 和 useMemo 的区别？什么时候用？",
    answer:
      "useMemo 缓存计算结果，useCallback 缓存函数引用。主要用于优化子组件的不必要渲染（配合 memo）或避免昂贵计算的重复执行。",
    difficulty: 2,
    category: "hooks",
    keyPoints: [
      "useMemo: 缓存值，依赖变化才重新计算",
      "useCallback: 缓存函数，依赖变化才创建新函数",
      "配合 React.memo 阻止子组件无效渲染",
      "过度使用反而有性能开销",
    ],
    code: `// useMemo: 缓存计算结果
const expensiveValue = useMemo(() => {
  return heavyComputation(a, b);
}, [a, b]);

// useCallback: 缓存函数引用
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// 配合 memo 使用
const Child = memo(({ onClick }) => ...);`,
    followUp: "什么情况下不应该使用这两个 Hook？",
  },
  {
    id: "q8",
    question: "React 的 Diff 算法有哪些策略？",
    answer:
      "React Diff 采用三层策略将 O(n³) 复杂度降为 O(n)：1) 只同级比较，跨层移动视为删除+新建；2) 不同类型的元素产生不同的树；3) 通过 key 识别同一元素。",
    difficulty: 2,
    category: "fiber",
    keyPoints: [
      "Tree Diff: 只比较同一层级",
      "Component Diff: 类型不同直接替换整棵子树",
      "Element Diff: key 标识复用，减少 DOM 操作",
      "单节点 vs 多节点 Diff 逻辑不同",
    ],
    code: `// 单节点 Diff
if (key相同 && type相同) {
  复用节点，更新属性
} else {
  删除旧节点，创建新节点
}

// 多节点 Diff（两轮遍历）
// 第一轮：按顺序对比，找可复用节点
// 第二轮：处理移动、新增、删除`,
  },
  {
    id: "q9",
    question: "useEffect 和 useLayoutEffect 的区别？",
    answer:
      "useEffect 异步执行，在浏览器绑制完成后；useLayoutEffect 同步执行，在 DOM 变更后、浏览器绑制前。需要同步读取/修改 DOM 时用 useLayoutEffect。",
    difficulty: 2,
    category: "hooks",
    keyPoints: [
      "useEffect: 异步，不阻塞绑制，用于大多数副作用",
      "useLayoutEffect: 同步，阻塞绘制，用于 DOM 测量/同步更新",
      "SSR 时 useLayoutEffect 会警告",
      "useLayoutEffect 中的更新不会导致闪烁",
    ],
    code: `// useLayoutEffect 同步执行顺序
DOM 变更 → useLayoutEffect → 浏览器绑制

// useEffect 异步执行顺序
DOM 变更 → 浏览器绘制 → useEffect

// 典型场景：测量 DOM 并同步更新
useLayoutEffect(() => {
  const height = ref.current.offsetHeight;
  setSize(height); // 不会闪烁
}, []);`,
  },
  {
    id: "q10",
    question: "React.memo 和 PureComponent 有什么区别？",
    answer:
      "两者都是浅比较优化，阻止不必要的重新渲染。PureComponent 用于类组件，memo 用于函数组件。memo 还支持自定义比较函数。",
    difficulty: 2,
    category: "performance",
    keyPoints: [
      "都是浅比较 props",
      "PureComponent: 类组件专用",
      "memo: 函数组件专用，可自定义比较",
      "注意：内部 state 变化仍会触发渲染",
    ],
    code: `// PureComponent
class MyComponent extends PureComponent {
  // 自动浅比较 props 和 state
}

// memo（默认浅比较）
const MyComponent = memo(function(props) {
  return <div>{props.name}</div>;
});

// memo（自定义比较）
const MyComponent = memo(Component, (prev, next) => {
  return prev.id === next.id; // 返回 true 则不渲染
});`,
  },

  // ========== Level 3: 专家/源码 ==========
  {
    id: "q11",
    question: "简述 React 的双缓存机制",
    answer:
      "React 在内存中维护两棵 Fiber 树：Current（当前屏幕显示）和 WorkInProgress（后台构建）。更新时在 WIP 树上进行 Diff 和状态计算，完成后将 root.current 指针指向 WIP 树，实现无缝切换。",
    difficulty: 3,
    category: "fiber",
    keyPoints: [
      "Current 树: 已渲染到屏幕的 Fiber 树",
      "WorkInProgress 树: 正在构建的新树",
      "alternate 指针连接两棵树对应节点",
      "Commit 阶段切换指针完成更新",
    ],
    code: `// 双缓存切换（简化）
function commitRoot() {
  // 执行 DOM 操作...
  
  // 切换 current 指针
  root.current = finishedWork;
  
  // 此时 WIP 树变成新的 Current 树
  // 原 Current 树等待下次更新时复用为 WIP 树
}`,
    followUp: "为什么这样设计？有什么好处？",
  },
  {
    id: "q12",
    question: "为什么 Hooks 不能写在条件语句里？",
    answer:
      "Fiber 节点上的 Hooks 以单向链表形式存储在 memoizedState 上。React 完全依赖调用顺序来索引 Hook 数据。条件语句可能导致 Hooks 数量或顺序变化，使后续 Hook 读取到错误的状态。",
    difficulty: 3,
    category: "hooks",
    keyPoints: [
      "Hooks 存储为链表，按顺序读取",
      "Mount 时创建链表，Update 时按顺序遍历",
      "条件执行导致链表长度/顺序不匹配",
      "ESLint 规则 exhaustive-deps 帮助检测",
    ],
    code: `// Hooks 链表结构
fiber.memoizedState = {
  memoizedState: 'state1值',
  next: {
    memoizedState: 'state2值',
    next: {
      memoizedState: 'effect1',
      next: null
    }
  }
};

// ❌ 条件导致顺序错乱
if (condition) {
  const [a, setA] = useState(0); // 有时是第1个
}
const [b, setB] = useState(0); // 有时是第1个，有时是第2个`,
    followUp: "那 useEffect 的依赖数组为什么可以是空的？",
  },
  {
    id: "q13",
    question: "React 的优先级机制是怎样的？",
    answer:
      "React 18 使用 Lane 模型管理优先级。不同交互产生不同优先级的更新：用户输入是同步优先级，Transition 是过渡优先级。高优先级可以中断低优先级，实现响应性。",
    difficulty: 3,
    category: "concurrent",
    keyPoints: [
      "Lane 用二进制位表示优先级",
      "SyncLane: 最高，用户输入",
      "DefaultLane: 默认，普通更新",
      "TransitionLane: 可中断，非紧急更新",
      "IdleLane: 最低，空闲时执行",
    ],
    code: `// Lane 优先级（二进制位）
const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane = 0b0000000000000000000000000010000;
const TransitionLane = 0b0000000000000000000001000000000;
const IdleLane = 0b0100000000000000000000000000000;

// 优先级比较
function isHigherPriority(a, b) {
  return a < b; // 数值越小优先级越高
}`,
    followUp: "startTransition 是怎么实现的？",
  },
  {
    id: "q14",
    question: "Suspense 和懒加载的原理是什么？",
    answer:
      "Suspense 利用了 JavaScript 的 throw 机制。当组件需要等待时（如 lazy 加载、数据获取），会 throw 一个 Promise。React 捕获后显示 fallback，Promise resolve 后重新渲染。",
    difficulty: 3,
    category: "concurrent",
    keyPoints: [
      "throw Promise 触发 Suspense 边界",
      "React 捕获 Promise，显示 fallback",
      "Promise resolve 后重新尝试渲染",
      "React 18 支持服务端 Suspense",
    ],
    code: `// React.lazy 原理（简化）
function lazy(importFn) {
  let status = 'pending';
  let result;
  
  const promise = importFn().then(
    module => { status = 'fulfilled'; result = module; },
    error => { status = 'rejected'; result = error; }
  );
  
  return function LazyComponent(props) {
    if (status === 'pending') throw promise;
    if (status === 'rejected') throw result;
    return result.default(props);
  };
}`,
    followUp: "use Hook 和 Suspense 是什么关系？",
  },
  {
    id: "q15",
    question: "React 合成事件的原理和优势？",
    answer:
      "React 使用事件委托，将所有事件绑定到 Root 容器上（React 17+ 是 root，之前是 document）。合成事件抹平浏览器差异，提供一致的事件对象，并通过事件池优化性能。",
    difficulty: 3,
    category: "concept",
    keyPoints: [
      "事件委托：所有事件绑定到 root",
      "合成事件：统一的跨浏览器接口",
      "事件池：复用事件对象（React 17 移除）",
      "可通过 e.nativeEvent 访问原生事件",
    ],
    code: `// 事件委托原理（简化）
rootContainer.addEventListener('click', (nativeEvent) => {
  // 1. 找到触发的 Fiber 节点
  const targetFiber = getClosestFiber(nativeEvent.target);
  
  // 2. 创建合成事件
  const syntheticEvent = new SyntheticEvent(nativeEvent);
  
  // 3. 收集路径上所有监听器（模拟冒泡）
  const listeners = collectListeners(targetFiber, 'onClick');
  
  // 4. 执行监听器
  listeners.forEach(listener => listener(syntheticEvent));
});`,
  },
  {
    id: "q16",
    question: "useReducer 和 useState 在底层有什么区别？",
    answer:
      "几乎没有区别！useState 在底层就是用 useReducer 实现的，只是预置了一个简单的 reducer。两者共享相同的更新队列和调度机制。",
    difficulty: 3,
    category: "hooks",
    keyPoints: [
      "useState 底层调用 useReducer",
      "预置 reducer: (s, a) => typeof a === 'function' ? a(s) : a",
      "更新队列、优先级机制完全相同",
      "useReducer 更适合复杂状态逻辑",
    ],
    code: `// useState 的内部实现（简化）
function useState(initialState) {
  return useReducer(
    // 内置的 basicStateReducer
    (state, action) => {
      return typeof action === 'function' 
        ? action(state) 
        : action;
    },
    initialState
  );
}

// 所以这两种写法效果相同
setState(newValue);
setState(prev => newValue);`,
  },
];

// 分类配置
const categories = [
  { key: "all", label: "全部", icon: BookOpenIcon },
  { key: "concept", label: "核心概念", icon: BookOpenIcon },
  { key: "hooks", label: "Hooks", icon: CodeIcon },
  { key: "fiber", label: "Fiber 架构", icon: ZapIcon },
  { key: "performance", label: "性能优化", icon: ZapIcon },
  { key: "concurrent", label: "并发特性", icon: ZapIcon },
];

// Fuse.js 模糊搜索配置
const fuseOptions = {
  keys: [
    { name: "question", weight: 0.4 },
    { name: "answer", weight: 0.3 },
    { name: "keyPoints", weight: 0.2 },
    { name: "code", weight: 0.1 },
  ],
  threshold: 0.4, // 模糊匹配阈值
  includeScore: true,
  ignoreLocation: true,
};

// 增强版问答卡片组件
const EnhancedQuestionCard: React.FC<{
  q: InterviewQuestion;
  index: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
}> = ({ q, index, isCompleted, onToggleComplete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const difficultyConfig = {
    1: {
      color: "success",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-600 dark:text-green-400",
      label: "基础",
    },
    2: {
      color: "warning",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-600 dark:text-yellow-400",
      label: "进阶",
    },
    3: {
      color: "danger",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-600 dark:text-red-400",
      label: "专家",
    },
  };

  const config = difficultyConfig[q.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-xl overflow-hidden ${config.border} ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      {/* 问题标题 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-4 flex justify-between items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${config.bg}`}
      >
        <div className="flex items-start gap-3 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              isCompleted
                ? "bg-green-500 border-green-500"
                : "border-slate-300 dark:border-slate-600"
            }`}
          >
            {isCompleted && <CheckIcon size={12} className="text-white" />}
          </motion.button>
          <span
            className={`font-medium text-slate-700 dark:text-slate-200 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {q.question}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Chip size="sm" color={config.color as any} variant="flat">
            {config.label}
          </Chip>
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
            <ChevronRightIcon size={16} className="text-slate-400" />
          </motion.div>
        </div>
      </button>

      {/* 答案展开 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-slate-900 space-y-4 border-t border-slate-100 dark:border-slate-800">
              {/* 核心答案 */}
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {q.answer}
              </p>

              {/* 关键要点 */}
              {q.keyPoints && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    关键要点
                  </h5>
                  <ul className="space-y-1">
                    {q.keyPoints.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span className={`${config.text} mt-0.5`}>•</span>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 代码示例 */}
              {q.code && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    代码示例
                  </h5>
                  <Highlight
                    theme={themes.nightOwl}
                    code={q.code.trim()}
                    language="tsx"
                  >
                    {({
                      className,
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
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              )}

              {/* 追问 */}
              {q.followUp && (
                <div
                  className={`p-3 rounded-lg ${config.bg} border ${config.border}`}
                >
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    💡 可能的追问：
                  </span>
                  <p className={`text-sm mt-1 ${config.text} font-medium`}>
                    {q.followUp}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const InterviewPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 使用 ahooks 的 useLocalStorageState 持久化学习进度
  const [completedIds, setCompletedIds] = useLocalStorageState<string[]>(
    "react-interview-completed",
    { defaultValue: [] }
  );

  // 使用 ahooks 的 useDebounceFn 防抖搜索
  const { run: debouncedSearch } = useDebounceFn(
    (query: string) => {
      setDebouncedQuery(query);
    },
    { wait: 300 }
  );

  // 处理搜索输入
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // 使用 Fuse.js 进行模糊搜索
  const fuse = useMemo(() => new Fuse(interviewQuestions, fuseOptions), []);

  // 过滤题目（结合分类和模糊搜索）
  const filteredQuestions = useMemo(() => {
    let results = interviewQuestions;

    // 如果有搜索词，使用 Fuse.js 模糊搜索
    if (debouncedQuery.trim()) {
      const fuseResults = fuse.search(debouncedQuery);
      results = fuseResults.map((r) => r.item);
    }

    // 分类过滤
    if (activeCategory !== "all") {
      results = results.filter((q) => q.category === activeCategory);
    }

    return results;
  }, [activeCategory, debouncedQuery, fuse]);

  // 按难度分组
  const level1 = filteredQuestions.filter((q) => q.difficulty === 1);
  const level2 = filteredQuestions.filter((q) => q.difficulty === 2);
  const level3 = filteredQuestions.filter((q) => q.difficulty === 3);

  // 完成进度
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const completedCount = completedIds?.length || 0;
  const totalCount = interviewQuestions.length;
  const progress = (completedCount / totalCount) * 100;

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const currentIds = prev || [];
      if (currentIds.includes(id)) {
        return currentIds.filter((i) => i !== id);
      } else {
        return [...currentIds, id];
      }
    });
  };

  const resetProgress = () => {
    setCompletedIds([]);
  };

  return (
    <ContentCard title="面试题库 (Cheat Sheet)">
      <div className="space-y-6">
        {/* 进度条 */}
        <motion.div
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              学习进度 {completedCount > 0 && "(已保存)"}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {completedCount} / {totalCount} 题
              </span>
              {completedCount > 0 && (
                <Tooltip content="重置进度">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetProgress}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <RefreshCwIcon size={14} className="text-slate-400" />
                  </motion.button>
                </Tooltip>
              )}
            </div>
          </div>
          <Progress
            value={progress}
            color="primary"
            size="sm"
            className="max-w-full"
          />
          {completedCount === totalCount && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium"
            >
              🎉 恭喜！你已完成所有面试题的学习！
            </motion.p>
          )}
        </motion.div>

        {/* 搜索和分类 */}
        <div className="space-y-4">
          <Input
            placeholder="模糊搜索面试题（支持关键词、代码片段）..."
            value={searchQuery}
            onValueChange={handleSearchChange}
            startContent={<SearchIcon size={16} className="text-slate-400" />}
            endContent={
              debouncedQuery && (
                <Chip size="sm" variant="flat" color="primary">
                  {filteredQuestions.length} 条结果
                </Chip>
              )
            }
            classNames={{
              input: "text-sm",
              inputWrapper:
                "bg-slate-100 dark:bg-slate-800 border-none shadow-none",
            }}
          />

          <Tabs
            aria-label="分类"
            color="primary"
            variant="light"
            selectedKey={activeCategory}
            onSelectionChange={(key) => setActiveCategory(key as string)}
            classNames={{
              tabList: "gap-2 flex-wrap",
              tab: "px-3 h-8",
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat.key}
                title={
                  <div className="flex items-center gap-1">
                    <cat.icon size={14} />
                    <span>{cat.label}</span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>

        {/* 题目列表 */}
        <div className="space-y-8">
          {/* Level 1 */}
          {level1.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <h3 className="text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-wider">
                  Level 1: 基础认知
                </h3>
                <Chip size="sm" variant="flat" color="success">
                  {level1.length} 题
                </Chip>
              </div>
              <div className="space-y-3">
                {level1.map((q, i) => (
                  <EnhancedQuestionCard
                    key={q.id}
                    q={q}
                    index={i}
                    isCompleted={completedSet.has(q.id)}
                    onToggleComplete={() => toggleComplete(q.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Level 2 */}
          {level2.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <h3 className="text-yellow-600 dark:text-yellow-400 text-sm font-bold uppercase tracking-wider">
                  Level 2: 进阶原理
                </h3>
                <Chip size="sm" variant="flat" color="warning">
                  {level2.length} 题
                </Chip>
              </div>
              <div className="space-y-3">
                {level2.map((q, i) => (
                  <EnhancedQuestionCard
                    key={q.id}
                    q={q}
                    index={i}
                    isCompleted={completedSet.has(q.id)}
                    onToggleComplete={() => toggleComplete(q.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Level 3 */}
          {level3.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <h3 className="text-red-600 dark:text-red-400 text-sm font-bold uppercase tracking-wider">
                  Level 3: 专家/源码
                </h3>
                <Chip size="sm" variant="flat" color="danger">
                  {level3.length} 题
                </Chip>
              </div>
              <div className="space-y-3">
                {level3.map((q, i) => (
                  <EnhancedQuestionCard
                    key={q.id}
                    q={q}
                    index={i}
                    isCompleted={completedSet.has(q.id)}
                    onToggleComplete={() => toggleComplete(q.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 空状态 */}
          {filteredQuestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-400"
            >
              <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p>没有找到匹配的面试题</p>
            </motion.div>
          )}
        </div>

        {/* 学习建议 */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            {
              title: "先理解后记忆",
              desc: "不要死记硬背，理解原理才能举一反三",
              color: "blue",
            },
            {
              title: "结合代码实践",
              desc: "写 demo 验证你的理解，印象更深刻",
              color: "green",
            },
            {
              title: "模拟面试场景",
              desc: "用自己的话复述答案，训练表达能力",
              color: "purple",
            },
          ].map((tip, i) => (
            <motion.div
              key={tip.title}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg bg-${tip.color}-50 dark:bg-${tip.color}-900/20 border border-${tip.color}-200 dark:border-${tip.color}-800`}
            >
              <h4
                className={`font-bold text-${tip.color}-600 dark:text-${tip.color}-400 text-sm mb-1`}
              >
                {tip.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {tip.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ContentCard>
  );
};
