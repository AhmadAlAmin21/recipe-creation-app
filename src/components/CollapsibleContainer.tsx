import React, { useState } from "react";

interface CollapsibleContainerProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const CollapsibleContainer: React.FC<CollapsibleContainerProps> = ({
  title,
  children,
  defaultExpanded = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
        <button
          onClick={toggleExpanded}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-none bg-transparent outline-none rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
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

        {/* Content */}
        {isExpanded && (
          <div className="px-6 pb-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleContainer;
