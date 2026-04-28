import { createAsyncThunk } from '@reduxjs/toolkit';
import { DOCUMENT_REDUX } from '@/constants/document.constants';
import documentService from '@/services/document.service';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import { saveAs } from 'file-saver';

export const getUploadUrl = createAsyncThunk(
  DOCUMENT_REDUX.GET_UPLOAD_URL,
  async ({ fileData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await documentService.getUploadUrl(fileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const uploadToAzure = async (uploadUrl, file, onProgress) => {
  try {
    await documentService.uploadToAzure(uploadUrl, file, onProgress);
  } catch (error) {
    throw error;
  }
};

export const confirmUpload = createAsyncThunk(
  DOCUMENT_REDUX.CONFIRM_UPLOAD,
  async ({ documentId, callback }, { rejectWithValue, dispatch }) => {
    try {
      const response = await documentService.confirmUpload(documentId);
      callback?.();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getBusinessDocuments = createAsyncThunk(
  DOCUMENT_REDUX.GET_BUSINESS_DOCUMENTS,
  async (businessId , { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(DOCUMENT_REDUX.GET_BUSINESS_DOCUMENTS));
    try {
      const response = await documentService.getBusinessDocuments(businessId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(DOCUMENT_REDUX.GET_BUSINESS_DOCUMENTS));
    }
  }
);

export const getMyDocuments = createAsyncThunk(
  DOCUMENT_REDUX.GET_MY_DOCUMENTS,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(DOCUMENT_REDUX.GET_MY_DOCUMENTS));
    try {
      const response = await documentService.getMyDocuments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(DOCUMENT_REDUX.GET_MY_DOCUMENTS));
    }
  }
);

export const deleteDocument = createAsyncThunk(
  DOCUMENT_REDUX.DELETE,
  async ({ documentId, callback }, { rejectWithValue, dispatch }) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return rejectWithValue({ message: 'Delete cancelled' });
    }

    dispatch(spinnerActivate(DOCUMENT_REDUX.DELETE));
    try {
      const response = await documentService.deleteDocument(documentId);
      callback?.();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(DOCUMENT_REDUX.DELETE));
    }
  }
);

export const getDownloadUrl = createAsyncThunk(
  DOCUMENT_REDUX.GET_DOWNLOAD_URL,
  async ({ documentId, fileName, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(DOCUMENT_REDUX.GET_DOWNLOAD_URL));
    try {
      const response = await documentService.getDownloadUrl(documentId);
      const { downloadUrl } = response.data;
      
      try {
        const fileResponse = await fetch(downloadUrl);
        const blob = await fileResponse.blob();
        saveAs(blob, fileName);
      } catch (error) {
        console.error('Download failed:', error);
        throw error;
      }
      
      callback?.();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(DOCUMENT_REDUX.GET_DOWNLOAD_URL));
    }
  }
); 