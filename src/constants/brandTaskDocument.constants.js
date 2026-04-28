// src/constants/taskDocument.constants.js
export const TASK_DOCUMENT_REDUX = {
  GET_UPLOAD_URL: "taskDocument/getUploadUrl",
  CONFIRM_UPLOAD: "taskDocument/confirmUpload",
  GET_TASK_DOCUMENTS: "taskDocument/getTaskDocuments",
  DELETE: "taskDocument/delete",
  GET_DOWNLOAD_URL: "taskDocument/getDownloadUrl",
};

export const TASK_DOCUMENT_ENDPOINTS = {
  GET_UPLOAD_URL: "/task-documents/upload-url",
  CONFIRM_UPLOAD: (documentId) => `/task-documents/${documentId}/confirm`,
  GET_TASK_DOCUMENTS: (taskId) => `/task-documents/task/${taskId}`,
  DELETE: (documentId) => `/task-documents/delete/${documentId}`,
  GET_DOWNLOAD_URL: (documentId) => `/task-documents/${documentId}/download`,
};