import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchBrandPlan,
  updateBrandPlanTaskStatus,
  addBrandPlanTaskNote,
  fetchBrandPlanTaskNotes,
  ensureBrandPlanProgress,
  updateBrandPlanTask,
  updateBrandPlanTaskNote
} from "@/redux/actions/brandPlan.actions";

import {
  getTaskDocuments,
  uploadTaskDocument,
  deleteTaskDocument,
  getTaskDownloadUrl,
} from "@/redux/actions/brandTaskDocument.actions";

import RoadMapHeader from "@/shared/components/brandEstablishmentComponents/RoadMapHeader";
import PhaseSwitcher from "@/shared/components/brandEstablishmentComponents/PhaseSwitcher";
import WeekSection from "@/shared/components/brandEstablishmentComponents/WeekSection";
import DeliverablesCard from "@/shared/components/brandEstablishmentComponents/DeliverablesCard";
import { useRoadMapData } from "@/shared/components/brandEstablishmentComponents/useRoadMapData";
import httpClient from "@/services/httpClient";

const RoadMap = () => {
  const dispatch = useDispatch();

  const { businessDetails } = useSelector((state) => state.business || {});
  const authUser = useSelector((state) => state.auth?.user);

  const { plan, phases, notesByTaskId = {} } = useSelector((state) => state.brandPlan || {});
  const taskDocumentsByTaskId = useSelector((state) => state.brandTaskDocuments?.byTaskId || {});
  const businessId = businessDetails?.id;

  // NOTE: keeping your hardcoded serviceId exactly as-is (no functional change)
  const serviceId = "9b21dee6-a416-43ff-bda6-d8d2a13f57b1";

  const handleUpdateTask = async (taskId, payload) => {
    await dispatch(updateBrandPlanTask({ taskId, payload, businessId }));
  };

  const handleUpdateNote = async (taskId, noteId, content) => {
  await dispatch(updateBrandPlanTaskNote({ noteId, content, taskId }));
};

  const handleMarkAsCompleted = async (task) => {
    try {
      // Send email to admin about task completion
      const response = await httpClient.post(
        "/brand-plans/tasks/mark-completed",
        {
          taskId: task.id,
          taskTitle: task.title,
          userId: authUser?.id,
          userName: authUser?.full_name || "Unknown User",
          businessName: businessDetails?.name || "Unknown Business",
        }
      );

      toast.success("Task marked as completed. Admin has been notified via email.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to mark task as completed");
    }
  };

  // Ensure week exists then fetch plan
  useEffect(() => {
    if (businessId && serviceId) {
      dispatch(ensureBrandPlanProgress({ businessId, serviceId }));
      dispatch(fetchBrandPlan(businessId));
    }
  }, [businessId, serviceId, dispatch]);

  const { activePhase, setActivePhase, current, weeks } = useRoadMapData({ businessId, phases });

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateBrandPlanTaskStatus({ taskId, status: newStatus, businessId }));
  };

  const handleAddNote = async (taskId, content) => {
    if (!authUser?.id || !authUser?.role) {
      console.warn("No auth user in state, cannot add note.");
      return;
    }

    await dispatch(
      addBrandPlanTaskNote({
        taskId,
        content,
        author_id: authUser.id,
        author_type: authUser.role,
      })
    );

    await dispatch(fetchBrandPlanTaskNotes(taskId));
  };

  const handleUploadTaskDocument = async (taskId, file, setProgress, setError, onSuccess) => {
    try {
      setError("");
      const documentId = await dispatch(uploadTaskDocument(taskId, file, (p) => setProgress(p)));
      await dispatch(getTaskDocuments({ taskId }));
      onSuccess?.(documentId);
    } catch (err) {
      console.error("Task upload error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Upload failed. Please try again."
      );
    }
  };

  const handleDeleteTaskDocument = (taskId, documentId) => {
    dispatch(deleteTaskDocument({ taskId, documentId }));
  };

  const handleDownloadTaskDocument = (documentId, fileName) => {
    dispatch(getTaskDownloadUrl({ documentId, fileName }));
  };

  // Fetch notes for all tasks in visible weeks
  useEffect(() => {
    if (!weeks.length) return;

    weeks.forEach((week) => {
      week.tasks?.forEach((task) => {
        if (!notesByTaskId[task.id]) dispatch(fetchBrandPlanTaskNotes(task.id));
      });
    });
  }, [weeks, dispatch, notesByTaskId]);

  // Fetch documents for all tasks in visible weeks
  useEffect(() => {
    if (!weeks.length) return;

    weeks.forEach((week) => {
      week.tasks?.forEach((task) => {
        if (!taskDocumentsByTaskId[task.id]) dispatch(getTaskDocuments({ taskId: task.id }));
      });
    });
  }, [weeks, dispatch, taskDocumentsByTaskId]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {!current ? (
        <div className="p-6">
          {!businessId ? "No business selected." : "No roadmap found for this business."}
        </div>
      ) : (
        <>
          <RoadMapHeader />

          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <PhaseSwitcher phases={phases} activePhase={activePhase} setActivePhase={setActivePhase} />

            <div className="space-y-8">
              {weeks.map((week) => (
                <WeekSection
                  key={week.id || week.week_number}
                  week={week}
                  notesByTaskId={notesByTaskId}
                  taskDocumentsByTaskId={taskDocumentsByTaskId}
                  onStatusChange={handleStatusChange}
                  onAddNote={handleAddNote}
                  onUploadDocument={handleUploadTaskDocument}
                  onDeleteDocument={handleDeleteTaskDocument}
                  onDownloadDocument={handleDownloadTaskDocument}
                  onUpdateTask={handleUpdateTask}
                  onUpdateNote={handleUpdateNote}
                  onMarkAsCompleted={handleMarkAsCompleted}
                  canUpdateTask={true}
                />
              ))}

              {weeks.length === 0 && (
                <div className="text-sm text-neutral-500 italic">
                  No weeks are available yet for this phase.
                </div>
              )}
            </div>

            <DeliverablesCard />
          </div>
        </>
      )}
    </div>
  );
};

export default RoadMap;
