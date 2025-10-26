import React, { useMemo, useState } from "react";
import { Recipe, Step, TakeImageStep, UnscrewingStep } from "../types/recipe";
import { validateRecipe } from "../utils/validation";

interface RecipeEditorProps {
  recipe: Recipe;
  onChange: (updated: Recipe) => void;
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function downloadJson(filename: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const RecipeEditor: React.FC<RecipeEditorProps> = ({ recipe, onChange }) => {
  const validation = useMemo(() => validateRecipe(recipe), [recipe]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const onExport = () => {
    downloadJson(`${recipe.title || "recipe"}.json`, recipe);
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Steps: {recipe.steps.length}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
            onClick={onExport}
            disabled={!validation.valid}
            title={
              validation.valid
                ? "Export recipe JSON"
                : "Fix validation errors to export"
            }
          >
            Export JSON
          </button>
        </div>
      </div>

      {!validation.valid && (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
          <ul className="list-disc pl-5 space-y-1">
            {validation.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => addStep("takeImage")}
        >
          + Take Image
        </button>
        <button
          className="px-3 py-1 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => addStep("unscrewing")}
        >
          + Unscrewing
        </button>
      </div>

      <div className="space-y-3">
        {recipe.steps.map((step, index) => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 bg-white dark:bg-gray-800 transition-shadow ${
              dragOverIndex === index ? "ring-2 ring-blue-400" : ""
            } ${dragIndex === index ? "opacity-70" : ""}`}
            onDragOver={handleDragOver(index)}
            onDragLeave={handleDragLeave(index)}
            onDrop={handleDrop(index)}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Step {index + 1}:{" "}
                {step.type === "takeImage" ? "Take Image" : "Unscrewing"}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="px-2 py-1 rounded border text-xs text-gray-500 dark:text-gray-400 cursor-grab active:cursor-grabbing select-none"
                  draggable
                  onDragStart={handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  title="Drag to reorder"
                  aria-label="Drag to reorder"
                >
                  ⋮⋮
                </div>
                <button
                  className="px-2 py-1 rounded border text-xs hover:bg-gray-50 disabled:opacity-40"
                  onClick={() => moveStep(index, index - 1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="px-2 py-1 rounded border text-xs hover:bg-gray-50 disabled:opacity-40"
                  onClick={() => moveStep(index, index + 1)}
                  disabled={index === recipe.steps.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  className="px-2 py-1 rounded border text-xs hover:bg-gray-50 text-red-600 border-red-300"
                  onClick={() => removeStep(index)}
                  title="Remove"
                >
                  Remove
                </button>
              </div>
            </div>

            {step.type === "takeImage" ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
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

                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`scope-${step.id}`}
                      checked={(step as TakeImageStep).imageScope === "full"}
                      onChange={() => setTakeImageScope(index, "full")}
                    />
                    Full battery image
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`scope-${step.id}`}
                      checked={(step as TakeImageStep).imageScope === "section"}
                      onChange={() => setTakeImageScope(index, "section")}
                    />
                    Section of image
                  </label>
                </div>

                {(step as TakeImageStep).imageScope === "section" && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <label className="w-24">Center X</label>
                      <input
                        type="number"
                        min={0}
                        className="flex-1 px-2 py-1 rounded border bg-gray-50 dark:bg-gray-700"
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
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <label className="w-24">Center Y</label>
                      <input
                        type="number"
                        min={0}
                        className="flex-1 px-2 py-1 rounded border bg-gray-50 dark:bg-gray-700"
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
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`mode-${step.id}`}
                      checked={(step as UnscrewingStep).mode === "automatic"}
                      onChange={() => setUnscrewingMode(index, "automatic")}
                    />
                    Automatic Unscrewing
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`mode-${step.id}`}
                      checked={(step as UnscrewingStep).mode === "specific"}
                      onChange={() => setUnscrewingMode(index, "specific")}
                    />
                    Specific Unscrewing
                  </label>
                </div>

                {(step as UnscrewingStep).mode === "specific" && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <label className="w-24">X</label>
                      <input
                        type="number"
                        min={0}
                        className="flex-1 px-2 py-1 rounded border bg-gray-50 dark:bg-gray-700"
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
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <label className="w-24">Y</label>
                      <input
                        type="number"
                        min={0}
                        className="flex-1 px-2 py-1 rounded border bg-gray-50 dark:bg-gray-700"
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
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeEditor;
