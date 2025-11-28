import type { InterviewQuestion } from "./types";

/**
 * Level 1: 基础认知
 * 面向初学者，考察 React 基本概念和常见用法
 */
export const level1Questions: InterviewQuestion[] = [
  {
    id: "q1-1",
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
    id: "q1-2",
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
    id: "q1-3",
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
    id: "q1-4",
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
  {
    id: "q1-5",
    question: "什么是 JSX？它和 HTML 有什么区别？",
    answer:
      "JSX 是 JavaScript 的语法扩展，看起来像 HTML 但实际是 React.createElement 的语法糖。它允许在 JavaScript 中编写类似 HTML 的代码。",
    difficulty: 1,
    category: "concept",
    keyPoints: [
      "JSX 会被 Babel 编译为 React.createElement 调用",
      "className 代替 class，htmlFor 代替 for",
      "必须有一个根元素（可用 Fragment）",
      "支持 JavaScript 表达式 {}",
    ],
    code: `// JSX
<div className="container">
  {items.map(item => <span key={item.id}>{item.name}</span>)}
</div>

// 编译后
React.createElement('div', { className: 'container' },
  items.map(item => 
    React.createElement('span', { key: item.id }, item.name)
  )
);`,
  },
  {
    id: "q1-6",
    question: "React 中如何进行条件渲染？",
    answer:
      "React 支持多种条件渲染方式：三元运算符、逻辑与（&&）、if/else 语句、以及将 JSX 赋值给变量。",
    difficulty: 1,
    category: "concept",
    keyPoints: [
      "三元运算符: condition ? <A /> : <B />",
      "逻辑与: condition && <Component />",
      "注意 && 左侧为 0 时会渲染 0",
      "复杂逻辑可提取为变量或函数",
    ],
    code: `// 三元运算符
{isLoggedIn ? <UserPanel /> : <LoginButton />}

// 逻辑与（注意 count 为 0 的情况）
{count > 0 && <Badge count={count} />}

// 提取变量
let content;
if (loading) content = <Spinner />;
else if (error) content = <Error />;
else content = <Data />;
return <div>{content}</div>;`,
  },
  {
    id: "q1-7",
    question: "什么是 React Fragment？为什么需要它？",
    answer:
      "Fragment 允许组件返回多个元素而无需添加额外的 DOM 节点。它解决了 JSX 必须有单一根元素的限制。",
    difficulty: 1,
    category: "concept",
    keyPoints: [
      "<Fragment> 或简写 <></>",
      "不会创建额外的 DOM 节点",
      "需要 key 时必须用 <Fragment key={...}>",
      "常用于列表渲染和表格结构",
    ],
    code: `// 使用 Fragment
function Columns() {
  return (
    <>
      <td>Hello</td>
      <td>World</td>
    </>
  );
}

// 带 key 的 Fragment
{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
))}`,
  },
  {
    id: "q1-8",
    question: "React 中如何处理事件？和原生事件有什么区别？",
    answer:
      "React 使用合成事件系统，事件名采用驼峰命名，传递函数而非字符串。合成事件抹平了浏览器差异，提供一致的 API。",
    difficulty: 1,
    category: "concept",
    keyPoints: [
      "驼峰命名: onClick 而非 onclick",
      '传递函数: onClick={handleClick} 而非 onClick="handleClick()"',
      "阻止默认行为需显式调用 e.preventDefault()",
      "合成事件会被池化复用（React 17 后移除）",
    ],
    code: `// React 事件处理
function Button() {
  const handleClick = (e) => {
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation(); // 阻止冒泡
    console.log('clicked');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}

// 传递参数
<button onClick={(e) => handleDelete(id, e)}>Delete</button>`,
  },
];
