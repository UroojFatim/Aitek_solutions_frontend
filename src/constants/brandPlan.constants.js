// src/constants/brandPlan.constants.js
export const BRAND_PLAN_ENDPOINTS = {
  GET_PLAN: (businessId) => `/brand-plans/${businessId}`,
  UPDATE_TASK_STATUS: (taskId) => `/brand-plans/tasks/${taskId}/status`,
  TASK_NOTES: (taskId) => `/brand-plans/tasks/${taskId}/notes`,
  ENSURE_PLAN_PROGRESS: () => `/brand-plans/ensure`,
  UPDATE_NOTE: (noteId) => `/brand-plans/notes/${noteId}`,
  UPDATE_PLAN_TASK: (taskId) => `/brand-plans/tasks/${taskId}`,
};

export const BRAND_PLAN_REDUX = {
  FETCH_PLAN: "brandPlan/fetchPlan",
  UPDATE_TASK_STATUS: "brandPlan/updateTaskStatus",
  FETCH_TASK_NOTES: "brandPlan/fetchTaskNotes",
  ADD_TASK_NOTE: "brandPlan/addTaskNote",
  ENSURE_PLAN_PROGRESS: "brandPlan/ensurePlanProgress",
  UPDATE_TASK_NOTE: "brandPlan/updateTaskNote",
  UPDATE_PLAN_TASK: "brandPlan/updatePlanTask",
};