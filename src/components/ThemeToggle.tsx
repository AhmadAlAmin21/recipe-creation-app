import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setTheme } from "../store/themeSlice";

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.theme.theme);

  const themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ] as const;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Theme
      </h3>
      <div className="space-y-2">
        {themes.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => dispatch(setTheme(value))}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors border-none outline-none ${
              theme === value
                ? value === "light"
                  ? "text-gray-900 bg-light-grey-200"
                  : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
