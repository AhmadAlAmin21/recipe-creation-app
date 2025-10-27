import React, { useMemo, useState } from "react";
import { Recipe, Step, TakeImageStep, UnscrewingStep } from "../types/recipe";
import { validateRecipe, isNonNegativeNumber } from "../utils/validation";

interface RecipeEditorProps {
  recipe: Recipe;
  onChange: (updated: Recipe) => void;
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const RecipeEditor: React.FC<RecipeEditorProps> = ({ recipe, onChange }) => {
  const validation = useMemo(() => validateRecipe(recipe), [recipe]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Get validation errors for a specific step
  const getStepErrors = (step: Step, index: number): string[] => {
    const stepErrors: string[] = [];
    if (step.type === "takeImage") {
      if (step.imageScope === "section") {
        // Only validate if value is defined (not empty)
        if (step.centerX !== undefined && !isNonNegativeNumber(step.centerX)) {
          stepErrors.push("X coordinate must be a non-negative number");
        }
        if (step.centerY !== undefined && !isNonNegativeNumber(step.centerY)) {
          stepErrors.push("Y coordinate must be a non-negative number");
        }
      }
    } else if (step.type === "unscrewing") {
      if (step.mode === "specific") {
        // Only validate if value is defined (not empty)
        if (step.x !== undefined && !isNonNegativeNumber(step.x)) {
          stepErrors.push("X coordinate must be a non-negative number");
        }
        if (step.y !== undefined && !isNonNegativeNumber(step.y)) {
          stepErrors.push("Y coordinate must be a non-negative number");
        }
      }
    }
    return stepErrors;
  };

  const addStep = (type: Step["type"]) => {
    let newStep: Step;
    if (type === "takeImage") {
      newStep = {
        id: generateId("step"),
        type: "takeImage",
        includePointcloud: false,
        imageScope: "full",
      } as TakeImageStep;
    } else {
      newStep = {
        id: generateId("step"),
        type: "unscrewing",
        mode: "automatic",
      } as UnscrewingStep;
    }
    onChange({ ...recipe, steps: [...recipe.steps, newStep] });
  };

  const removeStep = (index: number) => {
    const next = [...recipe.steps];
    next.splice(index, 1);
    onChange({ ...recipe, steps: next });
  };

  const moveStep = (from: number, to: number) => {
    if (to < 0 || to >= recipe.steps.length) return;
    const next = [...recipe.steps];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    onChange({ ...recipe, steps: next });
  };

  const updateStep = (index: number, updated: Partial<Step>) => {
    const next = [...recipe.steps];
    next[index] = { ...next[index], ...updated } as Step;
    onChange({ ...recipe, steps: next });
  };

  const setTakeImageScope = (index: number, scope: "full" | "section") => {
    const step = recipe.steps[index] as TakeImageStep;
    const base: Partial<TakeImageStep> = { imageScope: scope };
    if (scope === "full") {
      base.centerX = undefined;
      base.centerY = undefined;
    }
    updateStep(index, base as Partial<Step>);
  };

  const setUnscrewingMode = (index: number, mode: "automatic" | "specific") => {
    const base: Partial<UnscrewingStep> = { mode };
    if (mode === "automatic") {
      base.x = undefined;
      base.y = undefined;
    }
    updateStep(index, base as Partial<Step>);
  };

  const handleDragStart =
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver =
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (dragOverIndex !== index) setDragOverIndex(index);
      e.dataTransfer.dropEffect = "move";
    };

  const handleDragLeave = (index: number) => () => {
    if (dragOverIndex === index) setDragOverIndex(null);
  };

  const handleDrop =
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const fromStr = e.dataTransfer.getData("text/plain");
      const from = dragIndex ?? (fromStr ? Number(fromStr) : null);
      if (from !== null && from !== index) {
        moveStep(from, index);
      }
      setDragIndex(null);
      setDragOverIndex(null);
    };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="typography-h5">Add Step</h3>
        <div className="flex gap-2">
          <button
            className="btn btn-outlined"
            onClick={() => addStep("takeImage")}
          >
            + Take Image
          </button>
          <button
            className="btn btn-outlined"
            onClick={() => addStep("unscrewing")}
          >
            + Unscrewing
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="typography-h5">Steps</h3>
        {recipe.steps.length === 0 ? (
          <div className="paper p-6 text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              <svg
                style={{ width: 48, height: 48 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="mb-1">No steps yet</div>
            <div className="text-gray-600 dark:text-gray-400">
              Use "Add Step" above to create one
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {recipe.steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-card p-0 transition-shadow ${
                  dragOverIndex === index ? "ring-2 ring-blue-400" : ""
                } ${dragIndex === index ? "opacity-70" : ""}`}
                onDragOver={handleDragOver(index)}
                onDragLeave={handleDragLeave(index)}
                onDrop={handleDrop(index)}
              >
                <div className="flex">
                  {/* Drag handle column - entire column is draggable */}
                  <div
                    className="step-card__handle select-none active:cursor-grabbing"
                    draggable
                    onDragStart={handleDragStart(index)}
                    onDragEnd={handleDragEnd}
                    title="Drag to reorder"
                    aria-label="Drag to reorder"
                  >
                    <div>≡</div>
                  </div>
                  {/* Main card content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xl">
                        {step.type === "takeImage"
                          ? "Take Image"
                          : "Unscrewing"}{" "}
                        Step #{index + 1}
                      </div>
                      <button
                        className="btn btn-danger-ghost"
                        onClick={() => removeStep(index)}
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>

                    {step.type === "takeImage" ? (
                      <div className="mt-4 space-y-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={(step as TakeImageStep).includePointcloud}
                            onChange={(e) =>
                              updateStep(index, {
                                includePointcloud: e.target.checked,
                              } as Partial<Step>)
                            }
                          />
                          Include Pointcloud
                        </label>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-300">
                            Scope:
                          </span>
                          <select
                            className="select"
                            value={(step as TakeImageStep).imageScope}
                            onChange={(e) =>
                              setTakeImageScope(
                                index,
                                e.target.value === "full" ? "full" : "section"
                              )
                            }
                          >
                            <option value="full">Full</option>
                            <option value="section">Section</option>
                          </select>

                          {(step as TakeImageStep).imageScope === "section" && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-300">
                                  X:
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  className="input"
                                  style={{ width: 96 }}
                                  value={(step as TakeImageStep).centerX ?? ""}
                                  onChange={(e) =>
                                    updateStep(index, {
                                      centerX:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    } as Partial<Step>)
                                  }
                                />
                                {getStepErrors(step, index).some((e) =>
                                  e.includes("X coordinate")
                                ) && (
                                  <span className="text-xs text-red-600 dark:text-red-400">
                                    {getStepErrors(step, index).find((e) =>
                                      e.includes("X coordinate")
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Y:
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  className="input"
                                  style={{ width: 96 }}
                                  value={(step as TakeImageStep).centerY ?? ""}
                                  onChange={(e) =>
                                    updateStep(index, {
                                      centerY:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    } as Partial<Step>)
                                  }
                                />
                                {getStepErrors(step, index).some((e) =>
                                  e.includes("Y coordinate")
                                ) && (
                                  <span className="text-xs text-red-600 dark:text-red-400">
                                    {getStepErrors(step, index).find((e) =>
                                      e.includes("Y coordinate")
                                    )}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-300">
                            Mode:
                          </span>
                          <select
                            className="select"
                            value={(step as UnscrewingStep).mode}
                            onChange={(e) =>
                              setUnscrewingMode(
                                index,
                                e.target.value === "automatic"
                                  ? "automatic"
                                  : "specific"
                              )
                            }
                          >
                            <option value="automatic">Automatic</option>
                            <option value="specific">Specific</option>
                          </select>

                          {(step as UnscrewingStep).mode === "specific" && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-300">
                                  X:
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  className="input"
                                  style={{ width: 96 }}
                                  value={(step as UnscrewingStep).x ?? ""}
                                  onChange={(e) =>
                                    updateStep(index, {
                                      x:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    } as Partial<Step>)
                                  }
                                />
                                {getStepErrors(step, index).some((e) =>
                                  e.includes("X coordinate")
                                ) && (
                                  <span className="text-xs text-red-600 dark:text-red-400">
                                    {getStepErrors(step, index).find((e) =>
                                      e.includes("X coordinate")
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Y:
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  className="input"
                                  style={{ width: 96 }}
                                  value={(step as UnscrewingStep).y ?? ""}
                                  onChange={(e) =>
                                    updateStep(index, {
                                      y:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    } as Partial<Step>)
                                  }
                                />
                                {getStepErrors(step, index).some((e) =>
                                  e.includes("Y coordinate")
                                ) && (
                                  <span className="text-xs text-red-600 dark:text-red-400">
                                    {getStepErrors(step, index).find((e) =>
                                      e.includes("Y coordinate")
                                    )}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeEditor;
