// src/redux/reducers/user.reducers.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdmins,
  addAdmin,
  deleteAdmin,
  fetchUsers,
  fetchUsersBySuperUser,
  fetchSuperUsers,
  addUser,
  updateUserServices,
  fetchServices,
  deleteUser,
} from '../actions/user.actions';

const initialState = {
  admins: [],
  superUsers: [],
  services: [],
  users: [],
  error: null,
};

// ... later in extraReducers we'll handle fetchSuperUsers cases

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Admins
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.admins = action.payload;
        state.error = null;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.admins = [];
        state.error = action.payload;
      })

      // 🔹 Fetch Super Users
      .addCase(fetchSuperUsers.fulfilled, (state, action) => {
        state.superUsers = action.payload || [];
        state.error = null;
      })
      .addCase(fetchSuperUsers.rejected, (state, action) => {
        state.superUsers = [];
        state.error = action.payload;
      })

      // 🔹 Add Admin
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.admins.push(action.payload);
        state.error = null;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Delete Admin
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter(admin => admin.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.error = action.payload;
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

      // Fetch users for a Super User (Admin can use this)
      .addCase(fetchUsersBySuperUser.fulfilled, (state, action) => {
        state.users = action.payload || [];
        state.error = null;
      })
      .addCase(fetchUsersBySuperUser.rejected, (state, action) => {
        state.users = [];
        state.error = action.payload?.message || action.error?.message;
      })

      // 🔹 Add User
      .addCase(addUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.users.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload?.message || action.error?.message;
      })

      // 🔹 Update User Services
      .addCase(updateUserServices.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        if (!updatedUser?.id) return;

        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        state.error = null;
      })
      .addCase(updateUserServices.rejected, (state, action) => {
        state.error = action.payload?.message || action.error?.message;
      })

      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload || [];
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.services = [];
        state.error = action.payload?.message || action.error?.message;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.users = state.users.filter((u) => u.id !== deletedId);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload?.message || action.error?.message;
      });
  },
});

export default userReducer.reducer;
