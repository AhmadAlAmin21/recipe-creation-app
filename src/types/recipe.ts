export type Step = TakeImageStep | UnscrewingStep;

export interface BaseStep {
  id: string;
  type: "takeImage" | "unscrewing";
}

export interface TakeImageStep extends BaseStep {
  type: "takeImage";
  includePointcloud: boolean;
  imageScope: "full" | "section";
  centerX?: number; // required when imageScope === "section"
  centerY?: number; // required when imageScope === "section"
}

export interface UnscrewingStep extends BaseStep {
  type: "unscrewing";
  mode: "automatic" | "specific";
  x?: number; // required when mode === "specific"
  y?: number; // required when mode === "specific"
}

export interface Recipe {
  id: string;
  title: string;
  createdAt: string; // ISO string for easy JSON export/import
  steps: Step[];
}

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};
