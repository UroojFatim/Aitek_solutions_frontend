// src/services/brandPlan.service.js
import httpClient from "./httpClient";
import { BRAND_PLAN_ENDPOINTS } from "@/constants/brandPlan.constants";

const brandPlanService = {
  getBrandPlan: (businessId) =>
    httpClient.get(BRAND_PLAN_ENDPOINTS.GET_PLAN(businessId)),

  updateTaskStatus: (taskId, status) =>
    httpClient.patch(BRAND_PLAN_ENDPOINTS.UPDATE_TASK_STATUS(taskId), { status }),

  getTaskNotes: (taskId) =>
    httpClient.get(BRAND_PLAN_ENDPOINTS.TASK_NOTES(taskId)),

  addTaskNote: (taskId, content, author_id, author_type) =>
    httpClient.post(BRAND_PLAN_ENDPOINTS.TASK_NOTES(taskId), {
      content,
      author_id,
      author_type,
    }),

  ensureBrandPlanProgress: ({ business_id, service_id }) =>
    httpClient.post(BRAND_PLAN_ENDPOINTS.ENSURE_PLAN_PROGRESS(), {
      business_id,
      service_id,
    }),

  updateTaskNote: (noteId, content) =>
    httpClient.patch(BRAND_PLAN_ENDPOINTS.UPDATE_NOTE(noteId), { content }),

  updatePlanTask: (taskId, payload) =>
    httpClient.patch(BRAND_PLAN_ENDPOINTS.UPDATE_PLAN_TASK(taskId), payload),
};

export default brandPlanService;