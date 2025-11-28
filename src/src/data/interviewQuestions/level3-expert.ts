import type { InterviewQuestion } from "./types";

/**
 * Level 3: 专家/源码
 * 面向高级开发者，考察 React 源码和深层原理
 */
export const level3Questions: InterviewQuestion[] = [
  {
    id: "q3-1",
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
    id: "q3-2",
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
    id: "q3-3",
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
    id: "q3-4",
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
    id: "q3-5",
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
    id: "q3-6",
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
  {
    id: "q3-7",
    question: "React 的 Reconciler 和 Renderer 是如何分离的？",
    answer:
      "React 采用分层架构：Reconciler 负责 Diff 算法和 Fiber 树构建，是平台无关的；Renderer 负责将结果渲染到具体平台（DOM、Native、Canvas 等）。这种分离使 React 可以跨平台。",
    difficulty: 3,
    category: "fiber",
    keyPoints: [
      "Reconciler: 计算变化，平台无关",
      "Renderer: 应用变化，平台相关",
      "HostConfig: Renderer 需实现的接口",
      "react-dom、react-native 是不同 Renderer",
    ],
    code: `// Reconciler 调用 Renderer 的接口（HostConfig）
const HostConfig = {
  // 创建节点
  createInstance(type, props) {
    return document.createElement(type);
  },
  // 更新节点
  commitUpdate(domElement, updatePayload) {
    // 应用属性变化
  },
  // 插入节点
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  // ... 更多接口
};

// 不同平台实现不同的 HostConfig
// react-dom: DOM 操作
// react-native: Native 桥接
// react-three-fiber: Three.js 对象`,
    followUp: "如果要写一个自定义 Renderer，需要实现哪些接口？",
  },
  {
    id: "q3-8",
    question: "useTransition 和 useDeferredValue 的实现原理？",
    answer:
      "两者都利用了 Lane 优先级机制。useTransition 将回调中的更新标记为 TransitionLane；useDeferredValue 在高优先级更新时返回旧值，低优先级时返回新值，实现延迟更新。",
    difficulty: 3,
    category: "concurrent",
    keyPoints: [
      "useTransition: 手动降低更新优先级",
      "useDeferredValue: 自动延迟值的更新",
      "都依赖 Lane 模型区分优先级",
      "高优先级更新可中断低优先级",
    ],
    code: `// useTransition 原理（简化）
function useTransition() {
  const [isPending, setPending] = useState(false);
  
  const startTransition = (callback) => {
    setPending(true);
    // 将回调中的更新标记为 Transition 优先级
    ReactCurrentBatchConfig.transition = {};
    callback();
    ReactCurrentBatchConfig.transition = null;
    setPending(false);
  };
  
  return [isPending, startTransition];
}

// useDeferredValue 原理（简化）
function useDeferredValue(value) {
  const [deferredValue, setDeferredValue] = useState(value);
  
  useEffect(() => {
    // 以 Transition 优先级更新
    startTransition(() => {
      setDeferredValue(value);
    });
  }, [value]);
  
  return deferredValue;
}`,
  },
  {
    id: "q3-9",
    question: "React Server Components (RSC) 的原理是什么？",
    answer:
      "RSC 允许组件在服务端渲染，只将序列化后的组件树（而非 HTML）发送到客户端。服务端组件可以直接访问数据库，不打包到客户端 bundle，减少传输体积。",
    difficulty: 3,
    category: "concurrent",
    keyPoints: [
      "服务端组件: 在服务器执行，不发送 JS 到客户端",
      "客户端组件: 'use client' 标记，可交互",
      "RSC Payload: 序列化的组件树，非 HTML",
      "可直接在组件中 async/await 获取数据",
    ],
    code: `// 服务端组件（默认）
async function BlogPost({ id }) {
  // 直接访问数据库，不暴露给客户端
  const post = await db.posts.findById(id);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* 客户端组件处理交互 */}
      <LikeButton postId={id} />
    </article>
  );
}

// 客户端组件
'use client';
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Like</button>;
}`,
    followUp: "RSC 和 SSR 有什么区别？",
  },
  {
    id: "q3-10",
    question: "React 的错误边界是如何工作的？为什么 Hooks 没有错误边界？",
    answer:
      "错误边界是类组件，通过 getDerivedStateFromError 和 componentDidCatch 生命周期捕获子组件渲染错误。由于 Hooks 无法实现这两个生命周期，目前只能用类组件。React 团队正在考虑 use 的错误处理方案。",
    difficulty: 3,
    category: "concept",
    keyPoints: [
      "getDerivedStateFromError: 渲染降级 UI",
      "componentDidCatch: 记录错误日志",
      "只捕获子组件渲染期间的错误",
      "不捕获事件处理、异步代码、SSR 错误",
    ],
    code: `// 错误边界类组件
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  // 发生错误时更新 state
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  // 记录错误信息
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo.componentStack);
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />;
    }
    return this.props.children;
  }
}

// 使用
<ErrorBoundary fallback={<Error />}>
  <App />
</ErrorBoundary>`,
    followUp: "如何捕获事件处理函数中的错误？",
  },
  {
    id: "q3-11",
    question: "Fiber 的遍历算法是怎样的？为什么采用这种方式？",
    answer:
      "Fiber 采用深度优先遍历，通过 child、sibling、return 三个指针实现。这种链表结构相比递归有两个优势：1) 可以中断和恢复；2) 无需维护调用栈，避免栈溢出。",
    difficulty: 3,
    category: "fiber",
    keyPoints: [
      "深度优先：先 child，再 sibling，最后 return",
      "链表结构替代递归，可中断",
      "workInProgress 指针记录当前位置",
      "时间切片：每 5ms 检查是否让出",
    ],
    code: `// Fiber 遍历算法（简化）
function workLoop() {
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber) {
  // 1. 处理当前节点（beginWork）
  const next = beginWork(fiber);
  
  if (next) {
    // 2. 有子节点，继续向下
    return next;
  }
  
  // 3. 没有子节点，完成当前节点
  let current = fiber;
  while (current) {
    completeWork(current);
    
    if (current.sibling) {
      // 4. 有兄弟节点，处理兄弟
      return current.sibling;
    }
    // 5. 没有兄弟，返回父节点
    current = current.return;
  }
  return null;
}`,
  },
  {
    id: "q3-12",
    question: "React 的更新队列（Update Queue）是如何工作的？",
    answer:
      "每个 Fiber 节点维护一个环形链表存储更新。更新时将新 Update 加入队列，渲染时遍历队列计算最终状态。环形结构便于在任意位置插入，且能快速找到链表头尾。",
    difficulty: 3,
    category: "fiber",
    keyPoints: [
      "环形链表：pending 指向最后一个 Update",
      "Update 包含 action、lane、next 等",
      "processUpdateQueue 遍历计算最终 state",
      "支持优先级跳过，低优先级更新暂存",
    ],
    code: `// 更新队列结构
const updateQueue = {
  // pending 指向最后一个 update，形成环
  pending: null, // update3 -> update1 -> update2 -> update3
  // 基础状态
  baseState: initialState,
  // 跳过的低优先级更新
  baseQueue: null,
};

// 入队（简化）
function enqueueUpdate(fiber, update) {
  const pending = fiber.updateQueue.pending;
  if (pending === null) {
    update.next = update; // 自己指向自己
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  fiber.updateQueue.pending = update;
}

// 处理队列（简化）
function processUpdateQueue(fiber, renderLanes) {
  let update = firstUpdate;
  let newState = baseState;
  
  do {
    if (isSubsetOfLanes(renderLanes, update.lane)) {
      // 优先级足够，处理这个更新
      newState = reducer(newState, update.action);
    } else {
      // 优先级不够，跳过，加入 baseQueue
    }
    update = update.next;
  } while (update !== firstUpdate);
  
  return newState;
}`,
  },
];
