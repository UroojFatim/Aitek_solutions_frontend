import { createSlice } from '@reduxjs/toolkit';
import { fetchServices, fetchBusinessServiceStatus } from '../actions/services.actions';

const initialState = {
  services: [],
  serviceStatus: null,
  error: null
};

const servicesReducer = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Fetch business service status
      .addCase(fetchBusinessServiceStatus.fulfilled, (state, action) => {
        state.serviceStatus = action.payload;
      })
      .addCase(fetchBusinessServiceStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export default servicesReducer.reducer;