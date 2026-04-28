import { createAsyncThunk } from '@reduxjs/toolkit';
import servicesService from '../../services/services.service';
import businessService from '../../services/business.service';
import { SERVICES_REDUX } from '../../constants/services.constants';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import toast from 'react-hot-toast';

export const fetchServices = createAsyncThunk(
  SERVICES_REDUX.FETCH_ALL,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICES_REDUX.FETCH_ALL));
    try {
      const response = await servicesService.getAllServices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(SERVICES_REDUX.FETCH_ALL));
    }
  }
);

export const updateBusinessServices = createAsyncThunk(
  SERVICES_REDUX.UPDATE_BUSINESS_SERVICE,
  async ({ businessId, businessServices, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICES_REDUX.UPDATE_BUSINESS_SERVICE));
    try {
      const response = await servicesService.updateBusinessServices(businessId, businessServices);
      if (callback) callback();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update business service");
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(SERVICES_REDUX.UPDATE_BUSINESS_SERVICE));
    }
  }
);

export const fetchBusinessServiceStatus = createAsyncThunk(
  SERVICES_REDUX.FETCH_SERVICE_STATUS,
  async (serviceId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SERVICES_REDUX.FETCH_SERVICE_STATUS));
    try {
      const response = await businessService.getBusinessServiceStatus(serviceId);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch service status");
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(SERVICES_REDUX.FETCH_SERVICE_STATUS));
    }
  }
);
