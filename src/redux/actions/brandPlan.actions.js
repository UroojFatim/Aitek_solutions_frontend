// src/redux/actions/brandPlan.actions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import brandPlanService from "@/services/brandPlan.service";
import { BRAND_PLAN_REDUX } from "@/constants/brandPlan.constants";
import {
  spinnerActivate,
  spinnerDeactivate,
} from "../reducers/system.reducers";
import toast from "react-hot-toast";

// Fetch phases + tasks for a business
export const fetchBrandPlan = createAsyncThunk(
  BRAND_PLAN_REDUX.FETCH_PLAN,
  async (businessId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BRAND_PLAN_REDUX.FETCH_PLAN));
    try {
      const response = await brandPlanService.getBrandPlan(businessId);
      // assuming ApiResponse: { success, message, data: { plan, phases } }
      return response.data?.data || response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch brand plan"
      );
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BRAND_PLAN_REDUX.FETCH_PLAN));
    }
  }
);

export const ensureBrandPlanProgress = createAsyncThunk(
  BRAND_PLAN_REDUX.ENSURE_PLAN_PROGRESS,
  async ({ businessId, serviceId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BRAND_PLAN_REDUX.ENSURE_PLAN_PROGRESS));
    try {
      const response = await brandPlanService.ensureBrandPlanProgress({
        business_id: businessId,
        service_id: serviceId,
      });

      // ✅ after ensuring, refetch plan
      await dispatch(fetchBrandPlan(businessId));

      return response.data?.data || response.data;
    } catch (error) {
      const payload = error.response?.data || { message: error.message };
      toast.error(payload.message || "Failed to ensure plan progress");
      return rejectWithValue(payload); // ✅ serializable
    } finally {
      dispatch(spinnerDeactivate(BRAND_PLAN_REDUX.ENSURE_PLAN_PROGRESS));
    }
  }
);

// Update task status
export const updateBrandPlanTaskStatus = createAsyncThunk(
  BRAND_PLAN_REDUX.UPDATE_TASK_STATUS,
  async ({ taskId, status, businessId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BRAND_PLAN_REDUX.UPDATE_TASK_STATUS));
    try {
      const response = await brandPlanService.updateTaskStatus(taskId, status);
      // After updating, refetch whole plan so weeks unlock properly
      if (businessId) {
        dispatch(fetchBrandPlan(businessId));
      }
      return response.data?.data || response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BRAND_PLAN_REDUX.UPDATE_TASK_STATUS));
    }
  }
);

// Fetch notes for a task
export const fetchBrandPlanTaskNotes = createAsyncThunk(
  BRAND_PLAN_REDUX.FETCH_TASK_NOTES,
  async (taskId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BRAND_PLAN_REDUX.FETCH_TASK_NOTES));
    try {
      const response = await brandPlanService.getTaskNotes(taskId);
      return { taskId, notes: response.data?.data || response.data };
    } catch (error) {
      return rejectWithValue({ taskId, error });
    } finally {
      dispatch(spinnerDeactivate(BRAND_PLAN_REDUX.FETCH_TASK_NOTES));
    }
  }
);

// Add a note
export const addBrandPlanTaskNote = createAsyncThunk(
  BRAND_PLAN_REDUX.ADD_TASK_NOTE,
  async ({ taskId, content, author_id, author_type }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BRAND_PLAN_REDUX.ADD_TASK_NOTE));
    try {
      const response = await brandPlanService.addTaskNote(taskId, content, author_id, author_type);
      const note = response.data?.data || response.data;

      // optionally refetch notes after adding
      dispatch(fetchBrandPlanTaskNotes(taskId));
      return { taskId, note };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add note"
      );
      return rejectWithValue({ taskId, error });
    } finally {
      dispatch(spinnerDeactivate(BRAND_PLAN_REDUX.ADD_TASK_NOTE));
    }
  }
);


export const updateBrandPlanTaskNote = createAsyncThunk(
  BRAND_PLAN_REDUX.UPDATE_TASK_NOTE,
  async ({ noteId, content, taskId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BRAND_PLAN_REDUX.UPDATE_TASK_NOTE));
    try {
      const response = await brandPlanService.updateTaskNote(noteId, content);
      const note = response.data?.data || response.data;

      // refresh notes list for that task
      if (taskId) dispatch(fetchBrandPlanTaskNotes(taskId));

      return { taskId, noteId, note };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update note");
      return rejectWithValue({ taskId, noteId, error });
    } finally {
      dispatch(spinnerDeactivate(BRAND_PLAN_REDUX.UPDATE_TASK_NOTE));
    }
  }
);

// ✅ Edit plan task (reflection_answer, checklist_state)
export const updateBrandPlanTask = createAsyncThunk(
  BRAND_PLAN_REDUX.UPDATE_PLAN_TASK,
  async ({ taskId, payload, businessId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BRAND_PLAN_REDUX.UPDATE_PLAN_TASK));
    try {
      const response = await brandPlanService.updatePlanTask(taskId, payload);
      const updatedTask = response.data?.data || response.data;

      // easiest: refetch plan so UI stays consistent
      if (businessId) dispatch(fetchBrandPlan(businessId));

      return { taskId, updatedTask };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
      return rejectWithValue({ taskId, error });
    } finally {
      dispatch(spinnerDeactivate(BRAND_PLAN_REDUX.UPDATE_PLAN_TASK));
    }
  }
);