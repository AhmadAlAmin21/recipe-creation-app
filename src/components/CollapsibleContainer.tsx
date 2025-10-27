import React, { useState } from "react";

interface CollapsibleContainerProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  onDelete?: () => void;
  onExport?: () => void;
  exportDisabled?: boolean;
}

const CollapsibleContainer: React.FC<CollapsibleContainerProps> = ({
  title,
  children,
  defaultExpanded = false,
  className = "",
  onDelete,
  onExport,
  exportDisabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="paper">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        >
          <button
            onClick={toggleExpanded}
            className="flex-1 flex items-center justify-between text-left border-none bg-transparent outline-none"
          >
            <h3 className="typography-h5">{title}</h3>
            <div className="flex items-center gap-2">
              {(onDelete || onExport) && (
                <>
                  {onExport && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExport();
                      }}
                      className="btn btn-primary"
                      disabled={exportDisabled}
                      title="Export JSON"
                    >
                      Export
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="btn btn-danger-outlined"
                      title="Delete Recipe"
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
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
            </div>
          </button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="px-6 pb-4">
            <div
              className="divider"
              style={{ marginLeft: -24, marginRight: -24 }}
            />
            <div className="pt-4">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleContainer;
