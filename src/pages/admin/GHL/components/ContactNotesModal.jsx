// src/components/ghl/ContactNotesModal.jsx
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ghl_service from "@/services/ghl.service";

const ContactNotesModal = ({ isOpen, onClose, contactId, onNotesUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load notes when opened
  useEffect(() => {
    if (!isOpen || !contactId) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await ghl_service.getNotes(contactId);
        // depending on backend it may be data.notes or just array
        const list = data?.notes || data || [];
        setNotes(list);
      } catch (err) {
        console.error("Failed to load notes", err);
        setError("Failed to load notes for this contact.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, contactId]);

  if (!isOpen) return null;

  const handleAddNote = async () => {
    const body = newNote.trim();
    if (!body) return;

    setSaving(true);
    setError("");

    try {
      const created = await ghl_service.createNote(contactId, body);

      // Normalize: created might be single note or wrapper
      const note = created?.note || created;
      setNotes((prev) => [note, ...prev]);
      setNewNote("");

      if (typeof onNotesUpdated === "function") {
        onNotesUpdated([note, ...notes]);
      }
    } catch (err) {
      console.error("Failed to create note", err);
      setError("Failed to create note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId) return;

    setSaving(true);
    setError("");

    try {
      await ghl_service.deleteNote(contactId, noteId);
      const updated = notes.filter((n) => n.id !== noteId);
      setNotes(updated);

      if (typeof onNotesUpdated === "function") {
        onNotesUpdated(updated);
      }
    } catch (err) {
      console.error("Failed to delete note", err);
      setError("Failed to delete note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // put this helper outside your component
  const stripHtml = (value = "") => {
    if (!value) return "";
    const div = document.createElement("div");
    div.innerHTML = value;
    return div.textContent || div.innerText || "";
  };


  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose && !saving) onClose();
      }}
    >
      <div className="w-full max-w-lg mx-4 rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-light-border dark:border-dark-border">
          <div>
            <Typography
              variant="h6"
              className="font-semibold text-light-text dark:text-dark-text text-base sm:text-lg"
            >
              Contact Notes
            </Typography>
            <Typography className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
              Add or remove notes for this contact.
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
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <Typography className="text-sm text-light-muted dark:text-dark-muted">
              Loading notes...
            </Typography>
          ) : (
            <>
              {/* Existing notes list */}
              <div>
                <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                  Notes
                </label>
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-2">
                  {notes.length === 0 ? (
                    <span className="text-[11px] text-light-muted dark:text-dark-muted">
                      No notes yet. Add your first note below.
                    </span>
                  ) : (
                    notes.map((note) => {
                      const rawBody = note.bodyText || note.body || note.text || "";
                      const createdAt = note.createdAt || note.dateAdded; // <- use dateAdded

                      return (
                        <div
                          key={note.id}
                          className="flex items-start gap-2 rounded-md border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface px-3 py-2"
                        >
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap text-xs text-light-text dark:text-dark-text">
                              {stripHtml(rawBody)}
                            </p>

                            {createdAt && (
                              <p className="mt-1 text-[10px] text-light-muted dark:text-dark-muted">
                                {new Date(createdAt).toLocaleString()}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            className="ml-2 text-[11px] text-light-muted dark:text-dark-muted hover:text-red-500"
                            onClick={() => handleDeleteNote(note.id)}
                            disabled={saving}
                            title="Delete note"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add new note */}
              <div>
                <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                  Add Note
                </label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type your note here..."
                  className="
                    w-full resize-none rounded-md border px-3 py-2 text-sm outline-none
                    bg-light-background dark:bg-dark-background
                    border-light-border dark:border-dark-border
                    text-light-text dark:text-dark-text
                    focus:border-primary
                  "
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                />
                <p className="mt-1 text-[10px] text-light-muted dark:text-dark-muted">
                  Press Ctrl+Enter to save quickly.
                </p>
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={saving || !newNote.trim()}
                    className="px-4 py-2 text-sm normal-case bg-primary text-white hover:bg-primary/90"
                  >
                    {saving ? "Saving..." : "Add note"}
                  </Button>
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-red-500">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactNotesModal;
