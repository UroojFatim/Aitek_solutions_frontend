// src/redux/reducers/brandPlan.reducer.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBrandPlan,
  updateBrandPlanTaskStatus,
  fetchBrandPlanTaskNotes,
  addBrandPlanTaskNote,
  ensureBrandPlanProgress,
  updateBrandPlanTaskNote,
  updateBrandPlanTask,
} from "../actions/brandPlan.actions";

const initialState = {
  plan: null,
  phases: [],
  error: null,
  // per-task notes & loading states
  notesByTaskId: {}, // { [taskId]: { loading, error, items: [] } }
};

const brandPlanReducer = createSlice({
  name: "brandPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch plan
      .addCase(fetchBrandPlan.fulfilled, (state, action) => {
        state.plan = action.payload.plan || null;
        state.phases = action.payload.phases || [];
        state.error = null;
      })
      .addCase(fetchBrandPlan.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Update task status (we refetch plan in thunk, so no need to manually patch phases here)
      .addCase(updateBrandPlanTaskStatus.rejected, (state, action) => {
        state.error =
          action.payload?.response?.data?.message ||
          action.error.message;
      })

      // Fetch notes
      .addCase(fetchBrandPlanTaskNotes.pending, (state, action) => {
        const taskId = action.meta.arg;
        state.notesByTaskId[taskId] = {
          ...(state.notesByTaskId[taskId] || { items: [] }),
          loading: true,
          error: null,
        };
      })
      .addCase(fetchBrandPlanTaskNotes.fulfilled, (state, action) => {
        const { taskId, notes } = action.payload;
        state.notesByTaskId[taskId] = { items: notes };
      })

      .addCase(fetchBrandPlanTaskNotes.rejected, (state, action) => {
        const { taskId, error } = action.payload || {};
        if (!taskId) return;
        state.notesByTaskId[taskId] = {
          ...(state.notesByTaskId[taskId] || { items: [] }),
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch notes",
        };
      })

      // Add note
      .addCase(addBrandPlanTaskNote.pending, (state, action) => {
        const { taskId } = action.meta.arg;
        state.notesByTaskId[taskId] = {
          ...(state.notesByTaskId[taskId] || { items: [] }),
          adding: true,
          error: null,
        };
      })
      .addCase(addBrandPlanTaskNote.fulfilled, (state, action) => {
        const { taskId, note } = action.payload;
        const existing = state.notesByTaskId[taskId]?.items || [];
        state.notesByTaskId[taskId] = {
          adding: false,
          error: null,
          items: [...existing, note],
        };
      })
      .addCase(addBrandPlanTaskNote.rejected, (state, action) => {
        const { taskId, error } = action.payload || {};
        if (!taskId) return;
        state.notesByTaskId[taskId] = {
          ...(state.notesByTaskId[taskId] || { items: [] }),
          adding: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to add note",
        };
      })

      .addCase(ensureBrandPlanProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(ensureBrandPlanProgress.fulfilled, (state) => {
        // nothing needed because we refetch plan in thunk
      })
      .addCase(ensureBrandPlanProgress.rejected, (state, action) => {
        state.error =
          action.payload?.message || action.error?.message || "Unknown error";
      })

      .addCase(updateBrandPlanTaskNote.rejected, (state, action) => {
        state.error =
          action.payload?.error?.response?.data?.message ||
          action.payload?.error?.message ||
          action.error.message;
      })

      .addCase(updateBrandPlanTask.rejected, (state, action) => {
        state.error =
          action.payload?.error?.response?.data?.message ||
          action.payload?.error?.message ||
          action.error.message;
      });
  },
});

export default brandPlanReducer.reducer;