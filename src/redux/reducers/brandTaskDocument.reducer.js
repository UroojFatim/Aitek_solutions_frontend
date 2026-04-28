// src/redux/reducers/taskDocument.reducers.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getTaskUploadUrl,
  confirmTaskUpload,
  getTaskDocuments,
  deleteTaskDocument,
} from "../actions/brandTaskDocument.actions";

const initialState = {
  byTaskId: {}, // { [taskId]: { items: [], loading: false, error: null } }
};

const brandTaskDocumentSlice = createSlice({
  name: "taskDocuments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch docs for a task
      .addCase(getTaskDocuments.pending, (state, action) => {
        const { taskId } = action.meta.arg;
        if (!state.byTaskId[taskId]) state.byTaskId[taskId] = { items: [] };
        state.byTaskId[taskId].loading = true;
        state.byTaskId[taskId].error = null;
      })
      .addCase(getTaskDocuments.fulfilled, (state, action) => {
        const { taskId } = action.meta.arg;
        state.byTaskId[taskId] = {
          items: action.payload,
          loading: false,
          error: null,
        };
      })
      .addCase(getTaskDocuments.rejected, (state, action) => {
        const { taskId } = action.meta.arg;
        if (!state.byTaskId[taskId]) state.byTaskId[taskId] = { items: [] };
        state.byTaskId[taskId].loading = false;
        state.byTaskId[taskId].error = action.error?.message;
      })

      // Delete document
      .addCase(deleteTaskDocument.fulfilled, (state, action) => {
        const { taskId, documentId } = action.meta.arg;
        const bucket = state.byTaskId[taskId];
        if (!bucket?.items) return;
        bucket.items = bucket.items.filter((d) => d.id !== documentId);
      });
  },
});

export default brandTaskDocumentSlice.reducer;