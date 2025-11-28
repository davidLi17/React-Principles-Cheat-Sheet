# InterviewPage 重构计划

## 背景

- `InterviewPage.tsx` 945 行，过大不便维护
- 需要方便扩展面试题

## 目标结构

```
src/src/data/interviewQuestions/
├── index.ts           # 统一导出
├── types.ts           # 类型定义
├── categories.ts      # 分类配置 + Fuse 选项
├── level1-basic.ts    # Level 1 基础题
├── level2-advanced.ts # Level 2 进阶题
└── level3-expert.ts   # Level 3 专家题

src/src/components/pages/interview/
├── index.ts
├── EnhancedQuestionCard.tsx
└── QuestionSection.tsx
```

## 执行步骤

- [x] 1.1 创建 types.ts
- [x] 1.2 创建 categories.ts
- [x] 1.3 创建 level1-basic.ts
- [x] 1.4 创建 level2-advanced.ts
- [x] 1.5 创建 level3-expert.ts
- [x] 1.6 创建 data/interviewQuestions/index.ts
- [x] 2.1 创建 EnhancedQuestionCard.tsx
- [x] 2.2 创建 QuestionSection.tsx
- [x] 2.3 创建 interview/index.ts
- [x] 3.1 重构 InterviewPage.tsx
- [x] 3.2 更新 data/index.ts
- [ ] 4.1 类型检查
- [ ] 4.2 启动验证
