import React, { useRef, useState, useEffect } from "react";
import SideDrawer from "./SideDrawer";
import CollapsibleContainer from "./CollapsibleContainer";
import CreateRecipeModal from "./CreateRecipeModal";
import RecipeEditor from "./RecipeEditor";
import { Recipe } from "../types/recipe";
import { validateRecipe } from "../utils/validation";

interface MainProps {
  count: number;
  setCount: (count: number) => void;
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const Main: React.FC<MainProps> = ({ count, setCount }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const savedRecipes = localStorage.getItem("recipes");
    if (savedRecipes) {
      try {
        const parsedRecipes = JSON.parse(savedRecipes);
        return Array.isArray(parsedRecipes) ? parsedRecipes : [];
      } catch (error) {
        console.error("Failed to parse saved recipes:", error);
        return [];
      }
    }
    return [];
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Save recipes to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  const handleCreateRecipe = (title: string) => {
    const newRecipe: Recipe = {
      id: generateId("recipe"),
      title,
      createdAt: new Date().toISOString(),
      steps: [],
    };
    setRecipes((prev) => [...prev, newRecipe]);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // reset value to allow re-selecting the same file next time
    e.currentTarget.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        // best effort: if multiple in one file, support array; else single
        const imported: Recipe[] = Array.isArray(parsed) ? parsed : [parsed];
        const validOnes: Recipe[] = [];
        const errors: string[] = [];
        for (const r of imported) {
          // ensure id/createdAt
          const normalized: Recipe = {
            id: r.id || generateId("recipe"),
            title: r.title || "Untitled",
            createdAt: r.createdAt || new Date().toISOString(),
            steps: Array.isArray(r.steps) ? r.steps : [],
          };
          const result = validateRecipe(normalized);
          if (result.valid) {
            validOnes.push(normalized);
          } else {
            errors.push(...result.errors);
          }
        }
        if (errors.length) {
          alert("Some recipes failed to import:\n" + errors.join("\n"));
        }
        if (validOnes.length) {
          setRecipes((prev) => [...prev, ...validOnes]);
        }
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const updateRecipe = (id: string, updater: (r: Recipe) => Recipe) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? updater(r) : r)));
  };

  const handleDeleteRecipe = (id: string) => {
    const ok = window.confirm("Delete this recipe? This cannot be undone.");
    if (!ok) return;
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={toggleActions}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-left hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent outline-none flex items-center space-x-2"
              title="Recipes Actions"
            >
              <span>Recipes</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  isActionsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isActionsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsActionsOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors border-none bg-transparent outline-none"
                      onClick={() => {
                        setIsActionsOpen(false);
                        setIsCreateModalOpen(true);
                      }}
                    >
                      Create Recipe
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors border-none bg-transparent outline-none"
                      onClick={() => {
                        setIsActionsOpen(false);
                        handleImportClick();
                      }}
                    >
                      Import Recipe
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {/* hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportFile}
        />
        <button
          onClick={toggleDrawer}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors border-none bg-transparent outline-none"
          title="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Recipe Containers */}
      <div className="space-y-6">
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No recipes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click "Create Recipe" to add your first recipe
            </p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <CollapsibleContainer key={recipe.id} title={recipe.title}>
              <div className="text-gray-600 dark:text-gray-400 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Created: {new Date(recipe.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete Recipe"
                  >
                    Delete
                  </button>
                </div>
                <RecipeEditor
                  recipe={recipe}
                  onChange={(updated) => updateRecipe(recipe.id, () => updated)}
                />
              </div>
            </CollapsibleContainer>
          ))
        )}
      </div>

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRecipe={handleCreateRecipe}
      />
    </main>
  );
};

export default Main;
