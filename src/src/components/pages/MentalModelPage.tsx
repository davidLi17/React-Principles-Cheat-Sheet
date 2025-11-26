import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContentCard } from "../ui/ContentCard";
import {
  LayoutIcon,
  ZapIcon,
  RefreshCwIcon,
  CpuIcon,
  LayersIcon,
} from "../icons";

// 动画计数器组件
const AnimatedCounter: React.FC<{ end: number; suffix?: string }> = ({
  end,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {count}
      {suffix}
    </motion.span>
  );
};

// 脉冲动画点
const PulsingDot: React.FC<{ color: string; delay?: number }> = ({
  color,
  delay = 0,
}) => (
  <motion.span
    className={`inline-block w-2 h-2 rounded-full ${color}`}
    animate={{
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay: delay / 1000,
    }}
  />
);

// 流程步骤组件
const FlowStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  index: number;
}> = ({ icon, title, description, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <div
        className={`p-4 rounded-xl border-2 ${color} bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg hover:shadow-xl transition-shadow h-full`}
      >
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// 浮动粒子组件
const FloatingParticle: React.FC<{ index: number }> = ({ index }) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const randomDelay = Math.random() * 2;
  const randomDuration = 3 + Math.random() * 2;

  return (
    <motion.div
      className="absolute w-1 h-1 bg-white/30 rounded-full"
      style={{ left: `${randomX}%`, top: `${randomY}%` }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay: randomDelay,
        ease: "easeInOut",
      }}
    />
  );
};

// 进度条动画组件
const AnimatedProgressBar: React.FC<{ isBlocking: boolean }> = ({
  isBlocking,
}) => {
  if (isBlocking) {
    return (
      <motion.div
        className="flex-1 h-2 bg-red-500 rounded"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    );
  }

  return (
    <div className="flex items-center gap-1 flex-1">
      {[...Array(8)].map((_, i) => (
        <React.Fragment key={i}>
          <motion.div
            className="flex-1 h-2 bg-green-500 rounded"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
          {i < 7 && <div className="w-1 h-2 bg-slate-300 dark:bg-slate-600" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export const MentalModelPage: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);

  // 自动轮播核心概念
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const phases = [
    {
      title: "Trigger",
      subtitle: "触发更新",
      desc: "setState / props 变化",
      color: "text-yellow-500",
      bg: "bg-yellow-500/20",
      borderColor: "border-yellow-500",
    },
    {
      title: "Render",
      subtitle: "渲染阶段",
      desc: "Diff + 打标记 (可中断)",
      color: "text-blue-500",
      bg: "bg-blue-500/20",
      borderColor: "border-blue-500",
    },
    {
      title: "Commit",
      subtitle: "提交阶段",
      desc: "操作 DOM (不可中断)",
      color: "text-green-500",
      bg: "bg-green-500/20",
      borderColor: "border-green-500",
    },
  ];

  return (
    <ContentCard title="核心世界观 (Mental Model)">
      <div className="space-y-10">
        {/* Hero Section - UI = f(State) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-8 md:p-12"
        >
          {/* 背景动画粒子 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <FloatingParticle key={i} index={i} />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4"
            >
              <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
                React 核心公式
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-mono font-black mb-6"
            >
              <motion.span
                className="text-white inline-block"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                UI
              </motion.span>
              <motion.span
                className="text-blue-400 mx-2 md:mx-4 inline-block"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                =
              </motion.span>
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 inline-block"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200%" }}
                whileHover={{ scale: 1.2 }}
              >
                f
              </motion.span>
              <motion.span
                className="text-yellow-400 inline-block"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                (
              </motion.span>
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 inline-block"
                whileHover={{ scale: 1.1 }}
              >
                State
              </motion.span>
              <motion.span
                className="text-yellow-400 inline-block"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              >
                )
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            >
              界面是状态的
              <span className="text-cyan-400 font-bold">纯函数映射</span>
              。相同的 State 永远产生相同的 UI。
              <br />
              <span className="text-slate-400">
                这就是 React 的声明式编程范式 ——
                你只需要描述"是什么"，而不是"怎么做"。
              </span>
            </motion.p>

            {/* 数据统计 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-8 md:gap-16 mt-8 pt-8 border-t border-white/10"
            >
              {[
                { end: 16, suffix: "ms", label: "一帧的时间" },
                { end: 60, suffix: "fps", label: "流畅体验标准" },
                { end: 5, suffix: "ms", label: "时间切片单位" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* 核心矛盾 */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-red-500 text-lg">⚠️</span>
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                核心矛盾
              </h3>
            </div>

            <motion.div
              className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                <strong className="text-red-600 dark:text-red-400">
                  JS 引擎和 GUI 渲染线程是互斥的！
                </strong>
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <PulsingDot color="bg-red-500" />
                <span className="text-slate-500">JS 执行时，页面无法重绘</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <PulsingDot color="bg-red-500" delay={200} />
                <span className="text-slate-500">超过 16.6ms = 掉帧卡顿</span>
              </div>
            </motion.div>

            <motion.div
              className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                旧版 React 15 (Stack Reconciler)
              </h4>
              <div className="flex items-center gap-2">
                <AnimatedProgressBar isBlocking={true} />
                <span className="text-xs text-slate-500">阻塞!</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                递归更新，"一条道走到黑"，无法中断
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-green-500 text-lg">✨</span>
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                解决方案
              </h3>
            </div>

            <motion.div
              className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <ZapIcon size={18} className="text-yellow-500" />
                </motion.div>
                <span className="font-bold text-green-700 dark:text-green-400">
                  时间切片 (Time Slicing)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                把大任务拆成小块，每块约
                5ms。执行完一块后，检查是否有更高优先级的任务。
              </p>
            </motion.div>

            <motion.div
              className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                React 16+ (Fiber Reconciler)
              </h4>
              <div className="flex items-center gap-2">
                <AnimatedProgressBar isBlocking={false} />
                <span className="text-xs text-slate-500 ml-2">可中断!</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                链表结构，任务可暂停、恢复、丢弃
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* React 更新三阶段 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCwIcon size={20} className="text-blue-500" />
            </motion.div>
            React 更新三阶段
          </h3>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            {phases.map((phase, index) => (
              <React.Fragment key={phase.title}>
                <motion.div
                  className={`flex-1 p-4 rounded-xl border-2 cursor-pointer w-full ${
                    activePhase === index
                      ? `${phase.bg} ${phase.borderColor} shadow-lg`
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                  onClick={() => setActivePhase(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={
                    activePhase === index ? { scale: 1.05 } : { scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="text-center">
                    <motion.div
                      className={`text-2xl font-bold ${
                        activePhase === index ? phase.color : "text-slate-400"
                      }`}
                      animate={
                        activePhase === index
                          ? { scale: [1, 1.1, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      {phase.title}
                    </motion.div>
                    <div className="text-xs text-slate-500 mt-1">
                      {phase.subtitle}
                    </div>
                    <AnimatePresence>
                      {activePhase === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs mt-2 text-slate-700 dark:text-slate-200"
                        >
                          {phase.desc}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                {index < 2 && (
                  <motion.div
                    className="hidden md:block text-2xl text-slate-300 dark:text-slate-600"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 阶段指示器 */}
          <div className="flex justify-center gap-2 mt-4">
            {phases.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  activePhase === index
                    ? "bg-blue-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
                whileHover={{ scale: 1.5 }}
                onClick={() => setActivePhase(index)}
                animate={activePhase === index ? { scale: 1.3 } : { scale: 1 }}
              />
            ))}
          </div>
        </motion.div>

        {/* 核心理念卡片 */}
        <div className="grid md:grid-cols-3 gap-4">
          <FlowStep
            icon={<LayoutIcon size={20} className="text-blue-500" />}
            title="声明式"
            description="描述 UI 应该是什么样子，而不是如何变成那个样子。React 自动处理 DOM 操作。"
            color="border-blue-500/50"
            index={0}
          />
          <FlowStep
            icon={<CpuIcon size={20} className="text-purple-500" />}
            title="组件化"
            description="将 UI 拆分为独立、可复用的组件。每个组件管理自己的状态和逻辑。"
            color="border-purple-500/50"
            index={1}
          />
          <FlowStep
            icon={<LayersIcon size={20} className="text-green-500" />}
            title="单向数据流"
            description="数据从父组件流向子组件。状态提升和 Context 解决跨层级通信。"
            color="border-green-500/50"
            index={2}
          />
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-start gap-3"
        >
          <motion.div
            className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-xs">💡</span>
          </motion.div>
          <div>
            <h4 className="font-bold text-blue-700 dark:text-blue-300 text-sm">
              记住这个心智模型
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-200/70 mt-1">
              把 React 想象成一个"快照相机"——每次状态变化，它就拍一张新的 UI
              快照，然后高效地找出和上一张的差异，只更新变化的部分。 这就是
              Virtual DOM 和 Reconciliation 的本质。
            </p>
          </div>
        </motion.div>
      </div>
    </ContentCard>
  );
};
