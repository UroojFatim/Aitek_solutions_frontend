// src/services/taskDocument.service.js
import httpClient from "./httpClient";
import { TASK_DOCUMENT_ENDPOINTS } from "../constants/brandTaskDocument.constants";

const brandTaskDocumentService = {
  getUploadUrl: (payload) =>
    httpClient.post(TASK_DOCUMENT_ENDPOINTS.GET_UPLOAD_URL, payload),

  confirmUpload: (documentId) =>
    httpClient.post(TASK_DOCUMENT_ENDPOINTS.CONFIRM_UPLOAD(documentId)),

  getTaskDocuments: (taskId) =>
    httpClient.get(TASK_DOCUMENT_ENDPOINTS.GET_TASK_DOCUMENTS(taskId)),

  deleteDocument: (documentId) =>
    httpClient.delete(TASK_DOCUMENT_ENDPOINTS.DELETE(documentId)),

  getDownloadUrl: (documentId) =>
    httpClient.get(TASK_DOCUMENT_ENDPOINTS.GET_DOWNLOAD_URL(documentId)),
};

export default brandTaskDocumentService;