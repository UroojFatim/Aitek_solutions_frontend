// src/components/ghl/ContactTagsModal.jsx
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ghl_service from "@/services/ghl.service";

const ContactTagsModal = ({ isOpen, onClose, contactId, onTagsUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalTags, setOriginalTags] = useState([]); // tags from API
  const [tags, setTags] = useState([]); // editable copy
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  // Load tags for given contact
  useEffect(() => {
    if (!isOpen || !contactId) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const contact = await ghl_service.getContactById(contactId);
        const currentTags = contact?.tags || [];
        setOriginalTags(currentTags);
        setTags(currentTags);
      } catch (err) {
        console.error("Failed to load contact tags", err);
        setError("Failed to load tags for this contact.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, contactId]);

  if (!isOpen) return null;

  const handleAddTag = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // avoid duplicates (case-insensitive)
    const exists = tags.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!contactId) return;

    setSaving(true);
    setError("");

    // Diff: what to add / remove
    const toAdd = tags.filter(
      (t) =>
        !originalTags.some((o) => o.toLowerCase() === t.toLowerCase())
    );
    const toRemove = originalTags.filter(
      (o) =>
        !tags.some((t) => t.toLowerCase() === o.toLowerCase())
    );

    try {
      // Only call endpoints if needed
      if (toAdd.length > 0) {
        await ghl_service.addTagsToContact(contactId, toAdd);
      }
      if (toRemove.length > 0) {
        await ghl_service.removeTagsFromContact(contactId, toRemove);
      }

      if (typeof onTagsUpdated === "function") {
        onTagsUpdated(tags);
      }

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      console.error("Failed to update tags", err);
      setError("Failed to update tags. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
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
              Manage Tags
            </Typography>
            <Typography className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
              Add or remove tags for this contact.
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
          {loading ? (
            <Typography className="text-sm text-light-muted dark:text-dark-muted">
              Loading tags...
            </Typography>
          ) : (
            <>
              {/* Tag list */}
              <div>
                <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                  Tags
                </label>
                <div className="min-h-[44px] rounded-md border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background px-2 py-2">
                  {tags.length === 0 ? (
                    <span className="text-[11px] text-light-muted dark:text-dark-muted">
                      No tags yet. Add one below.
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-[10px] hover:text-red-500"
                            onClick={() => handleRemoveTag(tag)}
                            title="Remove tag"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add tag input */}
              <div>
                <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                  Add a tag
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Type and press Enter to add"
                  className="
                    w-full rounded-md border px-3 py-2 text-sm outline-none
                    bg-light-background dark:bg-dark-background
                    border-light-border dark:border-dark-border
                    text-light-text dark:text-dark-text
                    focus:border-primary
                  "
                />
              </div>

              {error && (
                <p className="text-[11px] text-red-500">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 px-5 py-3 border-t border-light-border dark:border-dark-border bg-light-background/60 dark:bg-dark-background/60">
          <Button
            className="px-4 py-2 text-sm normal-case bg-primary text-white hover:bg-primary/90"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactTagsModal;
