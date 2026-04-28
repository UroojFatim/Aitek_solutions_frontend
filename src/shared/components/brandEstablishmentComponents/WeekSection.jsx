import React from "react";
import TaskCard from "./TaskCard";

const WeekSection = ({
    week,
    notesByTaskId,
    taskDocumentsByTaskId,
    onStatusChange,
    onAddNote,
    onUploadDocument,
    onDeleteDocument,
    onDownloadDocument,
    onUpdateTask,
    onUpdateNote,
    onMarkAsCompleted,
    canUpdateTask = true,
}) => {
    return (
        <section
            key={week.id || week.week_number}
            className="space-y-4 border-l-4 border-primary/40 pl-4"
        >
            {/* Week header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h2 className="text-lg font-semibold">Week {week.week_number}</h2>
                    {week.week_enabled_at && (
                        <p className="text-xs text-neutral-500">
                            Enabled at: {new Date(week.week_enabled_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Tasks */}
            <div className="space-y-4">
                {week.tasks?.map((t) => (
                    <TaskCard
                        key={t.id}
                        task={t}
                        onUpdateTask={onUpdateTask}
                        notes={notesByTaskId[t.id]?.items || []}
                        documents={taskDocumentsByTaskId[t.id]?.items || []}
                        onStatusChange={onStatusChange}
                        onAddNote={onAddNote}
                        onUploadDocument={onUploadDocument}
                        onDeleteDocument={onDeleteDocument}
                        onDownloadDocument={onDownloadDocument}
                        onUpdateNote={onUpdateNote}
                        onMarkAsCompleted={onMarkAsCompleted}
                        canUpdateTask={canUpdateTask}
                    />
                ))}

                {(!week.tasks || week.tasks.length === 0) && (
                    <div className="text-sm text-neutral-500 italic">No tasks configured for this week yet.</div>
                )}
            </div>
        </section>
    );
};

export default WeekSection;
