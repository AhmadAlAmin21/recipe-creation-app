import {
  Recipe,
  Step,
  TakeImageStep,
  UnscrewingStep,
  ValidationResult,
} from "../types/recipe";

export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function validateTakeImageStep(
  step: TakeImageStep,
  index: number
): string[] {
  const errors: string[] = [];
  if (step.imageScope !== "full" && step.imageScope !== "section") {
    errors.push(`Step ${index + 1}: Take Image - invalid image scope`);
  }
  if (step.imageScope === "section") {
    if (!isNonNegativeNumber(step.centerX)) {
      errors.push(
        `Step ${index + 1}: Take Image - centerX must be a non-negative number`
      );
    }
    if (!isNonNegativeNumber(step.centerY)) {
      errors.push(
        `Step ${index + 1}: Take Image - centerY must be a non-negative number`
      );
    }
  }
  return errors;
}

export function validateUnscrewingStep(
  step: UnscrewingStep,
  index: number
): string[] {
  const errors: string[] = [];
  if (step.mode !== "automatic" && step.mode !== "specific") {
    errors.push(`Step ${index + 1}: Unscrewing - invalid mode`);
  }
  if (step.mode === "specific") {
    if (!isNonNegativeNumber(step.x)) {
      errors.push(
        `Step ${index + 1}: Unscrewing - x must be a non-negative number`
      );
    }
    if (!isNonNegativeNumber(step.y)) {
      errors.push(
        `Step ${index + 1}: Unscrewing - y must be a non-negative number`
      );
    }
  }
  return errors;
}

export function validateStep(step: Step, index: number): string[] {
  if (step.type === "takeImage") {
    return validateTakeImageStep(step, index);
  }
  if (step.type === "unscrewing") {
    return validateUnscrewingStep(step, index);
  }
  return [`Step ${index + 1}: Unknown step type`];
}

export function validateRecipe(recipe: Recipe): ValidationResult {
  const errors: string[] = [];
  if (!recipe.title || !recipe.title.trim()) {
    errors.push("Recipe title is required");
  }
  if (!Array.isArray(recipe.steps)) {
    errors.push("Recipe steps must be an array");
  } else {
    recipe.steps.forEach((step, idx) => {
      errors.push(...validateStep(step, idx));
    });
  }
  return { valid: errors.length === 0, errors };
}
