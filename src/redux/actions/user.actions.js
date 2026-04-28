import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import userService from '@/services/user.service';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import { USER_REDUX, USER_ROLES } from '@/constants/user.constants';

export const fetchAdmins = createAsyncThunk(
  USER_REDUX.FETCH_ADMINS,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.FETCH_ADMINS));
    try {
      const response = await userService.getAllUsers();
      // Return Admin and Super Admin roles
      const admins = response.filter((user) => {
        const role = (user?.role || '').toLowerCase().replace(/\s+/g, '');
        return role === 'admin' || role === 'superadmin';
      });

      return admins;
    } catch (error) {
      toast.error('Failed to fetch admins');
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.FETCH_ADMINS));
    }
  }
);

// Fetch only Super Users
export const fetchSuperUsers = createAsyncThunk(
  USER_REDUX.FETCH_SUPERUSERS,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.FETCH_SUPERUSERS));
    try {
      const response = await userService.getAllUsers();
      const superUsers = response.filter((user) => {
        const role = (user?.role || '').toLowerCase().replace(/\s+/g, '');
        return role === 'superuser';
      });

      return superUsers;
    } catch (error) {
      toast.error('Failed to fetch super users');
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.FETCH_SUPERUSERS));
    }
  }
);

export const addAdmin = createAsyncThunk(
  USER_REDUX.ADD_ADMIN,
  async (userData, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.ADD_ADMIN));
    try {
      const response = await userService.addAdmin(userData);
      toast.success('Admin added successfully!');
      return response.data;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add admin';
      toast.error(errorMsg);
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.ADD_ADMIN));
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  USER_REDUX.DELETE_ADMIN,
  async (id, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.DELETE_ADMIN));
    try {
      await userService.deleteAdmin(id);
      // Success toast is handled by the component
      return id;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to delete admin';
      toast.error(errorMsg);
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.DELETE_ADMIN));
    }
  }
);

// Restore Admin (soft-undelete)
export const restoreAdmin = createAsyncThunk(
  'user/restoreAdmin',
  async (id, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate('user/restoreAdmin'));
    try {
      await userService.restoreAdmin(id);
      toast.success('Admin restored successfully!');
      // Refresh admin list
      dispatch(fetchAdmins());
      return id;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to restore admin';
      toast.error(errorMsg);
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate('user/restoreAdmin'));
    }
  }
);

export const fetchServices = createAsyncThunk(
  USER_REDUX.FETCH_SERVICES,
  async (businessId = null, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.FETCH_SERVICES));
    try {
      // 🔥 This now calls /users/services optionally scoped to a business
      const services = await userService.getBusinessServices(businessId);
      return services;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to fetch services'
      );
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.FETCH_SERVICES));
    }
  }
);

// 🔹 Fetch Users (for SuperUser to manage)
export const fetchUsers = createAsyncThunk(
  USER_REDUX.FETCH_USERS,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.FETCH_USERS));
    try {
      const users = await userService.getBusinessUsers(); // ⬅️ use scoped version
      return users;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch users');
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.FETCH_USERS));
    }
  }
);

// 🔹 Create simple User (from SuperUser) with services
export const addUser = createAsyncThunk(
  USER_REDUX.ADD_USER,
  async ({ data, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.ADD_USER));
    try {
      // data already contains: full_name, email, password, service_ids, business_id
      const payload = {
        ...data,
        role: USER_ROLES.USER, // if backend uses body.role for normal users (optional)
      };

      const createdUser = await userService.addUser(payload);

      toast.success('User created successfully');
      callback?.();
      return createdUser;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create user');
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.ADD_USER));
    }
  }
);

// 🔹 Update which services a user has access to
export const updateUserServices = createAsyncThunk(
  USER_REDUX.UPDATE_USER_SERVICES,
  async ({ id, service_ids, business_id = null, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.UPDATE_USER_SERVICES));
    try {
      const payload = { service_ids };
      if (business_id) payload.business_id = business_id;

      const updatedUser = await userService.updateUserServices(id, payload);

      toast.success('User services updated');
      callback?.();
      return updatedUser;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to update user services'
      );
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.UPDATE_USER_SERVICES));
    }
  }
);

// 🆕 Delete normal User (not Admin)
export const deleteUser = createAsyncThunk(
  USER_REDUX.DELETE_USER,
  async (id, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_REDUX.DELETE_USER));
    try {
      await userService.deleteUser(id);
      toast.success('User deleted successfully!');
      return id; // reducer will remove from state.users
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete user';
      toast.error(errorMsg);
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(USER_REDUX.DELETE_USER));
    }
  }
);

// Restore normal User (soft-undelete)
export const restoreUser = createAsyncThunk(
  'user/restoreUser',
  async (id, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate('user/restoreUser'));
    try {
      await userService.restoreUser(id);
      toast.success('User restored successfully!');
      // Refresh users list (if applicable)
      dispatch(fetchUsers());
      return id;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to restore user';
      toast.error(errorMsg);
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate('user/restoreUser'));
    }
  }
);

// Fetch users belonging to all businesses owned by a Super User (Admin can use this)
export const fetchUsersBySuperUser = createAsyncThunk(
  'user/fetchUsersBySuperUser',
  async (superUserId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate('user/fetchUsersBySuperUser'));
    try {
      const users = await userService.getUsersBySuperUser(superUserId);
      return users;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch users for superuser');
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate('user/fetchUsersBySuperUser'));
    }
  }
);

// Change user password (SuperAdmin only)
export const changeUserPassword = createAsyncThunk(
  'user/changeUserPassword',
  async ({ userId, newPassword, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate('user/changeUserPassword'));
    try {
      await userService.changeUserPassword(userId, { password: newPassword });
      toast.success('Password updated successfully');
      callback?.();
      return userId;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate('user/changeUserPassword'));
    }
  }
);