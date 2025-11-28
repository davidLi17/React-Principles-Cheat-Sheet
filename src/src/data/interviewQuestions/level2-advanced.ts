import type { InterviewQuestion } from "./types";

/**
 * Level 2: 进阶原理
 * 面向有一定经验的开发者，考察 React 原理和优化
 */
export const level2Questions: InterviewQuestion[] = [
  {
    id: "q2-1",
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
    id: "q2-2",
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
    id: "q2-3",
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
    id: "q2-4",
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
    id: "q2-5",
    question: "useEffect 和 useLayoutEffect 的区别？",
    answer:
      "useEffect 异步执行，在浏览器绑制完成后；useLayoutEffect 同步执行，在 DOM 变更后、浏览器绘制前。需要同步读取/修改 DOM 时用 useLayoutEffect。",
    difficulty: 2,
    category: "hooks",
    keyPoints: [
      "useEffect: 异步，不阻塞绘制，用于大多数副作用",
      "useLayoutEffect: 同步，阻塞绘制，用于 DOM 测量/同步更新",
      "SSR 时 useLayoutEffect 会警告",
      "useLayoutEffect 中的更新不会导致闪烁",
    ],
    code: `// useLayoutEffect 同步执行顺序
DOM 变更 → useLayoutEffect → 浏览器绘制

// useEffect 异步执行顺序
DOM 变更 → 浏览器绘制 → useEffect

// 典型场景：测量 DOM 并同步更新
useLayoutEffect(() => {
  const height = ref.current.offsetHeight;
  setSize(height); // 不会闪烁
}, []);`,
  },
  {
    id: "q2-6",
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
  {
    id: "q2-7",
    question: "什么是 React Context？如何避免 Context 导致的性能问题？",
    answer:
      "Context 提供了一种跨组件层级传递数据的方式，避免 props drilling。但 Context 值变化会导致所有消费者重新渲染，需要注意优化。",
    difficulty: 2,
    category: "performance",
    keyPoints: [
      "Provider 提供值，Consumer/useContext 消费",
      "值变化时所有 useContext 的组件都会渲染",
      "拆分 Context：读写分离，状态分离",
      "配合 memo + useMemo 优化",
    ],
    code: `// 拆分 Context 优化
const StateContext = createContext(null);
const DispatchContext = createContext(null);

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

// 只需要 dispatch 的组件不会因 state 变化而渲染
const dispatch = useContext(DispatchContext);`,
    followUp: "除了拆分 Context，还有什么优化方案？",
  },
  {
    id: "q2-8",
    question: "useRef 和 useState 有什么区别？useRef 有哪些用途？",
    answer:
      "useState 的更新会触发重新渲染，useRef 的更新不会。useRef 返回一个可变对象，其 .current 属性在组件生命周期内保持不变。",
    difficulty: 2,
    category: "hooks",
    keyPoints: [
      "useRef 修改不触发渲染",
      "useRef 保存值在渲染间持久化",
      "用途1: 访问 DOM 节点",
      "用途2: 保存任意可变值（如定时器 ID）",
    ],
    code: `// 访问 DOM
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();

// 保存可变值（不触发渲染）
const timerRef = useRef(null);
useEffect(() => {
  timerRef.current = setInterval(() => {...}, 1000);
  return () => clearInterval(timerRef.current);
}, []);

// 保存前一次的值
const prevValueRef = useRef();
useEffect(() => {
  prevValueRef.current = value;
});`,
  },
  {
    id: "q2-9",
    question: "React 中如何实现代码分割和懒加载？",
    answer:
      "使用 React.lazy 和 Suspense 实现组件级代码分割。lazy 接受一个动态 import，返回的组件会在首次渲染时才加载。",
    difficulty: 2,
    category: "performance",
    keyPoints: [
      "React.lazy(() => import('./Component'))",
      "必须配合 Suspense 使用",
      "可指定 fallback 加载状态",
      "路由级分割效果最好",
    ],
    code: `// 懒加载组件
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}

// 路由级分割
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

<Routes>
  <Route path="/" element={
    <Suspense fallback={<PageLoader />}>
      <Home />
    </Suspense>
  } />
</Routes>`,
    followUp: "如何处理懒加载组件的错误？",
  },
  {
    id: "q2-10",
    question: "什么是 React 的批量更新（Batching）？React 18 有什么变化？",
    answer:
      "批量更新是指 React 将多个状态更新合并为一次渲染。React 18 引入了自动批处理，在任何地方的更新都会自动批处理，而不仅仅是事件处理函数中。",
    difficulty: 2,
    category: "concurrent",
    keyPoints: [
      "React 17: 只在事件处理中批处理",
      "React 18: 所有更新自动批处理",
      "包括 setTimeout、Promise、原生事件",
      "flushSync 可退出批处理",
    ],
    code: `// React 18 自动批处理
function handleClick() {
  setCount(c => c + 1); // 不会触发渲染
  setFlag(f => !f);     // 不会触发渲染
  // React 会批量处理，只渲染一次
}

// 即使在异步代码中也会批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 18: 只渲染一次
  // React 17: 渲染两次
}, 1000);

// 退出批处理
import { flushSync } from 'react-dom';
flushSync(() => setCount(c => c + 1)); // 立即渲染
setFlag(f => !f); // 再次渲染`,
  },
];
