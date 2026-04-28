import { createSlice } from '@reduxjs/toolkit';
import { fetchBusinesses, fetchBusinessById, createBusiness, fetchBusinessDetails } from '../actions/business.actions';
import { ROUTE_PATHS } from '@/constants/routes.constants';
import { BusinessStatus } from '@/constants/business.constants';
import { setRedirectTo } from './auth.reducer';
import { useReducer } from 'react';

const initialState = {
  businesses: [],
  selectedBusiness: null,
  businessDetails: null,
  error: null
};

const businessReducer = createSlice({
  name: 'business',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all businesses
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Fetch business by ID
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.selectedBusiness = action.payload;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Create business
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.businesses.push(action.payload);
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Fetch business details
      .addCase(fetchBusinessDetails.fulfilled, (state, action) => {
        state.businessDetails = action.payload;
      })
      .addCase(fetchBusinessDetails.rejected, (state, action) => {
        state.error = action.error.message;
      })
  }
});

export default businessReducer.reducer;
