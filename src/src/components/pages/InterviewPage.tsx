import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, Tab, Chip, Progress, Input, Tooltip } from "@nextui-org/react";
import { useLocalStorageState, useDebounceFn } from "ahooks";
import Fuse from "fuse.js";
import { ContentCard } from "../ui/ContentCard";
import { SearchIcon, RefreshCwIcon } from "../icons";
import { QuestionSection } from "./interview";
import {
  allInterviewQuestions,
  categories,
  fuseOptions,
  questionStats,
} from "../../data/interviewQuestions";

/**
 * 面试题库页面
 */
export const InterviewPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 持久化学习进度
  const [completedIds, setCompletedIds] = useLocalStorageState<string[]>(
    "react-interview-completed",
    { defaultValue: [] }
  );

  // 防抖搜索
  const { run: debouncedSearch } = useDebounceFn(
    (query: string) => setDebouncedQuery(query),
    { wait: 300 }
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Fuse.js 模糊搜索
  const fuse = useMemo(() => new Fuse(allInterviewQuestions, fuseOptions), []);

  // 过滤题目
  const filteredQuestions = useMemo(() => {
    let results = allInterviewQuestions;

    if (debouncedQuery.trim()) {
      results = fuse.search(debouncedQuery).map((r) => r.item);
    }

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
  const totalCount = questionStats.total;
  const progress = (completedCount / totalCount) * 100;

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const currentIds = prev || [];
      return currentIds.includes(id)
        ? currentIds.filter((i) => i !== id)
        : [...currentIds, id];
    });
  };

  const resetProgress = () => setCompletedIds([]);

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
            aria-label="学习进度"
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
          <QuestionSection
            level={1}
            questions={level1}
            completedIds={completedSet}
            onToggleComplete={toggleComplete}
          />
          <QuestionSection
            level={2}
            questions={level2}
            completedIds={completedSet}
            onToggleComplete={toggleComplete}
          />
          <QuestionSection
            level={3}
            questions={level3}
            completedIds={completedSet}
            onToggleComplete={toggleComplete}
          />

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
          ].map((tip) => (
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
