import React, { useState } from "react";

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecipe: (title: string) => void;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
  isOpen,
  onClose,
  onCreateRecipe,
}) => {
  const [recipeTitle, setRecipeTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeTitle.trim()) {
      onCreateRecipe(recipeTitle.trim());
      setRecipeTitle("");
      onClose();
    }
  };

  const handleClose = () => {
    setRecipeTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Create New Recipe
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors border-none bg-transparent outline-none"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                id="recipeTitle"
                value={recipeTitle}
                onChange={(e) => setRecipeTitle(e.target.value)}
                placeholder="Enter recipe title..."
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none border-none"
                autoFocus
                required
              />
            </div>

            <div className="flex justify-center pt-2 pb-8">
              <button
                type="submit"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors border-none bg-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!recipeTitle.trim()}
              >
                Create Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipeModal;
