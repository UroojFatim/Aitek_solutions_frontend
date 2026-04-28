import React, { useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';
import DownloadSections from "@/pages/admin/accounts/components/DownloadSections";
import { updateBusinessSection, fetchBusinessStepDetails } from '@/redux/actions/onboarding.actions';

const ViewStepDetailsModal = ({ open, handleOpen, stepId, businessId }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formState, setFormState] = React.useState({});
  const [initialState, setInitialState] = React.useState({});
  const { businessStepDetails } = useSelector((state) => state.onboarding);

  const { step, sections } = businessStepDetails || {};

  useEffect(() => {
    if (sections?.length > 0) {
      setActiveTab(sections[0].section_name);

      const nextState = sections.reduce((acc, section) => {
        const answers = {};
        (section.questions || []).forEach((q) => {
          answers[q.field_name] = q.answer ?? '';
        });
        acc[section.section_name] = answers;
        return acc;
      }, {});

      setFormState(nextState);
      setInitialState(nextState);
      setIsEditing(false);
    }
  }, [sections]);

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setIsSaving(false);
    }
  }, [open]);

  const formatSectionName = (name) => {
    return name.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleInputChange = (sectionName, fieldName, value) => {
    setFormState((prev) => ({
      ...prev,
      [sectionName]: {
        ...(prev[sectionName] || {}),
        [fieldName]: value,
      },
    }));
  };

  const handleCheckboxToggle = (sectionName, fieldName, optionValue, checkedValues) => {
    const next = new Set(Array.isArray(checkedValues) ? checkedValues : []);
    if (next.has(optionValue)) {
      next.delete(optionValue);
    } else {
      next.add(optionValue);
    }
    handleInputChange(sectionName, fieldName, Array.from(next));
  };

  const resetEdits = () => {
    setFormState(initialState);
    setIsEditing(false);
  };

  const sanitizeSectionPayload = (section, data) => {
    if (!section || !data) return data || {};

    const cleaned = {};
    (section.questions || []).forEach((q) => {
      let value = data[q.field_name];

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (value === '') {
        value = null;
      }

      if (q.field_type === 'tel' && typeof value === 'string') {
        const digitsOnly = value.replace(/\D/g, '');
        value = digitsOnly.length ? digitsOnly : null;
      }

      if (q.field_type === 'email' && typeof value === 'string') {
        value = value || null;
      }

      cleaned[q.field_name] = value;
    });

    return cleaned;
  };

  const handleSave = async () => {
    if (!activeTab || !businessId) return;

    const currentSection = sections?.find((s) => s.section_name === activeTab);
    const rawPayload = formState[activeTab] || {};
    const sanitizedPayload = sanitizeSectionPayload(currentSection, rawPayload);

    try {
      setIsSaving(true);
      await dispatch(updateBusinessSection({
        sectionName: activeTab,
        businessId,
        data: sanitizedPayload,
      })).unwrap();

      await dispatch(fetchBusinessStepDetails({ stepId, businessId })).unwrap();
      setIsEditing(false);
      toast.success('Saved');
    } catch (error) {
      console.error('Failed to save section', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFormattedAnswer = (question) => {
    if (question.answer === null || question.answer === undefined || question.answer === '') return 'Not answered';

    switch (question.field_type) {
      case 'radio':
      case 'text':
      case 'textarea':
      case 'tel':
      case 'email':
      case 'url':
      case 'date':
        return question.answer;
      case 'checkbox':
        return Array.isArray(question.answer)
          ? question.answer.join(', ')
          : question.answer;
      case 'boolean':
        return question.answer ? 'Yes' : 'No';
      case 'table':
        try {
          return typeof question.answer === 'string'
            ? question.answer
            : JSON.stringify(question.answer, null, 2);
        } catch (e) {
          return 'Invalid table data';
        }
      default:
        return String(question.answer);
    }
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
            {step?.title}
          </Typography>
          {step?.subtitle && (
            <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted mt-1">
              {step?.subtitle}
            </Typography>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DownloadSections
            sections={sections || []}
            headerTitle={step?.title}
            headerSubtitle={step?.subtitle}
            headerDescription={""} // or some description if you add one
            fileBaseName={step?.title}
            getAnswerText={getFormattedAnswer}
          />
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetEdits}
                className="px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90"
            >
              Edit
            </button>
          )}
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
          <div className="flex space-x-2 border-b border-light-border dark:border-dark-border">
            {sections?.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.section_name)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === section.section_name
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-light-muted dark:text-dark-muted hover:text-primary'
                  }`}
              >
                {formatSectionName(section.section_name)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {sections?.map((section) => (
            <div
              key={section.id}
              className={`space-y-6 ${activeTab === section.section_name ? 'block' : 'hidden'
                }`}
            >
              {section.questions
                .filter(q => q.field_type !== 'table')
                .map((question, idx) => {
                  const currentValue = formState[section.section_name]?.[question.field_name];
                  const optionList = question.options || [];

                  const renderInput = () => {
                    if (!isEditing) {
                      return (
                        <Typography className="text-light-muted dark:text-dark-muted whitespace-pre-wrap">
                          {getFormattedAnswer(question)}
                        </Typography>
                      );
                    }

                    switch (question.field_type) {
                      case 'textarea':
                        return (
                          <textarea
                            className="w-full rounded border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-2 text-light-text dark:text-dark-text"
                            value={currentValue ?? ''}
                            onChange={(e) => handleInputChange(section.section_name, question.field_name, e.target.value)}
                            rows={3}
                          />
                        );
                      case 'radio':
                        return (
                          <div className="flex flex-col gap-2">
                            {optionList.map((opt, i) => {
                              const value = typeof opt === 'object' ? opt.value : opt;
                              const label = typeof opt === 'object' ? opt.label : opt;
                              return (
                                <label key={i} className="flex items-center gap-2 text-light-text dark:text-dark-text">
                                  <input
                                    type="radio"
                                    className="h-4 w-4"
                                    checked={currentValue === value}
                                    onChange={() => handleInputChange(section.section_name, question.field_name, value)}
                                  />
                                  <span>{label}</span>
                                </label>
                              );
                            })}
                          </div>
                        );
                      case 'checkbox': {
                        const checkedValues = Array.isArray(currentValue) ? currentValue : [];
                        return (
                          <div className="flex flex-col gap-2">
                            {optionList.map((opt, i) => {
                              const value = typeof opt === 'object' ? opt.value : opt;
                              const label = typeof opt === 'object' ? opt.label : opt;
                              return (
                                <label key={i} className="flex items-center gap-2 text-light-text dark:text-dark-text">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={checkedValues.includes(value)}
                                    onChange={() => handleCheckboxToggle(section.section_name, question.field_name, value, checkedValues)}
                                  />
                                  <span>{label}</span>
                                </label>
                              );
                            })}
                          </div>
                        );
                      }
                      case 'boolean':
                        return (
                          <select
                            className="w-full rounded border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-2 text-light-text dark:text-dark-text"
                            value={currentValue === true ? 'true' : currentValue === false ? 'false' : ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleInputChange(section.section_name, question.field_name, val === '' ? '' : val === 'true');
                            }}
                          >
                            <option value="">Select</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        );
                      case 'date':
                        return (
                          <input
                            type="date"
                            className="w-full rounded border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-2 text-light-text dark:text-dark-text"
                            value={(currentValue || '').slice(0, 10)}
                            onChange={(e) => handleInputChange(section.section_name, question.field_name, e.target.value)}
                          />
                        );
                      default:
                        return (
                          <input
                            type="text"
                            className="w-full rounded border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-2 text-light-text dark:text-dark-text"
                            value={currentValue ?? ''}
                            onChange={(e) => handleInputChange(section.section_name, question.field_name, e.target.value)}
                          />
                        );
                    }
                  };

                  return (
                    <div
                      key={idx}
                      className="border-b border-light-border dark:border-dark-border pb-4 last:border-b-0"
                    >
                      <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                        {question.question}
                      </Typography>
                      {renderInput()}
                    </div>
                  );
                })}

              {section.section_name === 'team_details' && section.employees && section.employees.length > 0 && (
                <div className="pt-4">
                  <Typography variant="h5" className="text-light-text dark:text-dark-text mb-4 pb-2 border-b border-light-border dark:border-dark-border">
                    Team Members Information
                  </Typography>
                  <div className="space-y-4">
                    {section.employees.map((employee) => (
                      <div key={employee.id} className="p-4 bg-light-background dark:bg-dark-background rounded-lg border border-light-border dark:border-dark-border">
                        {employee.details.map((detail, detailIdx) => (
                          <div key={detailIdx} className="flex items-start mb-2 last:mb-0">
                            <Typography
                              as="span"
                              className="font-semibold text-light-text dark:text-dark-text w-1/3"
                            >
                              {detail.question}:
                            </Typography>
                            <Typography
                              as="span"
                              className="ml-2 text-light-muted dark:text-dark-muted w-2/3"
                            >
                              {detail.answer || 'Not provided'}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.section_name === 'market_analysis' && section.competitors && section.competitors.length > 0 && (
                <div className="pt-4">
                  <Typography variant="h5" className="text-light-text dark:text-dark-text mb-4 pb-2 border-b border-light-border dark:border-dark-border">
                   Competitors Details
                  </Typography>
                  <div className="space-y-4">
                    {section.competitors.map((competitor) => (
                      <div key={competitor.id} className="p-4 bg-light-background dark:bg-dark-background rounded-lg border border-light-border dark:border-dark-border">
                        {competitor.details.map((detail, detailIdx) => (
                          <div key={detailIdx} className="flex items-start mb-2 last:mb-0">
                            <Typography
                              as="span"
                              className="font-semibold text-light-text dark:text-dark-text w-1/3"
                            >
                              {detail.question}:
                            </Typography>
                            <Typography
                              as="span"
                              className="ml-2 text-light-muted dark:text-dark-muted w-2/3"
                            >
                              {detail.answer || 'Not provided'}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ViewStepDetailsModal; 