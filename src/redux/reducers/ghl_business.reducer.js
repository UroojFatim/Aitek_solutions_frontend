import { createSlice } from '@reduxjs/toolkit';
import {
  getAllBusinesses,
  getAllPipelines,
  assignPipelineToBusiness,
  getAssignedPipelines,
  getBusinessPipelinesByBusinessId,
  deletePipeline
} from '../actions/ghl_business.actions';

const initialState = {
  businesses: [],
  pipelines: [],
  assignedPipelines: [],
  businessPipelines: [],
  error: null
};

const ghlReducer = createSlice({
  name: 'ghl',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBusinesses.fulfilled, (state, action) => {
        state.businesses = action.payload;
        state.error = null;
      })
      .addCase(getAllBusinesses.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(getAllPipelines.fulfilled, (state, action) => {
        state.pipelines = action.payload;
        state.error = null;
      })
      .addCase(getAllPipelines.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(assignPipelineToBusiness.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(assignPipelineToBusiness.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(getAssignedPipelines.fulfilled, (state, action) => {
        state.assignedPipelines = action.payload;
        state.error = null;
      })
      .addCase(getAssignedPipelines.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(getBusinessPipelinesByBusinessId.fulfilled, (state, action) => {
        state.businessPipelines = action.payload;
        state.error = null;
      })
      .addCase(getBusinessPipelinesByBusinessId.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(deletePipeline.fulfilled, (state, action) => {
        state.assignedPipelines = state.assignedPipelines.filter(pipline => pipline.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePipeline.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default ghlReducer.reducer;
