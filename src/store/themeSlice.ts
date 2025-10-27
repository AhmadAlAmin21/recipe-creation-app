import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  actualTheme: "light" | "dark";
}

const initialTheme: Theme = ((): Theme => {
  const saved =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;
  return (saved as Theme) || "system";
})();

const initialState: ThemeState = {
  theme: initialTheme,
  actualTheme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setActualTheme(state, action: PayloadAction<"light" | "dark">) {
      state.actualTheme = action.payload;
    },
  },
});

export const { setTheme, setActualTheme } = themeSlice.actions;
export default themeSlice.reducer;
