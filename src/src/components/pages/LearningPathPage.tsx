import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  Tab,
  Chip,
  Progress,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { Highlight, themes } from "prism-react-renderer";
import { useLocalStorageState } from "ahooks";
import { ContentCard } from "../ui/ContentCard";
import {
  BookOpenIcon,
  CheckIcon,
  CodeIcon,
  ZapIcon,
  LayersIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "../icons";

// 学习阶段数据
interface LearningStage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  skills: Skill[];
  resources: Resource[];
  projects: Project[];
  timeEstimate: string;
  isCurrent?: boolean;
}

interface Skill {
  name: string;
  description: string;
  importance: "core" | "important" | "bonus";
  code?: string;
}

interface Resource {
  title: string;
  type: "doc" | "video" | "book" | "repo";
  url?: string;
}

interface Project {
  name: string;
  description: string;
  difficulty: 1 | 2 | 3;
}

const learningStages: LearningStage[] = [
  {
    id: "stage1",
    title: "阶段一：熟练工",
    subtitle: "API 层面",
    description: "能写出 Bug 少的业务代码，熟练使用 React 基础 API。",
    color: "green",
    timeEstimate: "1-2 个月",
    skills: [
      {
        name: "useState / useReducer",
        description: "状态管理基础，理解状态更新的异步特性",
        importance: "core",
        code: `// 函数式更新，避免闭包陷阱
const [count, setCount] = useState(0);

// ❌ 可能出问题
setCount(count + 1);
setCount(count + 1); // 还是 +1

// ✅ 正确
setCount(prev => prev + 1);
setCount(prev => prev + 1); // +2`,
      },
      {
        name: "useEffect 副作用",
        description: "理解依赖数组、清理函数、执行时机",
        importance: "core",
        code: `useEffect(() => {
  // 副作用逻辑
  const subscription = subscribe();
  
  return () => {
    // 清理函数
    subscription.unsubscribe();
  };
}, [dependency]); // 依赖数组`,
      },
      {
        name: "Props & 组件通信",
        description: "父子通信、状态提升、组合模式",
        importance: "core",
      },
      {
        name: "条件渲染 & 列表",
        description: "掌握 key 的正确使用",
        importance: "important",
      },
      {
        name: "表单处理",
        description: "受控组件 vs 非受控组件",
        importance: "important",
      },
      {
        name: "useRef",
        description: "DOM 引用、保存可变值",
        importance: "important",
      },
    ],
    resources: [
      { title: "React 官方文档", type: "doc", url: "https://react.dev" },
      { title: "React 入门实战", type: "video" },
      { title: "《React 学习手册》", type: "book" },
    ],
    projects: [
      { name: "Todo List", description: "增删改查、本地存储", difficulty: 1 },
      { name: "天气 App", description: "API 调用、加载状态", difficulty: 1 },
      { name: "购物车", description: "状态提升、组件通信", difficulty: 2 },
    ],
  },
  {
    id: "stage2",
    title: "阶段二：设计师",
    subtitle: "逻辑与性能",
    description: "代码优雅，复用性高，性能好。能设计组件库和状态方案。",
    color: "blue",
    timeEstimate: "2-4 个月",
    skills: [
      {
        name: "自定义 Hooks",
        description: "抽象复用逻辑，提高代码可维护性",
        importance: "core",
        code: `// 自定义 Hook 示例
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
      },
      {
        name: "React.memo / useMemo / useCallback",
        description: "性能优化三剑客，避免不必要的重渲染",
        importance: "core",
        code: `// 性能优化组合拳
const MemoChild = memo(({ onClick, data }) => {
  return <div onClick={onClick}>{data}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  
  // 缓存回调函数
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  // 缓存计算结果
  const processedData = useMemo(() => {
    return expensiveComputation(count);
  }, [count]);
  
  return <MemoChild onClick={handleClick} data={processedData} />;
}`,
      },
      {
        name: "Context 与状态管理",
        description: "Zustand / Jotai / Redux Toolkit",
        importance: "core",
      },
      {
        name: "组件设计模式",
        description: "复合组件、Render Props、HOC",
        importance: "important",
        code: `// 复合组件模式
<Tabs>
  <Tabs.Tab label="Tab 1">Content 1</Tabs.Tab>
  <Tabs.Tab label="Tab 2">Content 2</Tabs.Tab>
</Tabs>

// Render Props
<DataFetcher url="/api/data">
  {({ data, loading }) => (
    loading ? <Spinner /> : <List data={data} />
  )}
</DataFetcher>`,
      },
      {
        name: "TypeScript 集成",
        description: "类型安全的 React 开发",
        importance: "important",
      },
      {
        name: "测试",
        description: "Jest + React Testing Library",
        importance: "bonus",
      },
    ],
    resources: [
      {
        title: "React Patterns",
        type: "doc",
        url: "https://reactpatterns.com",
      },
      {
        title: "ahooks 源码",
        type: "repo",
        url: "https://github.com/alibaba/hooks",
      },
      { title: "《React 设计原理》", type: "book" },
    ],
    projects: [
      {
        name: "组件库",
        description: "Button、Modal、Form 等通用组件",
        difficulty: 2,
      },
      {
        name: "状态管理封装",
        description: "封装 useStore、useQuery",
        difficulty: 2,
      },
      {
        name: "可视化 Dashboard",
        description: "图表、实时数据、性能优化",
        difficulty: 3,
      },
    ],
  },
  {
    id: "stage3",
    title: "阶段三：架构师",
    subtitle: "源码与原理",
    description: "理解框架瓶颈，解决复杂问题。能够深入源码定位问题。",
    color: "purple",
    timeEstimate: "3-6 个月",
    isCurrent: true,
    skills: [
      {
        name: "Fiber 架构",
        description: "理解链表结构、可中断渲染的设计思想",
        importance: "core",
        code: `// Fiber 节点核心属性
interface Fiber {
  tag: WorkTag;          // 组件类型
  type: any;             // 具体类型 (div, App)
  stateNode: any;        // DOM 节点或组件实例
  
  // 链表指针
  return: Fiber | null;  // 父节点
  child: Fiber | null;   // 第一个子节点
  sibling: Fiber | null; // 兄弟节点
  
  // 双缓存
  alternate: Fiber | null;
  
  // 更新相关
  pendingProps: any;
  memoizedProps: any;
  memoizedState: any;    // Hooks 链表
  flags: Flags;          // 副作用标记
  lanes: Lanes;          // 优先级
}`,
      },
      {
        name: "双缓存机制",
        description: "Current 树与 WorkInProgress 树的交替工作",
        importance: "core",
      },
      {
        name: "Scheduler 调度器",
        description: "时间切片、优先级调度、Lane 模型",
        importance: "core",
        code: `// 优先级 Lane 模型
const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane = 0b0000000000000000000000000010000;
const TransitionLane = 0b0000000000000000000001000000000;

// 时间切片：每 5ms 检查是否需要让出
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}`,
      },
      {
        name: "Render 阶段",
        description: "beginWork、completeWork、Diff 算法",
        importance: "core",
      },
      {
        name: "Commit 阶段",
        description: "DOM 操作、Effect 执行、三个子阶段",
        importance: "important",
      },
      {
        name: "Hooks 原理",
        description: "链表存储、调用顺序依赖",
        importance: "important",
        code: `// Hooks 链表结构
fiber.memoizedState = {
  memoizedState: stateValue,  // useState 的值
  baseState: stateValue,
  queue: updateQueue,         // 更新队列
  next: {                     // 下一个 Hook
    memoizedState: effectObj, // useEffect 的 effect
    next: null
  }
};`,
      },
      {
        name: "并发特性",
        description: "useTransition、useDeferredValue、Suspense",
        importance: "important",
      },
      {
        name: "合成事件",
        description: "事件委托、事件池、冒泡机制",
        importance: "bonus",
      },
    ],
    resources: [
      {
        title: "React 源码",
        type: "repo",
        url: "https://github.com/facebook/react",
      },
      {
        title: "React 技术揭秘",
        type: "doc",
        url: "https://react.iamkasong.com",
      },
      { title: "《React 设计原理》卡颂", type: "book" },
    ],
    projects: [
      { name: "Mini React", description: "实现简易版 React", difficulty: 3 },
      {
        name: "Fiber 可视化工具",
        description: "可视化 Fiber 树结构",
        difficulty: 3,
      },
      {
        name: "性能监控 SDK",
        description: "React Profiler 集成",
        difficulty: 3,
      },
    ],
  },
];

// 技能卡片组件
const SkillCard: React.FC<{ skill: Skill; color: string; index: number }> = ({
  skill,
  color,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const importanceConfig = {
    core: { label: "核心", color: "danger" },
    important: { label: "重要", color: "warning" },
    bonus: { label: "加分", color: "default" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-lg overflow-hidden border-${color}-200 dark:border-${color}-800`}
    >
      <button
        onClick={() => skill.code && setIsExpanded(!isExpanded)}
        className={`w-full text-left p-3 flex justify-between items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
          skill.code ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
              {skill.name}
            </span>
            <Chip
              size="sm"
              color={importanceConfig[skill.importance].color as any}
              variant="flat"
            >
              {importanceConfig[skill.importance].label}
            </Chip>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {skill.description}
          </p>
        </div>
        {skill.code && (
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
            <ChevronRightIcon size={16} className="text-slate-400 mt-1" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && skill.code && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800">
              <Highlight
                theme={themes.nightOwl}
                code={skill.code.trim()}
                language="tsx"
              >
                {({ style, tokens, getLineProps, getTokenProps }) => (
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 阶段详情组件
const StageDetail: React.FC<{ stage: LearningStage }> = ({ stage }) => {
  const [activeTab, setActiveTab] = useState("skills");

  const colorClasses: Record<
    string,
    { bg: string; border: string; text: string }
  > = {
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-600 dark:text-green-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
    },
  };

  const colors = colorClasses[stage.color];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* 阶段头部 */}
      <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-bold ${colors.text}`}>
              {stage.title}
            </h3>
            {stage.isCurrent && (
              <Chip size="sm" color="secondary" variant="flat">
                当前阶段
              </Chip>
            )}
          </div>
          <Chip size="sm" variant="bordered">
            预计 {stage.timeEstimate}
          </Chip>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {stage.description}
        </p>
      </div>

      {/* 标签页 */}
      <Tabs
        aria-label="阶段详情"
        color="primary"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        classNames={{
          tabList: "gap-4",
          tab: "px-2 h-10",
        }}
      >
        <Tab
          key="skills"
          title={
            <div className="flex items-center gap-2">
              <CodeIcon size={16} />
              <span>技能点 ({stage.skills.length})</span>
            </div>
          }
        >
          <div className="mt-4 space-y-2">
            {stage.skills.map((skill, i) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                color={stage.color}
                index={i}
              />
            ))}
          </div>
        </Tab>

        <Tab
          key="resources"
          title={
            <div className="flex items-center gap-2">
              <BookOpenIcon size={16} />
              <span>学习资源</span>
            </div>
          }
        >
          <div className="mt-4 space-y-2">
            {stage.resources.map((resource, i) => {
              const typeConfig = {
                doc: { label: "文档", color: "primary" },
                video: { label: "视频", color: "success" },
                book: { label: "书籍", color: "warning" },
                repo: { label: "源码", color: "secondary" },
              };
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Chip
                      size="sm"
                      color={typeConfig[resource.type].color as any}
                      variant="flat"
                    >
                      {typeConfig[resource.type].label}
                    </Chip>
                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      {resource.title}
                    </span>
                  </div>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <ExternalLinkIcon size={16} />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Tab>

        <Tab
          key="projects"
          title={
            <div className="flex items-center gap-2">
              <LayersIcon size={16} />
              <span>实战项目</span>
            </div>
          }
        >
          <div className="mt-4 space-y-2">
            {stage.projects.map((project, i) => {
              const difficultyConfig = {
                1: { label: "简单", color: "success" },
                2: { label: "中等", color: "warning" },
                3: { label: "困难", color: "danger" },
              };
              return (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                      {project.name}
                    </span>
                    <Chip
                      size="sm"
                      color={difficultyConfig[project.difficulty].color as any}
                      variant="flat"
                    >
                      {difficultyConfig[project.difficulty].label}
                    </Chip>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {project.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Tab>
      </Tabs>
    </motion.div>
  );
};

export const LearningPathPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>("stage3");
  const [completedSkills, setCompletedSkills] = useLocalStorageState<string[]>(
    "react-learning-completed-skills",
    { defaultValue: [] }
  );

  // 计算总体进度
  const totalSkills = learningStages.reduce(
    (acc, s) => acc + s.skills.length,
    0
  );
  const completedCount = completedSkills?.length || 0;
  const overallProgress = (completedCount / totalSkills) * 100;

  return (
    <ContentCard title="学习路线 (Learning Path)">
      <div className="space-y-6">
        {/* 总体进度 */}
        <motion.div
          className="p-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              总体学习进度
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {completedCount} / {totalSkills} 技能点
            </span>
          </div>
          <Progress value={overallProgress} color="secondary" size="sm" />
        </motion.div>

        {/* 时间线 */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500"></div>

          <div className="space-y-4">
            {learningStages.map((stage, index) => {
              const isSelected = selectedStage === stage.id;
              const stageSkillIds = stage.skills.map(
                (s) => `${stage.id}-${s.name}`
              );
              const stageCompleted = stageSkillIds.filter((id) =>
                completedSkills?.includes(id)
              ).length;
              const stageProgress =
                (stageCompleted / stage.skills.length) * 100;

              const colorClasses: Record<string, string> = {
                green: "border-green-500 bg-green-500",
                blue: "border-blue-500 bg-blue-500",
                purple: "border-purple-500 bg-purple-500",
              };

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-10"
                >
                  {/* 节点 */}
                  <motion.div
                    className={`absolute left-2 top-4 w-5 h-5 rounded-full border-2 ${
                      isSelected
                        ? colorClasses[stage.color]
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    } ${stage.isCurrent ? "animate-pulse" : ""}`}
                    whileHover={{ scale: 1.2 }}
                  />

                  {/* 卡片 */}
                  <motion.button
                    onClick={() => setSelectedStage(stage.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? `border-${stage.color}-500 bg-${stage.color}-50 dark:bg-${stage.color}-900/20 shadow-lg`
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-bold ${
                            isSelected
                              ? `text-${stage.color}-600 dark:text-${stage.color}-400`
                              : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {stage.title}
                        </h3>
                        {stage.isCurrent && (
                          <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-300 dark:border-purple-500/50">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {stage.timeEstimate}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {stage.subtitle} · {stage.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={stageProgress}
                        size="sm"
                        color={
                          stage.color === "green"
                            ? "success"
                            : stage.color === "blue"
                            ? "primary"
                            : "secondary"
                        }
                        className="flex-1"
                      />
                      <span className="text-xs text-slate-400">
                        {stageCompleted}/{stage.skills.length}
                      </span>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 选中阶段详情 */}
        {selectedStage && (
          <StageDetail
            stage={learningStages.find((s) => s.id === selectedStage)!}
          />
        )}

        {/* 学习建议 */}
        <motion.div
          className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <BookOpenIcon className="text-blue-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-blue-700 dark:text-blue-300 font-bold text-sm mb-2">
                💡 学习建议
              </h4>
              <ul className="text-xs text-blue-600 dark:text-blue-200/70 leading-relaxed space-y-1">
                <li>
                  • 不要死磕每一行源码，掌握 <strong>Fiber 链表</strong>、
                  <strong>双缓存</strong>、<strong>Lane 优先级</strong>{" "}
                  这些设计思想比背代码重要
                </li>
                <li>
                  • 建议边学边画图，能把 Fiber 树、更新流程画出来，你就是 Top
                  10%
                </li>
                <li>• 每个阶段都要有实战项目，光看不练假把式</li>
                <li>• 面试时能说出"为什么这样设计"比"是什么"更加分</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 技能对照表 */}
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            {
              stage: "熟练工",
              focus: "用得对",
              interview: "API 用法、生命周期",
              color: "green",
            },
            {
              stage: "设计师",
              focus: "用得好",
              interview: "性能优化、设计模式",
              color: "blue",
            },
            {
              stage: "架构师",
              focus: "懂原理",
              interview: "源码原理、底层设计",
              color: "purple",
            },
          ].map((item) => (
            <motion.div
              key={item.stage}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg bg-${item.color}-50 dark:bg-${item.color}-900/20 border border-${item.color}-200 dark:border-${item.color}-800`}
            >
              <h4
                className={`font-bold text-${item.color}-600 dark:text-${item.color}-400 text-sm mb-2`}
              >
                {item.stage}
              </h4>
              <div className="space-y-1 text-xs">
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">核心：</span>
                  {item.focus}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">面试：</span>
                  {item.interview}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ContentCard>
  );
};
