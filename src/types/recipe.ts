export type Step = TakeImageStep | UnscrewingStep;

export interface BaseStep {
  id: string;
  type: "takeImage" | "unscrewing";
}

export interface TakeImageStep extends BaseStep {
  type: "takeImage";
  includePointcloud: boolean;
  imageScope: "full" | "section";
  centerX?: number;
  centerY?: number;
}

export interface UnscrewingStep extends BaseStep {
  type: "unscrewing";
  mode: "automatic" | "specific";
  x?: number;
  y?: number;
}

export interface Recipe {
  id: string;
  title: string;
  createdAt: string;
  steps: Step[];
}

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};
