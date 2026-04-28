import { createSlice } from '@reduxjs/toolkit';
import { fetchOnboardingClients } from '../actions/businessOnboarding.actions';

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

const businessOnboardingReducer = createSlice({
  name: 'businessOnboarding',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboardingClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboardingClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchOnboardingClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default businessOnboardingReducer.reducer;
