import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarCollapsed: false,
  isDarkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsSidebarCollapsed(state, action) {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode(state, action) {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsDarkMode, setIsSidebarCollapsed } = uiSlice.actions;

export default uiSlice.reducer;
