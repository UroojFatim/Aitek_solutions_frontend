// src/redux/actions/taskDocument.actions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { TASK_DOCUMENT_REDUX } from "@/constants/brandTaskDocument.constants";
import taskDocumentService from "@/services/brandTaskDocument.service";
import {
  spinnerActivate,
  spinnerDeactivate,
} from "../reducers/system.reducers";
import { uploadToAzure } from "./document.actions"; // reuse your helper
import { saveAs } from "file-saver";

export const getTaskUploadUrl = createAsyncThunk(
  TASK_DOCUMENT_REDUX.GET_UPLOAD_URL,
  async ({ taskId, fileData }, { rejectWithValue }) => {
    try {
      const response = await taskDocumentService.getUploadUrl({
        taskId,
        ...fileData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const confirmTaskUpload = createAsyncThunk(
  TASK_DOCUMENT_REDUX.CONFIRM_UPLOAD,
  async ({ documentId }, { rejectWithValue }) => {
    try {
      const response = await taskDocumentService.confirmUpload(documentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTaskDocuments = createAsyncThunk(
  TASK_DOCUMENT_REDUX.GET_TASK_DOCUMENTS,
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const response = await taskDocumentService.getTaskDocuments(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTaskDocument = createAsyncThunk(
  TASK_DOCUMENT_REDUX.DELETE,
  async ({ taskId, documentId }, { rejectWithValue, dispatch }) => {
    if (
      !window.confirm("Are you sure you want to delete this task document?")
    ) {
      return rejectWithValue({ message: "Delete cancelled" });
    }

    dispatch(spinnerActivate(TASK_DOCUMENT_REDUX.DELETE));
    try {
      const response = await taskDocumentService.deleteDocument(documentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(TASK_DOCUMENT_REDUX.DELETE));
    }
  }
);

export const getTaskDownloadUrl = createAsyncThunk(
  TASK_DOCUMENT_REDUX.GET_DOWNLOAD_URL,
  async ({ documentId, fileName }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(TASK_DOCUMENT_REDUX.GET_DOWNLOAD_URL));
    try {
      const response = await taskDocumentService.getDownloadUrl(documentId);
      const { downloadUrl } = response.data;

      const fileResponse = await fetch(downloadUrl);
      const blob = await fileResponse.blob();
      saveAs(blob, fileName);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(TASK_DOCUMENT_REDUX.GET_DOWNLOAD_URL));
    }
  }
);

/**
 * Helper: full upload flow for a task
 * (get URL -> uploadToAzure -> confirm)
 */
export const uploadTaskDocument = (taskId, file, onProgress) => {
  return async (dispatch) => {
    // 1) get pre-signed URL
    const uploadUrlResponse = await dispatch(
      getTaskUploadUrl({
        taskId,
        fileData: {
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
        },
      })
    ).unwrap();

    // 2) upload to Azure
    await uploadToAzure(uploadUrlResponse.uploadUrl, file, onProgress);

    // 3) confirm
    await dispatch(
      confirmTaskUpload({ documentId: uploadUrlResponse.documentId })
    ).unwrap();

    return uploadUrlResponse.documentId;
  };
};