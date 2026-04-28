// src/pages/dashboard/components/UpdateOpportunityModal.jsx
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ghl_service from "@/services/ghl.service";

const STATUS_OPTIONS = ["Open", "Won", "Lost", "Abandoned"];

const UpdateOpportunityModal = ({
  isOpen,
  onClose,
  opportunity,
  stages = [],
  onUpdated, // callback(updatedOpportunity)
}) => {
  const [stageId, setStageId] = useState("");
  const [status, setStatus] = useState("Open");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // initialize form from selected opportunity
  useEffect(() => {
    if (!isOpen || !opportunity) return;

    const currentStageId =
      opportunity.pipelineStageId || opportunity.pipelineStageUId || "";

    // normalize status from API (likely "open", "won", etc.)
    const rawStatus = (opportunity.status || "open").toLowerCase();
    const capitalized =
      rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

    setStageId(currentStageId);
    setStatus(STATUS_OPTIONS.includes(capitalized) ? capitalized : "Open");
    setErrors({});
  }, [isOpen, opportunity]);

  if (!isOpen || !opportunity) return null;

  const validate = () => {
    const nextErrors = {};
    if (!stageId) nextErrors.stageId = "Stage is required";
    if (!status) nextErrors.status = "Status is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      // Status should be lowercase for GHL API
      const payload = {
        pipelineStageId: stageId,
        status: status.toLowerCase(), // "open" | "won" | "lost" | "abandoned"
      };

      const updated = await ghl_service.updateOpportunity(
        opportunity.id,
        payload
      );

      if (typeof onUpdated === "function") {
        onUpdated(updated || { ...opportunity, ...payload });
      }

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      console.error("Failed to update opportunity", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose && !saving) onClose();
      }}
    >
      <div className="w-full max-w-md mx-4 rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-light-border dark:border-dark-border">
          <div>
            <Typography
              variant="h6"
              className="font-semibold text-light-text dark:text-dark-text text-base sm:text-lg"
            >
              Update opportunity
            </Typography>
            <Typography className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
              {opportunity.name || "Unnamed opportunity"}
            </Typography>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Stage */}
          <div>
            <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
              Stage <span className="text-red-500">*</span>
            </label>
            <select
              value={stageId}
              onChange={(e) => setStageId(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ${
                errors.stageId
                  ? "border-red-400"
                  : "border-light-border dark:border-dark-border"
              }`}
            >
              <option value="">Select stage</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.stageId && (
              <p className="mt-1 text-[11px] text-red-500">{errors.stageId}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ${
                errors.status
                  ? "border-red-400"
                  : "border-light-border dark:border-dark-border"
              }`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-[11px] text-red-500">{errors.status}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 px-5 py-3 border-t border-light-border dark:border-dark-border bg-light-background/60 dark:bg-dark-background/60">
          <Button
            className="px-4 py-2 text-sm normal-case bg-primary text-white hover:bg-primary/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOpportunityModal;
