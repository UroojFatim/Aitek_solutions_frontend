import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  spinners: [],
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    spinnerActivate: (state, action) => {
      const type = action.payload;
      if (!state.spinners.includes(type)) {
        state.spinners.push(type);
      }
    },
    spinnerDeactivate: (state, action) => {
      const type = action.payload;
      state.spinners = state.spinners.filter((t) => t !== type);
    },
  },
});

export const { spinnerActivate, spinnerDeactivate } = systemSlice.actions;
export const systemReducer = systemSlice.reducer;