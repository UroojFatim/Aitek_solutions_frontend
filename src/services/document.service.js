import httpClient from './httpClient';
import { DOCUMENT_ENDPOINTS } from '../constants/document.constants';

const documentService = {
  getUploadUrl: (fileData) => {
    return httpClient.post(DOCUMENT_ENDPOINTS.GET_UPLOAD_URL, fileData);
  },

  uploadToAzure: async (uploadUrl, file, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress?.(percentComplete);
        }
      };

      // Handle response
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Upload failed'));
      };

      // Set up and send request
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  },

  confirmUpload: (documentId) => {
    return httpClient.post(DOCUMENT_ENDPOINTS.CONFIRM_UPLOAD(documentId));
  },

  getBusinessDocuments: (businessId) => {
    return httpClient.get(DOCUMENT_ENDPOINTS.GET_BUSINESS_DOCUMENTS(businessId));
  },

  getMyDocuments: () => {
    return httpClient.get(DOCUMENT_ENDPOINTS.GET_MY_DOCUMENTS);
  },

  deleteDocument: (documentId) => {
    return httpClient.delete(DOCUMENT_ENDPOINTS.DELETE(documentId));
  },

  getDownloadUrl: (documentId) => {
    return httpClient.get(DOCUMENT_ENDPOINTS.GET_DOWNLOAD_URL(documentId));
  }
};

export default documentService; 