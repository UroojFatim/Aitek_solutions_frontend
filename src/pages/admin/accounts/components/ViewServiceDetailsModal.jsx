import React, { useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useSelector, useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { fetchBusinessServiceDetails } from "@/redux/actions/serviceOnboarding.actions";
import { updateSectionAnswers } from "@/redux/actions/serviceOnboarding.actions";
import DownloadSections from "@/pages/admin/accounts/components/DownloadSections";

const ViewServiceDetailsModal = ({ open, handleOpen, serviceId, businessId }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState(null);
  const [editingSectionId, setEditingSectionId] = React.useState(null);
  const [formState, setFormState] = React.useState({});

  const { businessServiceDetails, isSavingSection } = useSelector(
    (state) => state.service_onboarding
  );
  const { service, sections } = businessServiceDetails || {};

  useEffect(() => {
    if (sections?.length) setActiveTab(sections[0].section_name);
  }, [sections]);

  useEffect(() => {
    if (open && serviceId && businessId) {
      dispatch(fetchBusinessServiceDetails({ serviceId, businessId }));
    }
  }, [open, serviceId, businessId, dispatch]);

  const formatSectionName = (name) =>
    String(name || "")
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const editableSectionNames = new Set([
    "full_arch_implants_faqs",
    "appointment_consultation_faqs",
    "single_implant_faqs",
  ]);

  const startSectionEdit = (section) => {
    const initial = {};
    (section.questions || []).forEach((q) => {
      initial[q.field_name] = q.answer ?? (q.field_type === "checkbox" ? [] : "");
    });
    setEditingSectionId(section.id);
    setFormState(initial);
  };

  const cancelSectionEdit = () => {
    setEditingSectionId(null);
    setFormState({});
  };

  const saveSection = async (section) => {
    try {
      await dispatch(
        updateSectionAnswers({
          serviceId,
          businessId,
          sectionId: section.id,
          answers: formState,
        })
      ).unwrap?.();
      cancelSectionEdit();
    } catch (e) {
      console.error(e);
    }
  };

  const normalizeOptions = (opts) => {
    if (!opts) return [];
    if (Array.isArray(opts)) return opts;
    if (typeof opts === "string")
      return opts.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const renderInput = (q) => {
    const name = q.field_name;
    const value = formState[name];
    const set = (v) => setFormState((s) => ({ ...s, [name]: v }));

    switch (q.field_type) {
      case "textarea":
        return (
          <textarea
            value={value ?? ""}
            onChange={(e) => set(e.target.value)}
            className="w-full p-2 border rounded bg-light-surface dark:bg-dark-surface"
            rows={4}
          />
        );
      case "radio": {
        const options = normalizeOptions(q.options);
        return (
          <div className="flex flex-wrap gap-3">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={value === opt}
                  onChange={() => set(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      }
      case "checkbox": {
        const options = normalizeOptions(q.options);
        const arr = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-3">
            {options.map((opt) => {
              const checked = arr.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) set([...arr, opt]);
                      else set(arr.filter((x) => x !== opt));
                    }}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        );
      }
      case "date":
        return (
          <input
            type="date"
            value={value ?? ""}
            onChange={(e) => set(e.target.value)}
            className="w-full p-2 border rounded bg-light-surface dark:bg-dark-surface"
          />
        );
      case "email":
      case "tel":
      case "url":
      case "text":
      default:
        return (
          <input
            value={value ?? ""}
            onChange={(e) => set(e.target.value)}
            className="w-full p-2 border rounded bg-light-surface dark:bg-dark-surface"
          />
        );
    }
  };

  const getAnswerText = (q) => {
    if (q.answer == null || q.answer === "")
      return "Not answered";
    if (Array.isArray(q.answer)) return q.answer.join(", ");
    return String(q.answer);
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
      className="!bg-light-surface dark:!bg-dark-surface"
    >
      <DialogHeader className="flex justify-between items-start border-b border-light-border dark:border-dark-border">
        <div className="flex-1">
          <Typography variant="h4" className="text-light-text dark:text-dark-text">
            {service?.name}
          </Typography>
          {service?.title && (
            <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted mt-1">
              {service?.title}
            </Typography>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Download ONE combined PDF (flowing sections, highlighted headers) */}
          <DownloadSections
            sections={sections || []}
            headerTitle={service?.name}
            headerSubtitle={service?.title}
            headerDescription={service?.description}
            fileBaseName={service?.name}
            getAnswerText={getAnswerText}
          />
          {/* Close */}
          <IconButton
            variant="text"
            size="sm"
            onClick={handleOpen}
            className="text-light-muted dark:text-dark-muted hover:text-primary"
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </DialogHeader>

      <DialogBody className="overflow-y-auto max-h-[70vh]">
        <div className="flex flex-col space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-light-border dark:border-dark-border">
            {sections?.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.section_name)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === section.section_name
                    ? "text-primary border-b-2 border-primary"
                    : "text-light-muted dark:text-dark-muted hover:text-primary"
                  }`}
              >
                {formatSectionName(section.section_name)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {sections?.map((section) => {
            const sectionEditable = editableSectionNames.has(section.section_name);
            const isEditing = editingSectionId === section.id;

            return (
              <div
                key={section.id}
                className={`${activeTab === section.section_name ? "block" : "hidden"} space-y-6`}
              >
                <div className="flex justify-end gap-2">
                  {sectionEditable && !isEditing && (
                    <button
                      type="button"
                      onClick={() => startSectionEdit(section)}
                      className="text-sm px-3 py-1 rounded bg-primary text-white hover:opacity-90"
                    >
                      Edit Section
                    </button>
                  )}
                  {sectionEditable && isEditing && (
                    <>
                      <button
                        type="button"
                        disabled={isSavingSection}
                        onClick={() => saveSection(section)}
                        className="text-sm px-3 py-1 rounded bg-primary text-white hover:opacity-90 disabled:opacity-60"
                      >
                        {isSavingSection ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelSectionEdit}
                        className="text-sm px-3 py-1 rounded border dark:text-dark-text text-light-text border-primary"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>

                {(section.questions || [])
                  .filter((q) => q.field_type !== "table")
                  .map((q, idx) => (
                    <div
                      key={idx}
                      className="border-b border-light-border dark:border-dark-border pb-4 last:border-b-0"
                    >
                      <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                        {q.question}
                      </Typography>

                      {!isEditing ? (
                        <Typography className="text-light-muted dark:text-dark-muted whitespace-pre-wrap">
                          {q.answer == null || q.answer === ""
                            ? "Not answered"
                            : Array.isArray(q.answer)
                              ? q.answer.join(", ")
                              : String(q.answer)}
                        </Typography>
                      ) : (
                        renderInput(q)
                      )}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ViewServiceDetailsModal;
