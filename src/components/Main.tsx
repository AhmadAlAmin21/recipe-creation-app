import React, { useState } from "react";
import SideDrawer from "./SideDrawer";

interface MainProps {
  count: number;
  setCount: (count: number) => void;
}

const Main: React.FC<MainProps> = ({ count, setCount }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen);
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
                className={`w-5 h-5 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`}
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
                        // Handle create action
                      }}
                    >
                      Create Recipe
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors border-none bg-transparent outline-none"
                      onClick={() => {
                        setIsActionsOpen(false);
                        // Handle import action
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
      
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </main>
  );
};

export default Main;
