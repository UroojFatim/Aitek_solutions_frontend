// src/redux/reducers/ghl.reducers.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchGhlPipelines } from '../actions/ghl.actions';
import { fetchUsers,silentlyFetchGhlOpportunitiesByPipelineId, fetchGhlOpportunitiesByPipelineId,fetchGhlConversations,fetchMessages } from '../actions/ghl.actions';

const initialState = {
  pipelines: [],
  opportunities: [],
  conversations: [],
  messages: {}, // keyed by conversationId
  users: [],
  error: null,
};

const ghlReducer = createSlice({
      name: 'ghl',
      initialState,
      reducers: {
        // if you need manual reset later
        resetGhlState: () => initialState,
      },
      extraReducers: (builder) => {
        builder
      // 🔹 Fetch Pipelines
      .addCase(fetchGhlPipelines.fulfilled, (state, action) => {
        state.pipelines = action.payload || [];
        state.error = null;
      })
      .addCase(fetchGhlPipelines.rejected, (state, action) => {
        state.pipelines = [];
        state.error = action.payload?.message || action.error?.message;
      })

      // 🔹 Fetch Opportunities
      .addCase(fetchGhlOpportunitiesByPipelineId.fulfilled, (state, action) => {
        const list =
          action.payload?.data?.opportunities ||
          action.payload?.opportunities ||
          action.payload ||
          [];
        state.opportunities = [...list];
        state.error = null;
      })


      .addCase(fetchGhlOpportunitiesByPipelineId.rejected, (state, action) => {
        state.opportunities = [];
        state.error = action.payload?.message || action.error?.message;
      })

            // --------------------------
      // 🔹 Silent polling SUCCESS
      // --------------------------
      .addCase(silentlyFetchGhlOpportunitiesByPipelineId.fulfilled, (state, action) => {
        const list =
          action.payload?.data?.opportunities ||
          action.payload?.opportunities ||
          action.payload ||
          [];

        // 🔥 Only update data silently
        state.opportunities = [...list];
      })

      // --------------------------
      // 🔹 Silent polling ERROR (IGNORE)
      // --------------------------
      .addCase(silentlyFetchGhlOpportunitiesByPipelineId.rejected, () => {
        // DO NOTHING – no spinner, no error, no UI break
      })


      // 🔹 Fetch Conversations
      .addCase(fetchGhlConversations.fulfilled, (state, action) => {
        state.conversations = action.payload || [];
        state.error = null;
      })
      .addCase(fetchGhlConversations.rejected, (state, action) => {
        state.conversations = [];
        state.error = action.payload?.message || action.error?.message;
      })

            // 🔹 Fetch Users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload || [];
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users = [];
        state.error = action.payload?.message || action.error?.message;
      })

      // 🔹 Fetch Messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const convId = action.meta?.arg ?? action.payload?.conversationId;
        if (!convId) return;
        state.messages = state.messages || {};
        state.messages[convId] = action.payload ?? {};
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload?.message || action.error?.message || null;
      });
  },
});

export const { resetGhlState } = ghlReducer.actions;

export default ghlReducer.reducer;
