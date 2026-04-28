import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "@material-tailwind/react";
import {
  NoSymbolIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { fetchBusinesses, fetchBusinessById } from "@/redux/actions/business.actions";
import { fetchServices } from "@/redux/actions/services.actions";

import {
  fetchBrandPlan,
  updateBrandPlanTaskStatus,
  addBrandPlanTaskNote,
  fetchBrandPlanTaskNotes,
  updateBrandPlanTask,
  updateBrandPlanTaskNote,
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

const BrandEstablishment = () => {
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] = useState("");

  const { businesses = [] } = useSelector((state) => state.business || {});
  const authUser = useSelector((state) => state.auth?.user);

  const { phases = [], notesByTaskId = {} } = useSelector(
    (state) => state.brandPlan || {}
  );
  const taskDocumentsByTaskId = useSelector(
    (state) => state.brandTaskDocuments?.byTaskId || {}
  );

  const businessId = selectedAccount || null;

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (businessId) dispatch(fetchBrandPlan(businessId));
  }, [businessId, dispatch]);

  const { activePhase, setActivePhase, current, weeks } = useRoadMapData({
    businessId,
    phases,
  });

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateBrandPlanTaskStatus({ taskId, status: newStatus, businessId }));
  };

  const handleAddNote = async (taskId, content) => {
    if (!authUser?.id || !authUser?.role) return;

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

  const handleUpdateTask = async (taskId, payload) => {
    await dispatch(updateBrandPlanTask({ taskId, payload, businessId }));
  };

  const handleUpdateNote = async (taskId, noteId, content) => {
    await dispatch(updateBrandPlanTaskNote({ noteId, content, taskId }));
  };

  const handleUploadTaskDocument = async (
    taskId,
    file,
    setProgress,
    setError,
    onSuccess
  ) => {
    try {
      setError("");
      const documentId = await dispatch(
        uploadTaskDocument(taskId, file, (p) => setProgress(p))
      );
      await dispatch(getTaskDocuments({ taskId }));
      onSuccess?.(documentId);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Upload failed. Please try again.");
    }
  };

  const handleDeleteTaskDocument = (taskId, documentId) => {
    dispatch(deleteTaskDocument({ taskId, documentId }));
  };

  const handleDownloadTaskDocument = (documentId, fileName) => {
    dispatch(getTaskDownloadUrl({ documentId, fileName }));
  };

  useEffect(() => {
    if (!weeks?.length) return;
    weeks.forEach((week) => {
      week.tasks?.forEach((task) => {
        if (!notesByTaskId[task.id]) dispatch(fetchBrandPlanTaskNotes(task.id));
      });
    });
  }, [weeks, dispatch, notesByTaskId]);

  useEffect(() => {
    if (!weeks?.length) return;
    weeks.forEach((week) => {
      week.tasks?.forEach((task) => {
        if (!taskDocumentsByTaskId[task.id]) dispatch(getTaskDocuments({ taskId: task.id }));
      });
    });
  }, [weeks, dispatch, taskDocumentsByTaskId]);

  // ✅ Always show selector, then switch only the content below
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* ✅ ALWAYS VISIBLE SELECTOR */}
      <div className="p-5">
        <div className="flex flex-col w-full sm:w-72">
          <label className="font-medium mb-1 text-sm sm:text-base">
            Select Client
          </label>

          <div className="relative w-full">
            <select
              value={selectedAccount}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedAccount(val);
                if (val) dispatch(fetchBusinessById(val));
              }}
              className="p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-light-text dark:text-dark-text w-full appearance-none"
            >
              <option value="">Select Account</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>

            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              ▼
            </span>
          </div>
        </div>
      </div>


      {/* CONTENT AREA */}
      {!businessId ? (
        <div className="flex flex-col items-center justify-center p-8 mt-6">
          <NoSymbolIcon className="w-16 h-16 text-gray-400 mb-4" />
          <Typography variant="h5" className="text-light-text dark:text-dark-text text-center">
            Please select a business to view roadmap
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted text-center mt-2">
            Choose a business from the dropdown menu above
          </Typography>
        </div>
      ) : !current ? (
        <div className="flex flex-col items-center justify-center p-8 mt-6">
          <DocumentMagnifyingGlassIcon className="w-16 h-16 text-gray-400 mb-4" />
          <Typography variant="h5" className="text-light-text dark:text-dark-text text-center">
            No Brand Plan found for this business
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted text-center mt-2">
            This business doesn’t have a roadmap yet. Please create/initiate a plan and try again.
          </Typography>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              onClick={() => setSelectedAccount("")}
              className="rounded-lg px-4 py-2 text-sm font-medium bg-primary text-white hover:opacity-90"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <>
      <RoadMapHeader />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            
          <PhaseSwitcher
            phases={phases}
            activePhase={activePhase}
            setActivePhase={setActivePhase}
          />

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
                canUpdateTask={false}
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

export default BrandEstablishment;
