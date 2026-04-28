import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import Card from "./Card";
import { Button } from "@material-tailwind/react";
import { useSelector, useDispatch } from "react-redux";
import { ALLOWED_FILE_TYPES, getAcceptedFileExtensions } from "@/constants/documents";
import toast from "react-hot-toast";

const TaskCard = ({
    task,
    notes,
    documents = [],
    onStatusChange,
    onAddNote,
    onUploadDocument,
    onDeleteDocument,
    onDownloadDocument,
    onUpdateTask,
    onUpdateNote,
    canUpdateTask = true,
    onMarkAsCompleted,
}) => {
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editText, setEditText] = useState("");

    // On admin side
    const { selectedBusiness } = useSelector((state) => state.business || {});
    //On client side
    const { businessDetails } = useSelector((state) => state.business || {});
    const authUser = useSelector((state) => state.auth?.user);
    const businessName =
        businessDetails?.name ||
        selectedBusiness?.name ||
        "Business";

    // Determine user role - User and SuperUser cannot change status
    const userRole = String(authUser?.role || "").toLowerCase();
    const isAdmin = ["admin", "super admin", "superadmin"].includes(userRole);
    const isUserOrSuperUser = ["user", "superuser", "super user"].includes(userRole);
    const canEditStatus = isAdmin; // Only admins can edit status

    // Helper: show "ATS" for Admin/SuperAdmin, else business name
    const getOrgLabelByRole = (roleRaw) => {
        const role = String(roleRaw || "").toLowerCase();

        if (role === "superadmin" || role === "super admin" || role === "admin") {
            return "ATS";
        }
        if (role === "superuser" || role === "super user" || role === "user") {
            return businessName;
        }
        return businessName; // fallback
    };

    const safeUpdateTask = (taskId, payload) => {
        if (!canUpdateTask) return;
        onUpdateTask?.(taskId, payload);
    };

    const startEdit = (note) => {
        setEditingNoteId(note.id);
        setEditText(note.content || "");
    };

    const cancelEdit = () => {
        setEditingNoteId(null);
        setEditText("");
    };

    const saveEdit = async () => {
        if (!editingNoteId) return;
        if (!editText.trim()) return;

        await onUpdateNote?.(task.id, editingNoteId, editText.trim());
        cancelEdit();
    };

    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(task.status || "Not Started");
    const [noteText, setNoteText] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [docError, setDocError] = useState("");

    const [markingAsCompleted, setMarkingAsCompleted] = useState(false);
    
    const [reflectionAnswer, setReflectionAnswer] = useState(task.reflection_answer || "");
    const [checklistState, setChecklistState] = useState(task.checklist_state || []);

    const handleMarkAsCompleted = async () => {
        if (!onMarkAsCompleted) {
            toast.error("Mark as completed function not available");
            return;
        }

        setMarkingAsCompleted(true);
        try {
            await onMarkAsCompleted(task);
        } catch (error) {
            toast.error(error?.message || "Failed to mark as completed");
        } finally {
            setMarkingAsCompleted(false);
        }
    };

    const buildChecklistState = (task) => {
        const base = (task.checklist || []).map((label, idx) => ({
            key: String(idx),
            label: String(label || ""),
            checked: false,
            checked_at: null,
        }));

        const saved = Array.isArray(task.checklist_state) ? task.checklist_state : [];

        return base.map((b, idx) => {
            const s = saved.find((x) => x?.key === b.key) || saved[idx] || {};
            return { ...b, checked: !!s.checked, checked_at: s.checked_at || null };
        });
    };

    useEffect(() => {
        setChecklistState(buildChecklistState(task));
        setReflectionAnswer(task.reflection_answer || "");
    }, [task]);

    useEffect(() => {
        setStatus(task.status || "Not Started");
    }, [task.status]);

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        onStatusChange(task.id, newStatus);
    };

    const handleAddNote = () => {
        if (!noteText.trim()) return;
        onAddNote(task.id, noteText.trim());
        setNoteText("");
    };

    const validateFile = (file) => {
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
        if (file.size > MAX_FILE_SIZE) throw new Error("File size must be less than 50MB");
        if (!ALLOWED_FILE_TYPES[file.type]) {
            throw new Error("File type not supported. Please upload PDF, Word, Image, or Text files.");
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        setDocError("");
        setSelectedFile(null);
        setUploadProgress(0);

        if (!file) return;

        try {
            validateFile(file);
            setSelectedFile(file);
        } catch (err) {
            setDocError(err.message);
        }
    };

    const handleUploadDocClick = async () => {
        if (!selectedFile || !onUploadDocument) return;

        setUploading(true);
        setDocError("");
        setUploadProgress(0);

        try {
            await onUploadDocument(
                task.id,
                selectedFile,
                (p) => setUploadProgress(p),
                (errMsg) => setDocError(errMsg),
                () => {
                    setSelectedFile(null);
                    setUploadProgress(100);
                    setTimeout(() => setUploadProgress(0), 1500);
                }
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full px-5 py-3 bg-primary text-left text-dark-text"
                aria-expanded={open}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/10">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-base sm:text-lg">{task.title}</h4>
                            {task.completed_at && (
                                <p className="text-xs text-white/80 mt-1">
                                    Completed on {new Date(task.completed_at).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <label className="text-white text-sm" htmlFor={`status-${task.id}`}>
                                Status
                            </label>
                            <select
                                id={`status-${task.id}`}
                                value={status}
                                onChange={handleStatusChange}
                                disabled={!canEditStatus}
                                className={`bg-white/10 text-white text-sm rounded-lg px-2 py-1 border border-white/20 ${
                                    !canEditStatus ? "cursor-not-allowed opacity-60" : ""
                                }`}
                            >
                                <option className="text-light-text">Not Started</option>
                                <option className="text-light-text">In Progress</option>
                                <option className="text-light-text">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>
            </button>

            {/* Collapsible body */}
            {open && (
                <div className="p-5 space-y-4">
                    {/* Main instruction bar */}
                    <div className="rounded-xl border overflow-hidden">
                        <div className="px-4 py-3 font-semibold text-white bg-primary">Client Responsibility</div>
                        <div className="px-4 pt-3 text-md font-semibold  text-neutral-700 dark:text-neutral-300 border-t ">
                            {task.client}
                        </div>
                        <div className="px-4 pb-3 pt-1 text-sm text-neutral-700 dark:text-neutral-300 border-b">
                            {task.vibe}
                        </div>
                        <div className="px-4 py-3 space-y-2">
                            {checklistState?.map((c, i) => (
                                <label key={c.key || i} className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={!!c.checked}
                                        disabled={!canUpdateTask}
                                        onChange={(e) => {
                                            if (!canUpdateTask) return;
                                            const checked = e.target.checked;

                                            const next = checklistState.map((x, idx) =>
                                                idx === i
                                                    ? {
                                                        ...x,
                                                        label: x.label || (task.checklist?.[idx] ?? ""),
                                                        checked,
                                                        checked_at: checked ? new Date().toISOString() : null,
                                                    }
                                                    : x
                                            );

                                            setChecklistState(next);
                                            safeUpdateTask(task.id, { checklist_state: next });
                                        }}
                                    />
                                    <span>{c.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Client Brand Reflection */}
                    <div className="rounded-xl border overflow-hidden">
                        <div className="px-4 py-3 font-semibold text-white bg-primary">Client Brand Reflection</div>
                        <div className="px-4 py-2 text-xs text-neutral-600 dark:text-neutral-400">{task.reflectionQ}</div>
                        <div className="px-4 pb-4">
                            <textarea
                                value={reflectionAnswer}
                                onChange={(e) => canUpdateTask && setReflectionAnswer(e.target.value)}
                                readOnly={!canUpdateTask}
                                disabled={!canUpdateTask}
                                placeholder="Type your reflection here…"
                                className={`w-full rounded-lg border p-3 text-light-text ${!canUpdateTask ? "bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed" : ""
                                    }`}
                                rows={3}
                            />

                            <div className="px-4 pb-4 flex justify-end">
                                {canUpdateTask && (
                                    <Button
                                        onClick={() => safeUpdateTask(task.id, { reflection_answer: reflectionAnswer })}
                                        disabled={!canUpdateTask}
                                        className="px-4 py-2 rounded-lg text-white bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Save
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ATS Responsibilities */}
                    <div className="rounded-xl border overflow-hidden">
                        <div className="px-4 py-3 font-semibold text-white bg-primary">Aitek Solutions Responsibilities</div>
                        <div className="px-4 py-3 text-sm">{task.woa}</div>
                    </div>

                    {/* Collaboration / Notes */}
                    <div className="rounded-xl border overflow-hidden">
                        <div className="px-4 py-3 font-semibold text-white flex items-center justify-between bg-primary">
                            <span>Collaboration / Notes</span>
                            <span className="text-white/80 text-xs">
                                (Please identify notes as “X Practice” or “ATS Brand Ambassador”.)
                            </span>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Write a note…"
                                    className="flex-1 border rounded-lg px-3 py-2 text-light-text"
                                />
                                <button onClick={handleAddNote} className="px-4 py-2 rounded-lg text-white bg-primary">
                                    Add
                                </button>
                            </div>

                            {notes?.length > 0 && (
                                <div className="space-y-2">
                                    {notes.map((n) => {
                                        const authorName = n.author?.full_name || "Unknown";
                                        const editorName = n.editor?.full_name || "Unknown";

                                        // ✅ decide label from role (prefer n.author.role, fallback to n.author_type)
                                        const authorRole = n.author?.role || n.author_type;
                                        const orgLabel = getOrgLabelByRole(authorRole);

                                        const isEditing = editingNoteId === n.id;

                                        return (
                                            <div key={n.id} className="border rounded-lg p-3 text-sm">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="text-xs text-neutral-600">
                                                        <span className="font-semibold">{authorName}</span>
                                                        {/* ✅ removed role, show org label only */}
                                                        <span className="ml-2 text-neutral-500">({orgLabel})</span>

                                                        <div className="text-[11px] text-neutral-500 mt-1">
                                                            Created: {n.created_at ? new Date(n.created_at).toLocaleString() : "-"}
                                                        </div>

                                                        {n.edited_at && (
                                                            <div className="text-[11px] text-neutral-500">
                                                                Edited by {editorName} • {new Date(n.edited_at).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button className="text-xs underline" onClick={() => startEdit(n)}>
                                                        Edit
                                                    </button>
                                                </div>

                                                {!isEditing ? (
                                                    <div className="mt-2">{n.content}</div>
                                                ) : (
                                                    <div className="mt-2 space-y-2">
                                                        <textarea
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            className="w-full rounded-lg border p-2 text-light-text"
                                                            rows={3}
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={cancelEdit} className="px-3 py-1 rounded-lg border text-sm">
                                                                Cancel
                                                            </button>
                                                            <button onClick={saveEdit} className="px-3 py-1 rounded-lg bg-primary text-white text-sm">
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Task Documents */}
                    <div className="rounded-xl border overflow-hidden">
                        <div className="px-4 py-3 font-semibold text-white bg-primary flex items-center justify-between">
                            <span>Task Documents</span>
                            <span className="text-xs text-white/80">Attach deliverables & references for this task.</span>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm cursor-pointer ">
                                    <span>Choose file</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        accept={getAcceptedFileExtensions()}
                                    />
                                </label>

                                {selectedFile && (
                                    <div className="flex-1 text-xs text-neutral-600 dark:text-neutral-300">
                                        <div className="font-medium">{selectedFile.name}</div>
                                        <div>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                )}

                                <button
                                    onClick={handleUploadDocClick}
                                    disabled={!selectedFile || uploading}
                                    className="px-4 py-2 rounded-lg text-white bg-primary disabled:bg-primary/50 text-sm"
                                >
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>

                            {(uploadProgress > 0 || docError) && (
                                <div className="space-y-1">
                                    {uploadProgress > 0 && uploading && (
                                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                                            <div className="h-1.5 bg-primary" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                    )}
                                    {docError && <div className="text-xs text-red-500">{docError}</div>}
                                </div>
                            )}

                            {documents?.length > 0 ? (
                                <div className="space-y-2">
                                    {documents.map((doc) => {
                                        const uploaderName = doc?.uploader?.full_name || "Unknown";

                                        // ✅ decide label from uploader role
                                        const uploaderRole = doc?.uploader?.role;
                                        const orgLabel = getOrgLabelByRole(uploaderRole);

                                        return (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{doc.original_name || doc.file_name}</span>

                                                    <span className="text-xs text-neutral-500">
                                                        {(doc.file_size / 1024).toFixed(1)} KB • {ALLOWED_FILE_TYPES[doc.mime_type] || doc.mime_type}
                                                    </span>

                                                    {/* ✅ removed role, show org label only */}
                                                    <span className="text-[11px] text-neutral-500 mt-1">
                                                        Uploaded by{" "}
                                                        <span className="font-medium text-neutral-700 dark:text-neutral-200">{uploaderName}</span>{" "}
                                                        <span className="text-neutral-500">({orgLabel})</span>
                                                        {doc.createdAt && <> • {new Date(doc.createdAt).toLocaleString()}</>}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="text-xs underline"
                                                        onClick={() =>
                                                            onDownloadDocument && onDownloadDocument(doc.id, doc.original_name || doc.file_name)
                                                        }
                                                    >
                                                        Download
                                                    </button>
                                                    <button
                                                        className="text-xs text-red-500 underline"
                                                        onClick={() => onDeleteDocument && onDeleteDocument(task.id, doc.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-xs text-neutral-500 italic">No documents uploaded for this task yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Mark as Completed Button - Only for Users/SuperUsers */}
                    {isUserOrSuperUser && (
                        <div className="flex justify-end pt-4 border-t">
                            <button
                                onClick={handleMarkAsCompleted}
                                disabled={markingAsCompleted || status !== "In Progress"}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                                    status === "In Progress"
                                        ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-600/50"
                                        : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                }`}
                                title={status !== "In Progress" ? "Task must be in progress to mark as completed" : "Notify admin that you have completed this task"}
                            >
                                {markingAsCompleted ? "Notifying..." : "Mark as Completed"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default TaskCard;
