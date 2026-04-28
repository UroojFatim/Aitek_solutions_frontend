// src/components/ghl/ContactTasksModal.jsx
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ghl_service from "@/services/ghl.service";

const ContactTasksModal = ({
  isOpen,
  onClose,
  contactId,
  users = [],
  onTasksUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load tasks when modal opens
  useEffect(() => {
    if (!isOpen || !contactId) return;

    const loadTasks = async () => {
      setLoading(true);
      try {
        const data = await ghl_service.getTasks(contactId);
        const list = data?.tasks || data || [];
        setTasks(list);
      } catch (err) {
        console.error("Failed to load tasks", err);
        setError("Unable to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [isOpen, contactId]);

  if (!isOpen) return null;

  // ADD NEW TASK
  const handleCreateTask = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        title,
        body,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        assignedTo,
        completed: false,
      };

      const created = await ghl_service.createTask(contactId, payload);
      const task = created?.task || created;

      setTasks((prev) => [task, ...prev]);

      setTitle("");
      setBody("");
      setDueDate("");
      setAssignedTo("");

      onTasksUpdated && onTasksUpdated(task);
    } catch (err) {
      console.error("Failed to create task", err);
      setError("Failed to create task.");
    } finally {
      setSaving(false);
    }
  };

  // MARK TASK COMPLETED
  const handleMarkCompleted = async (taskId) => {
    setSaving(true);

    try {
      await ghl_service.updateTaskCompleted(contactId, taskId, true);
      const updated = tasks.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t
      );
      setTasks(updated);
      onTasksUpdated && onTasksUpdated(updated);
    } catch (err) {
      console.error(err);
      setError("Unable to mark as completed.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE TASK
  const handleDelete = async (taskId) => {
    setSaving(true);
    try {
      await ghl_service.deleteTask(contactId, taskId);
      const updated = tasks.filter((t) => t.id !== taskId);
      setTasks(updated);
      onTasksUpdated && onTasksUpdated(updated);
    } catch (err) {
      console.error(err);
      setError("Unable to delete task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="w-full max-w-2xl mx-4 rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-2xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-start px-5 py-4 border-b border-light-border dark:border-dark-border">
          <div>
            <Typography
              variant="h6"
              className="text-light-text dark:text-dark-text text-base sm:text-lg font-semibold"
            >
              Contact Tasks
            </Typography>
            <Typography className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
              Manage tasks for this contact.
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-5 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-light-muted dark:text-dark-muted">
              Loading tasks...
            </p>
          ) : (
            <>
              {/* TASK LIST */}
              <div>
                <p className="mb-1 text-xs font-medium text-light-text dark:text-dark-text">
                  Tasks
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.length === 0 ? (
                    <p className="text-[11px] text-light-muted dark:text-dark-muted">
                      No tasks yet. Add one below.
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start justify-between rounded-md border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-light-text dark:text-dark-text">
                            {task.title}
                          </p>
                          <p className="whitespace-pre-wrap text-xs text-light-muted dark:text-dark-muted">
                            {task.body}
                          </p>
                          {task.dueDate && (
                            <p className="mt-1 text-[10px] text-light-muted dark:text-dark-muted">
                              Due: {new Date(task.dueDate).toLocaleString()}
                            </p>
                          )}
                          {task.completed && (
                            <span className="mt-1 inline-block rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-1 text-[10px]">
                              Completed
                            </span>
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div className="ml-2 flex flex-col items-end gap-2">
                          {!task.completed && (
                            <button
                              className="text-[10px] text-primary hover:underline"
                              onClick={() => handleMarkCompleted(task.id)}
                            >
                              Mark Done
                            </button>
                          )}

                          <button
                            className="text-[10px] text-red-500 hover:underline"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ADD NEW TASK FORM */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-light-text dark:text-dark-text">
                  Add New Task
                </p>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className="
                    w-full rounded-md border px-3 py-2 text-sm outline-none
                    bg-light-background dark:bg-dark-background
                    border-light-border dark:border-dark-border
                    text-light-text dark:text-dark-text
                    focus:border-primary
                  "
                />

                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  placeholder="Task description"
                  className="
                    w-full rounded-md border px-3 py-2 text-sm outline-none resize-none
                    bg-light-background dark:bg-dark-background
                    border-light-border dark:border-dark-border
                    text-light-text dark:text-dark-text
                    focus:border-primary
                  "
                />

                <div>
                  <label className="text-xs text-light-muted dark:text-dark-muted">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="
                      mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                      bg-light-background dark:bg-dark-background
                      border-light-border dark:border-dark-border
                      text-light-text dark:text-dark-text
                      focus:border-primary
                    "
                  />
                </div>

                <div>
                  <label className="text-xs text-light-muted dark:text-dark-muted">
                    Assigned To
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="
                      mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                      bg-light-background dark:bg-dark-background
                      border-light-border dark:border-dark-border
                      text-light-text dark:text-dark-text
                      focus:border-primary
                    "
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.fullName || user.email}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleCreateTask}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-white normal-case text-sm px-4 py-2"
                >
                  {saving ? "Saving..." : "Add Task"}
                </Button>

                {error && (
                  <p className="mt-1 text-[11px] text-red-500">{error}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactTasksModal;
