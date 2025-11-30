export enum TabId {
  MentalModel = "mental-model",
  Engine = "engine",
  Pipeline = "pipeline",
  SourceCode = "source-code",
  Api = "api",
  Interview = "interview",
  Path = "path",
  FiberVisualizer = "fiber-visualizer",
  Notes = "notes",
}

export const routePaths: Record<TabId, string> = {
  [TabId.MentalModel]: "/",
  [TabId.Engine]: "/engine",
  [TabId.Pipeline]: "/pipeline",
  [TabId.SourceCode]: "/source-code",
  [TabId.Api]: "/api",
  [TabId.Interview]: "/interview",
  [TabId.Path]: "/path",
  [TabId.FiberVisualizer]: "/fiber-visualizer",
  [TabId.Notes]: "/notes",
};
