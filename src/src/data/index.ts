// 从拆分后的模块导入面试题数据
import { allInterviewQuestions } from "./interviewQuestions";

export {
  allInterviewQuestions,
  type InterviewQuestion,
  type InterviewCategory,
  type DifficultyLevel,
} from "./interviewQuestions";

export interface SearchItem {
  id: string;
  title: string;
  content: string;
  type: "concept" | "interview" | "page";
  page?: string;
}

// 源码流程步骤数据
export interface SourceCodeStep {
  name: string;
  file: string;
  path: string;
  desc: string;
  detail: string;
  code: string;
  phase: "trigger" | "render" | "commit";
  keyPoints: string[];
  githubUrl: string;
}

export const sourceCodeSteps: SourceCodeStep[] = [
  {
    name: "dispatchSetState",
    file: "ReactFiberHooks.js",
    path: "packages/react-reconciler/src/ReactFiberHooks.js",
    desc: "调用 setState，创建 Update 对象",
    detail:
      "当你调用 setState 时，React 会创建一个 Update 对象，包含新的状态值和优先级信息。这个 Update 会被添加到 Fiber 节点的更新队列中。",
    code: `function dispatchSetState(fiber, queue, action) {
  // 1. 获取更新优先级
  const lane = requestUpdateLane(fiber);
  
  // 2. 创建 Update 对象
  const update = {
    lane,
    action,      // 新的 state 或 updater 函数
    hasEagerState: false,
    eagerState: null,
    next: null,
  };
  
  // 3. 将 update 加入队列
  enqueueUpdate(fiber, queue, update, lane);
  
  // 4. 调度更新
  scheduleUpdateOnFiber(fiber, lane);
}`,
    phase: "trigger",
    keyPoints: [
      "创建 Update 对象，包含 lane (优先级) 和 action (新状态)",
      "Update 对象形成环形链表",
      "触发 scheduleUpdateOnFiber 开始调度",
    ],
    githubUrl:
      "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L2500",
  },
  {
    name: "scheduleUpdateOnFiber",
    file: "ReactFiberWorkLoop.js",
    path: "packages/react-reconciler/src/ReactFiberWorkLoop.js",
    desc: "标记 Fiber 节点需要更新，计算优先级",
    detail:
      "这个函数负责将更新标记从触发更新的 Fiber 节点一路向上冒泡到 Root，同时合并优先级。这确保了 React 知道哪些子树需要更新。",
    code: `function scheduleUpdateOnFiber(fiber, lane) {
  // 1. 从当前 fiber 向上遍历到 root
  // 同时将 lane 合并到路径上每个 fiber 的 lanes
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  
  // 2. 标记 root 有待处理的更新
  markRootUpdated(root, lane);
  
  // 3. 确保 root 被调度
  ensureRootIsScheduled(root);
}`,
    phase: "trigger",
    keyPoints: [
      "从 Fiber 向上遍历到 FiberRoot",
      "沿途合并 lane 到每个 Fiber 的 childLanes",
      "通知调度器有新任务",
    ],
    githubUrl:
      "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js#L500",
  },
  {
    name: "ensureRootIsScheduled",
    file: "ReactFiberRootScheduler.js",
    path: "packages/react-reconciler/src/ReactFiberRootScheduler.js",
    desc: "调度器介入，决定同步/异步执行",
    detail:
      "调度器根据更新的优先级决定是同步执行还是异步执行。高优先级（如用户输入）会同步执行，低优先级（如数据请求）会异步执行以避免阻塞。",
    code: `function ensureRootIsScheduled(root) {
  // 获取下一个要处理的 lane
  const nextLanes = getNextLanes(root);
  
  if (nextLanes === NoLanes) {
    return; // 没有待处理的更新
  }
  
  // 根据优先级决定调度方式
  const priority = getHighestPriorityLane(nextLanes);
  
  if (priority === SyncLane) {
    // 同步优先级，立即执行
    scheduleSyncCallback(performSyncWorkOnRoot);
  } else {
    // 异步优先级，通过 Scheduler 调度
    scheduleCallback(priority, performConcurrentWorkOnRoot);
  }
}`,
    phase: "trigger",
    keyPoints: [
      "分析待处理的 lanes，找出最高优先级",
      "SyncLane 立即同步执行",
      "其他优先级通过 Scheduler 异步调度",
    ],
    githubUrl:
      "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberRootScheduler.js",
  },
  {
    name: "performUnitOfWork",
    file: "ReactFiberWorkLoop.js",
    path: "packages/react-reconciler/src/ReactFiberWorkLoop.js",
    desc: "循环执行 Fiber 单元，可中断点",
    detail:
      "这是 Fiber 架构的核心循环。它不断从 workInProgress 链表中取出 Fiber 节点处理，每处理完一个节点就检查是否需要让出控制权给浏览器。",
    code: `function workLoopConcurrent() {
  // 持续工作直到没有更多任务或需要让出
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  
  // "递"阶段：处理当前节点，返回子节点
  const next = beginWork(current, unitOfWork, lanes);
  
  if (next === null) {
    // 没有子节点，进入"归"阶段
    completeUnitOfWork(unitOfWork);
  } else {
    // 继续处理子节点
    workInProgress = next;
  }
}`,
    phase: "render",
    keyPoints: [
      "shouldYield() 是时间切片的关键，约 5ms 检查一次",
      "workInProgress 指向当前处理的 Fiber",
      '先"递"(beginWork) 再"归"(completeWork)',
    ],
    githubUrl:
      "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js#L1800",
  },
  {
    name: "beginWork",
    file: "ReactFiberBeginWork.js",
    path: "packages/react-reconciler/src/ReactFiberBeginWork.js",
    desc: "递阶段：执行组件函数，创建子 Fiber",
    detail:
      "beginWork 根据 Fiber 的 tag 类型执行不同的逻辑：函数组件会执行组件函数，类组件会调用 render 方法，然后通过 reconcileChildren 进行 Diff 算法。",
    code: `function beginWork(current, workInProgress, lanes) {
  switch (workInProgress.tag) {
    case FunctionComponent: {
      // 执行函数组件
      const children = renderWithHooks(
        current,
        workInProgress,
        Component,
        props
      );
      // Diff 算法，生成子 Fiber
      reconcileChildren(current, workInProgress, children);
      return workInProgress.child;
    }
    case ClassComponent: {
      // 执行 render 方法
      const instance = workInProgress.stateNode;
      const children = instance.render();
      reconcileChildren(current, workInProgress, children);
      return workInProgress.child;
    }
    case HostComponent: {
      // 原生 DOM 组件
      reconcileChildren(current, workInProgress, nextChildren);
      return workInProgress.child;
    }
    // ... 其他类型
  }
}`,
    phase: "render",
    keyPoints: [
      "根据 tag 类型分发处理逻辑",
      "函数组件通过 renderWithHooks 执行（Hooks 在此处理）",
      "reconcileChildren 执行 Diff 算法",
    ],
    githubUrl:
      "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L3800",
  },
  {
    name: "completeWork",
    file: "ReactFiberCompleteWork.js",
    path: "packages/react-reconciler/src/ReactFiberCompleteWork.js",
    desc: "归阶段：创建/更新 DOM 节点，收集 Flags",
    detail:
      "completeWork 负责创建真实 DOM 节点（首次渲染）或标记需要更新的属性（更新渲染）。同时将子树的 flags 冒泡到父节点，形成 effectList。",
    code: `function completeWork(current, workInProgress) {
  switch (workInProgress.tag) {
    case HostComponent: {
      const type = workInProgress.type; // 如 'div'
      
      if (current === null) {
        // Mount: 创建 DOM 节点
        const instance = createInstance(type, props);
        // 将子 DOM 插入
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
      } else {
        // Update: 对比 props，标记更新
        const updatePayload = diffProperties(
          oldProps,
          newProps
        );
        if (updatePayload) {
          workInProgress.flags |= Update;
        }
      }
      
      // 冒泡 flags
      bubbleProperties(workInProgress);
      return null;
    }
  }
}`,
    phase: "render",
    keyPoints: [
      "Mount 时创建 DOM 节点，Update 时标记变化",
      "bubbleProperties 收集子树的 flags",
      "stateNode 指向真实 DOM 节点",
    ],
    githubUrl:
      "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js#L900",
  },
  {
    name: "commitRoot",
    file: "ReactFiberCommitWork.js",
    path: "packages/react-reconciler/src/ReactFiberCommitWork.js",
    desc: "提交阶段：操作真实 DOM，执行 Effects",
    detail:
      "提交阶段是同步的、不可中断的。它分为三个子阶段：BeforeMutation（DOM 操作前）、Mutation（执行 DOM 操作）、Layout（DOM 操作后）。",
    code: `function commitRoot(root) {
  const finishedWork = root.finishedWork;
  
  // ===== Before Mutation 阶段 =====
  // 调用 getSnapshotBeforeUpdate
  commitBeforeMutationEffects(root, finishedWork);
  
  // ===== Mutation 阶段 =====
  // 执行 DOM 增删改操作
  commitMutationEffects(root, finishedWork);
  
  // 切换 current 指针（双缓存关键步骤）
  root.current = finishedWork;
  
  // ===== Layout 阶段 =====
  // 调用 useLayoutEffect, componentDidMount/Update
  commitLayoutEffects(finishedWork, root);
  
  // 异步调度 useEffect
  scheduleCallback(NormalPriority, () => {
    flushPassiveEffects();
  });
}`,
    phase: "commit",
    keyPoints: [
      "三个子阶段：BeforeMutation → Mutation → Layout",
      "root.current = finishedWork 完成双缓存切换",
      "useEffect 异步执行，useLayoutEffect 同步执行",
    ],
    githubUrl:
      "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js#L2000",
  },
];

// 搜索数据
export const searchableItems: SearchItem[] = [
  // 概念
  {
    id: "c1",
    title: "UI = f(State)",
    content: "界面只是数据的投影。永远不要手动操作 DOM，只需要改变 State。",
    type: "concept",
    page: "mental-model",
  },
  {
    id: "c2",
    title: "时间切片",
    content:
      "将大任务拆解，处理一会，停下来歇一会（让出主线程给浏览器绘制），再接着处理。",
    type: "concept",
    page: "mental-model",
  },
  {
    id: "c3",
    title: "Fiber 架构",
    content:
      "Fiber 既是一种数据结构（链表节点），也是一种执行单元。实现可中断的渲染。",
    type: "concept",
    page: "engine",
  },
  {
    id: "c4",
    title: "双缓存机制",
    content: "React 在内存中同时维护 Current 和 WorkInProgress 两棵树。",
    type: "concept",
    page: "engine",
  },
  {
    id: "c5",
    title: "Scheduler 调度器",
    content: "React 自己实现的交通指挥官，管理任务优先级。",
    type: "concept",
    page: "pipeline",
  },
  {
    id: "c6",
    title: "Diff 策略",
    content: "同级比较、类型比较、Key 识别，达到 O(n) 复杂度。",
    type: "concept",
    page: "pipeline",
  },
  {
    id: "c7",
    title: "Hooks 原理",
    content: "Hooks 在底层是 Fiber 节点上的单向链表 (memoizedState)。",
    type: "concept",
    page: "api",
  },
  {
    id: "c8",
    title: "合成事件",
    content: "React 利用事件委托绑定在 Root 容器上，抹平浏览器差异。",
    type: "concept",
    page: "api",
  },
  {
    id: "c9",
    title: "useTransition",
    content: "将更新标记为非紧急，允许被中断。",
    type: "concept",
    page: "api",
  },
  {
    id: "c10",
    title: "useDeferredValue",
    content: "创建数据的延迟副本，实现 UI 的智能防抖。",
    type: "concept",
    page: "api",
  },

  ...allInterviewQuestions.map((q) => ({
    id: q.id,
    title: q.question,
    content: q.answer,
    type: "interview" as const,
    page: "interview",
  })),

  // 页面
  {
    id: "p1",
    title: "核心世界观",
    content: "Mental Model, UI = f(State), 时间切片",
    type: "page",
    page: "mental-model",
  },
  {
    id: "p2",
    title: "引擎室",
    content: "Fiber 架构, 双缓存机制, 底层架构",
    type: "page",
    page: "engine",
  },
  {
    id: "p3",
    title: "渲染流水线",
    content: "Render Phase, Commit Phase, Scheduler",
    type: "page",
    page: "pipeline",
  },
  {
    id: "p4",
    title: "源码调用链",
    content: "setState, dispatchSetState, beginWork, commitRoot",
    type: "page",
    page: "source-code",
  },
  {
    id: "p5",
    title: "API 原理",
    content: "Hooks, 合成事件, 并发特性",
    type: "page",
    page: "api",
  },
  {
    id: "p6",
    title: "面试作弊表",
    content: "面试题库, 问答",
    type: "page",
    page: "interview",
  },
  {
    id: "p7",
    title: "学习路线",
    content: "熟练工, 设计师, 架构师",
    type: "page",
    page: "path",
  },
];

// 页面标签映射
export const pageLabels: Record<string, string> = {
  "mental-model": "核心世界观",
  engine: "引擎室",
  pipeline: "渲染流水线",
  "source-code": "源码调用链",
  api: "API 原理",
  interview: "面试作弊表",
  path: "学习路线",
  "fiber-visualizer": "Fiber 可视化",
  notes: "我的笔记",
};
