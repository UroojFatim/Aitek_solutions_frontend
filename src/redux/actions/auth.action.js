import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/services/auth.service";
import { AUTH_REDUX } from "@/constants/auth.constants";
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import toast from 'react-hot-toast';

export const login = createAsyncThunk(
    AUTH_REDUX.LOGIN,
    async ({email, password}, { rejectWithValue, dispatch }) => {
        dispatch(spinnerActivate(AUTH_REDUX.LOGIN));
        try {
            const response = await authService.signIn({email, password});
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error);
        } finally {
            dispatch(spinnerDeactivate(AUTH_REDUX.LOGIN));
        }
    }
)

export const logout = createAsyncThunk(
    AUTH_REDUX.LOGOUT,
    async (_, { rejectWithValue, dispatch }) => {
        dispatch(spinnerActivate(AUTH_REDUX.LOGOUT));
        try {
            const response = await authService.signOut();
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        } finally {
            dispatch(spinnerDeactivate(AUTH_REDUX.LOGOUT));
        }
    }
)

export const validate = createAsyncThunk(
    AUTH_REDUX.VALIDATE,
    async (_, { rejectWithValue, dispatch }) => {
        dispatch(spinnerActivate(AUTH_REDUX.VALIDATE));
        try {
            const response = await authService.validate();
            console.log('Validate response:', response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        } finally {
            dispatch(spinnerDeactivate(AUTH_REDUX.VALIDATE));
        }
    }
)

export const requestForgotPassword = createAsyncThunk(
    AUTH_REDUX.REQUEST_FORGOT_PASSWORD,
    async (email, { rejectWithValue, dispatch }) => {
        dispatch(spinnerActivate(AUTH_REDUX.REQUEST_FORGOT_PASSWORD));
        try {
            const response = await authService.requestForgotPassword(email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        } finally {
            dispatch(spinnerDeactivate(AUTH_REDUX.REQUEST_FORGOT_PASSWORD));
        }
    }
);

export const forgotPassword = createAsyncThunk(
    AUTH_REDUX.FORGOT_PASSWORD,
    async ({ token, newPassword }, { rejectWithValue, dispatch }) => {
        dispatch(spinnerActivate(AUTH_REDUX.FORGOT_PASSWORD));
        try {
            const response = await authService.forgotPassword(token, newPassword);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        } finally {
            dispatch(spinnerDeactivate(AUTH_REDUX.FORGOT_PASSWORD));
        }
    }
);
export const changePassword = createAsyncThunk(
    AUTH_REDUX.CHANGE_PASSWORD,
    async ({ current_password, new_password, callback }, { rejectWithValue, dispatch }) => {
        dispatch(spinnerActivate(AUTH_REDUX.CHANGE_PASSWORD));
        try {
            const response = await authService.changePassword({ current_password, new_password });
            callback?.();
            toast.success("Password changed successfully");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
            return rejectWithValue(error);
        } finally {
            dispatch(spinnerDeactivate(AUTH_REDUX.CHANGE_PASSWORD));
        }
    }
)
