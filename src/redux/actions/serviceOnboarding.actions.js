import { createAsyncThunk } from "@reduxjs/toolkit";
import { spinnerActivate, spinnerDeactivate } from "../reducers/system.reducers";
import toast from "react-hot-toast";
import ServiceOnboarding from "@/services/serviceOnboarding.service";
import { SERVICE_REDUX } from "@/constants/serviceOnboarding.constants";

// Fetch all Services
export const fetchServices = createAsyncThunk(
  SERVICE_REDUX.FETCH_SERVICES,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICE_REDUX.FETCH_SERVICES));
    try {
      const res = await ServiceOnboarding.getAllServices();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch Services");
      return rejectWithValue(err.response?.data || { message: err.message });
    } finally {
      dispatch(spinnerDeactivate(SERVICE_REDUX.FETCH_SERVICES));
    }
  }
);

// Generic track Service page progress
export const trackServiceProgress = createAsyncThunk(
  SERVICE_REDUX.TRACK_SERVICE_PROGRESS,
  async (serviceId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICE_REDUX.TRACK_SERVICE_PROGRESS));
    try {
      const response = await ServiceOnboarding.trackServiceProgress(serviceId);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to track Service Page progress");
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(SERVICE_REDUX.TRACK_SERVICE_PROGRESS));
    }
  }
);

// Fetch service details (public schema of sections/questions)
export const fetchServiceDetails = createAsyncThunk(
  SERVICE_REDUX.FETCH_SERVICE_DETAILS,
  async (serviceId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICE_REDUX.FETCH_SERVICE_DETAILS));
    try {
      const res = await ServiceOnboarding.getServiceDetails(serviceId);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch Service details");
      return rejectWithValue(err.response?.data || { message: err.message });
    } finally {
      dispatch(spinnerDeactivate(SERVICE_REDUX.FETCH_SERVICE_DETAILS));
    }
  }
);

// Submit step (generic create endpoints)
export const submitServiceOnboarding = createAsyncThunk(
  SERVICE_REDUX.SUBMIT_STEP,
  async ({ data, endpoint }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICE_REDUX.SUBMIT_STEP));
    try {
      const response = await ServiceOnboarding.submitServiceOnboarding(data, endpoint);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit Service Page");
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(SERVICE_REDUX.SUBMIT_STEP));
    }
  }
);

// Admin/business scoped: fetch filled answers
export const fetchBusinessServiceDetails = createAsyncThunk(
  SERVICE_REDUX.FETCH_BUSINESS_SERVICE_DETAILS,
  async ({ serviceId, businessId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICE_REDUX.FETCH_BUSINESS_SERVICE_DETAILS));
    try {
      const response = await ServiceOnboarding.getBusinessServiceDetails(serviceId, businessId);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch business service details");
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(SERVICE_REDUX.FETCH_BUSINESS_SERVICE_DETAILS));
    }
  }
);

// UPDATE Service Section Answers ⬇
export const updateSectionAnswers = createAsyncThunk(
  SERVICE_REDUX.UPDATE_SECTION_ANSWERS,
  async ({ serviceId, businessId, sectionId, answers }, { rejectWithValue, dispatch }) => {
    const spinnerKey = SERVICE_REDUX.UPDATE_SECTION_ANSWERS;
    dispatch(spinnerActivate(spinnerKey));
    try {
      const res = await ServiceOnboarding.updateSectionAnswers(
        serviceId, businessId, sectionId, answers
      );

      // Refresh the view with fresh answers
      await dispatch(fetchBusinessServiceDetails({ serviceId, businessId }));

      toast.success("Section updated");
      return { data: res.data, sectionId };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update section");
      return rejectWithValue(err.response?.data || { message: err.message });
    } finally {
      dispatch(spinnerDeactivate(spinnerKey));
    }
  }
);