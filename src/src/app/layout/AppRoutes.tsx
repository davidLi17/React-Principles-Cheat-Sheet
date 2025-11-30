import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const MentalModelPage = React.lazy(() =>
  import("../../components/pages/MentalModelPage").then((m) => ({
    default: m.MentalModelPage,
  }))
);
const EnginePage = React.lazy(() =>
  import("../../components/pages/EnginePage").then((m) => ({
    default: m.EnginePage,
  }))
);
const PipelinePage = React.lazy(() =>
  import("../../components/pages/PipelinePage").then((m) => ({
    default: m.PipelinePage,
  }))
);
const SourceCodePage = React.lazy(() =>
  import("../../components/pages/SourceCodePage").then((m) => ({
    default: m.SourceCodePage,
  }))
);
const ApiPage = React.lazy(() =>
  import("../../components/pages/ApiPage").then((m) => ({
    default: m.ApiPage,
  }))
);
const InterviewPage = React.lazy(() =>
  import("../../components/pages/InterviewPage").then((m) => ({
    default: m.InterviewPage,
  }))
);
const LearningPathPage = React.lazy(() =>
  import("../../components/pages/LearningPathPage").then((m) => ({
    default: m.LearningPathPage,
  }))
);
const FiberVisualizerPage = React.lazy(() =>
  import("../../components/pages/FiberVisualizerPage").then((m) => ({
    default: m.FiberVisualizerPage,
  }))
);
const NotesPage = React.lazy(() =>
  import("../../components/pages/NotesPage").then((m) => ({
    default: m.NotesPage,
  }))
);

export const AppRoutes: React.FC = () => (
  <Suspense
    fallback={
      <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        页面加载中...
      </div>
    }
  >
    <Routes>
      <Route path="/" element={<MentalModelPage />} />
      <Route path="/engine" element={<EnginePage />} />
      <Route path="/pipeline" element={<PipelinePage />} />
      <Route path="/source-code" element={<SourceCodePage />} />
      <Route path="/api" element={<ApiPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/path" element={<LearningPathPage />} />
      <Route path="/fiber-visualizer" element={<FiberVisualizerPage />} />
      <Route path="/notes" element={<NotesPage currentPage={"notes"} />} />
      <Route path="*" element={<MentalModelPage />} />
    </Routes>
  </Suspense>
);

