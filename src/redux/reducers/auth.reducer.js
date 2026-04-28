import { createSlice } from '@reduxjs/toolkit';
import { login, logout, validate } from '../actions/auth.action';
import { ROUTE_PATHS } from '@/constants/routes.constants';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
  redirectTo: null,
};

const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearRedirect: (state) => {
      state.redirectTo = null;
    },
    setRedirectTo: (state, action) => {
      state.redirectTo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;

        // Set redirect path based on role
        const role = action.payload?.role?.toLowerCase();

        switch (role) {
          case 'admin':
            state.redirectTo = ROUTE_PATHS.ADMIN.DASHBOARD;
            break;
          default:
            state.redirectTo = ROUTE_PATHS.DASHBOARD.HOME;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Logout
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.redirectTo = ROUTE_PATHS.AUTH.SIGN_IN;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Validate
      .addCase(validate.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(validate.rejected, (state, action) => {
        state.error = action.error.message;
      })
  }
});

export const { clearRedirect, setRedirectTo, setLoading } = authReducer.actions;
export default authReducer.reducer;
