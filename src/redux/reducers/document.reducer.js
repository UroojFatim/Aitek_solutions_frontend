import { createSlice } from '@reduxjs/toolkit';
import { getUploadUrl, confirmUpload, deleteDocument, getMyDocuments, getBusinessDocuments } from '../actions/document.actions';

const initialState = {
  documents: [],
  error: null,
  loading: false,
  uploadUrl: null,
  documentId: null
};

const documentReducer = createSlice({
  name: 'document',
  initialState,
  reducers: {
    clearUploadData: (state) => {
      state.uploadUrl = null;
      state.documentId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get upload URL
      .addCase(getUploadUrl.fulfilled, (state, action) => {
        state.uploadUrl = action.payload.uploadUrl;
        state.documentId = action.payload.documentId;
        state.error = null;
      })
      .addCase(getUploadUrl.rejected, (state, action) => {
        state.error = action.error.message;
        state.uploadUrl = null;
        state.documentId = null;
      })

      // Confirm upload
      .addCase(confirmUpload.fulfilled, (state) => {
        state.uploadUrl = null;
        state.documentId = null;
        state.error = null;
      })
      .addCase(confirmUpload.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(getBusinessDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.error = null;
      })
      .addCase(getBusinessDocuments.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Get my documents
      .addCase(getMyDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.error = null;
      })
      .addCase(getMyDocuments.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete document
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc.id !== action.meta.arg.documentId);
        state.error = null;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.error.message;
      })
  }
});

export const { clearUploadData } = documentReducer.actions;
export default documentReducer.reducer; 