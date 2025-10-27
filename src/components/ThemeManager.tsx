import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setActualTheme } from "../store/themeSlice";

const ThemeManager: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.theme.theme);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () =>
        dispatch(setActualTheme(mediaQuery.matches ? "dark" : "light"));
      apply();
      mediaQuery.addEventListener("change", apply);
      return () => mediaQuery.removeEventListener("change", apply);
    } else {
      dispatch(setActualTheme(theme));
    }
  }, [theme, dispatch]);

  const actualTheme = useSelector((s: RootState) => s.theme.actualTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (actualTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [actualTheme]);

  return null;
};

export default ThemeManager;
