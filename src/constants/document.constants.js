export const DOCUMENT_REDUX = {
  GET_UPLOAD_URL: 'document/getUploadUrl',
  CONFIRM_UPLOAD: 'document/confirmUpload',
  GET_BUSINESS_DOCUMENTS: 'document/getBusinessDocuments',
  GET_MY_DOCUMENTS: 'document/getMyDocuments',
  DELETE: 'document/delete',
  DOWNLOAD: 'document/download',
  GET_DOWNLOAD_URL: 'document/getDownloadUrl',
};

export const DOCUMENT_ENDPOINTS = {
  GET_UPLOAD_URL: '/documents/upload-url',
  CONFIRM_UPLOAD: (documentId) => `/documents/${documentId}/confirm`,
  GET_BUSINESS_DOCUMENTS: (businessId) => `/documents/${businessId}`,
  GET_MY_DOCUMENTS: '/documents/my-documents',
  DELETE: (documentId) => `/documents/delete/${documentId}`,
  GET_DOWNLOAD_URL: (documentId) => `/documents/${documentId}/download`,
}; 