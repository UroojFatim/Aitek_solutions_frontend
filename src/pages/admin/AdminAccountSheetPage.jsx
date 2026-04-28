import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import { fetchBusinesses, fetchBusinessById } from "@/redux/actions/business.actions";
import { fetchServices, fetchBusinessServiceDetails, updateSectionAnswers } from "@/redux/actions/serviceOnboarding.actions";
import { ROUTE_NAMES } from "@/constants/routes.constants";
import sheetService from "@/services/sheets.service";
import Table from "@/shared/components/table/Table";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import GoogleSheetsSetup from "@/pages/admin/GoogleSheetsSetup";

const label =
  "text-sm font-medium block mb-1 text-light-text dark:text-dark-text";
const inputBase =
  "border rounded-lg px-3 py-2 w-64 bg-light-surface dark:bg-dark-surface " +
  "border-light-border dark:border-dark-border text-light-text dark:text-dark-text " +
  "placeholder:text-light-muted dark:placeholder:text-dark-muted";

const AdminBusinessSheets = () => {
  const dispatch = useDispatch();

  const { businesses = [], selectedBusiness } = useSelector((s) => s.business || {});

  const [selectedAccount, setSelectedAccount] = useState(selectedBusiness?.id || "");
  const [activeTab, setActiveTab] = useState("booked");

  const [bookedRows, setBookedRows] = useState([]);
  const [leadRows, setLeadRows] = useState([]);

  const [loadingTrackers, setLoadingTrackers] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [noSheet, setNoSheet] = useState(false);

  // -- Admin: All created sheets table --
  const [allSheets, setAllSheets] = useState([]);
  const selectedSheetRecord = useMemo(() => {
    if (!selectedAccount) return null;

    // pick the "most relevant" record for this business:
    // prefer active, then inactive, then deleted
    const list = allSheets.filter((s) => s.business_id === selectedAccount);
    return (
      list.find((s) => s.status === "active") ||
      list.find((s) => s.status === "inactive") ||
      list.find((s) => s.status === "deleted") ||
      null
    );
  }, [allSheets, selectedAccount]);
  const selectedSheetStatus = selectedSheetRecord?.status || null;

  const [loadingAllSheets, setLoadingAllSheets] = useState(false);
  const [showAllSheets, setShowAllSheets] = useState(false);
  const [showDeletedSheets, setShowDeletedSheets] = useState(false);

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    tone: "primary", // "primary" | "danger" | "warning"
    confirmText: "Confirm",
    cancelText: "Cancel",
    loading: false,
    onConfirm: null,
  });
  const toneStyles = {
    primary: {
      chip: "bg-primary/15 text-primary border border-primary/40",
      btnSolid: "bg-primary text-white hover:opacity-90",
      btnOutline: "border border-primary text-primary hover:bg-primary/10",
    },
    success: {
      chip: "bg-green-500/15 text-green-500 border border-green-500/40",
      btnSolid: "bg-green-600 text-white hover:bg-green-700",
      btnOutline: "border border-green-600 text-green-600 hover:bg-green-600/10",
    },
    danger: {
      chip: "bg-red-500/15 text-red-500 border border-red-500/40",
      btnSolid: "bg-red-600 text-white hover:bg-red-700",
      btnOutline: "border border-red-600 text-red-600 hover:bg-red-600/10",
    },
  };
  const openConfirm = ({
    title,
    message,
    tone = "primary",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
  }) => {
    setConfirmState({
      open: true,
      title,
      message,
      tone,
      confirmText,
      cancelText,
      loading: false,
      onConfirm,
    });
  };
  const closeConfirm = () => {
    setConfirmState((s) => ({ ...s, open: false, loading: false, onConfirm: null }));
  };


  const fetchAllSheets = async () => {
    setLoadingAllSheets(true);
    try {
      const res = await sheetService.getAllUserSheets();
      let records = [];
      if (Array.isArray(res)) records = res;
      else if (Array.isArray(res?.data)) records = res.data;
      else if (Array.isArray(res?.data?.data)) records = res.data.data;
      else if (res?.success && Array.isArray(res.data)) records = res.data;

      setAllSheets(records);
    } catch (err) {
      console.error('fetchAllSheets error:', err?.response || err);
    } finally {
      setLoadingAllSheets(false);
    }
  };

  useEffect(() => {
    fetchAllSheets();
  }, []);

  const sheetColumns = [
    {
      header: 'Business',
      accessor: 'business',
      render: (row) => (
        <div>
          <div className="font-semibold">{row.business?.name || '—'}</div>
          <div className="text-xs text-light-muted dark:text-dark-muted">{row.business?.email || '—'}</div>
        </div>
      ),
    },
    {
      header: 'Sheet',
      accessor: 'sheet',
      render: (row) => (
        <div>
          <div className="text-xs break-all"><a href={row.spreadsheet_url} target="_blank" rel="noreferrer" className="text-indigo-400">{row.spreadsheet_url}</a></div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const isActive = (row.status || "inactive") === "active";
        return (
          <select
            value={row.status || "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className={[
              "px-2 py-1 rounded-md text-xs font-medium border outline-none",
              "bg-light-surface dark:bg-dark-surface",
              "text-light-text dark:text-dark-text",
              "border-light-border dark:border-dark-border",
              isActive ? toneStyles.success.chip : toneStyles.primary.chip,
            ].join(" ")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        );
      },
    },
    {
      header: 'Created',
      accessor: 'created_at',
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDeleteSheet(row)}
          className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      ),
    },
  ];

  const deletedSheetColumns = [
    {
      header: 'Business',
      accessor: 'business',
      render: (row) => (
        <div>
          <div className="font-semibold">{row.business?.name || '—'}</div>
          <div className="text-xs text-light-muted dark:text-dark-muted">{row.business?.email || '—'}</div>
        </div>
      ),
    },
    {
      header: 'Sheet',
      accessor: 'sheet',
      render: (row) => (
        <div>
          <div className="text-xs break-all"><a href={row.spreadsheet_url} target="_blank" rel="noreferrer" className="text-indigo-400">{row.spreadsheet_url}</a></div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
          Deleted
        </span>
      ),
    },
    {
      header: 'Deleted',
      accessor: 'created_at',
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleRestoreSheet(row)}
          className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition-colors"
        >
          Restore
        </button>
      ),
    },
  ];

  // 1) Fetch all businesses & services on mount
  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchServices());
  }, [dispatch]);

  // Fetch business-scoped answers for Smile Support when business changes
  const services = useSelector((s) => s.service_onboarding?.pages || []);
  const businessServiceDetails = useSelector((s) => s.service_onboarding?.businessServiceDetails || null);
  const isSavingSection = useSelector((s) => s.service_onboarding?.isSavingSection);

  const smileService = services.find((p) => p?.name === ROUTE_NAMES.DASHBOARD.SMILE_SUPPORT);
  const smileServiceId = smileService?.id || null;

  useEffect(() => {
    if (!smileServiceId || !selectedAccount) return;
    dispatch(fetchBusinessServiceDetails({ serviceId: smileServiceId, businessId: selectedAccount }));
  }, [dispatch, smileServiceId, selectedAccount]);

  // 2) If Redux already has a selectedBusiness and we don't, sync it
  useEffect(() => {
    if (selectedBusiness?.id && !selectedAccount) {
      setSelectedAccount(selectedBusiness.id);
    }
  }, [selectedBusiness, selectedAccount]);

  // 3) Keep business details in sync when selection changes (optional)
  useEffect(() => {
    if (selectedAccount) {
      dispatch(fetchBusinessById(selectedAccount));
    }
  }, [dispatch, selectedAccount]);

  const selectedBusinessName = useMemo(() => {
    return businesses.find((b) => b.id === selectedAccount)?.name || "";
  }, [businesses, selectedAccount]);

  // 4) Load trackers for currently selected business
  const [selectedSheetExists, setSelectedSheetExists] = useState(null);

  const loadTrackers = async (businessId) => {
    if (!businessId) return;

    try {
      setLoadingTrackers(true);
      setLocalError(null);
      setNoSheet(false);

      // Check whether a sheet mapping exists for this business
      let sheet = null;
      try {
        sheet = await sheetService.getUserSheet(businessId);
      } catch (e) {
        sheet = null;
      }

      const exists = !!(sheet && sheet.spreadsheet_url);
      setSelectedSheetExists(exists);

      if (!exists) {
        setBookedRows([]);
        setLeadRows([]);
        return;
      }

      const [booked, leads] = await Promise.all([
        sheetService.getBookedForCurrentUser(businessId),
        sheetService.getLeadsForCurrentUser(businessId),
      ]);

      const bookedSafe = Array.isArray(booked) ? booked : [];
      const leadsSafe = Array.isArray(leads) ? leads : [];

      setBookedRows(bookedSafe);
      setLeadRows(leadsSafe);

      // ✅ If both empty -> treat as "no sheet / no data"
      // (You can decide whether empty means "no sheet" or just "no rows".)
      if (bookedSafe.length === 0 && leadsSafe.length === 0) {
        setNoSheet(true);
      }
    } catch (err) {
      console.error("loadTrackers error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load tracker data.";

      setLocalError(msg);
      setBookedRows([]);
      setLeadRows([]);
      setSelectedSheetExists(false);
    } finally {
      setLoadingTrackers(false);
    }
  };

  // 5) Whenever selectedAccount changes, reload trackers
  useEffect(() => {
    if (!selectedAccount) {
      setBookedRows([]);
      setLeadRows([]);
      setLocalError(null);
      setNoSheet(false);
      return;
    }
    loadTrackers(selectedAccount);
  }, [selectedAccount]);

  // 6) Delete a sheet mapping (admin only) — now soft deletes
  const handleDeleteSheet = async (row) => {
    if (!row?.id) return;

    const businessName = row.business?.name || "this business";

    openConfirm({
      title: "Delete Sheet",
      message:
        `Delete the sheet for "${businessName}"?\n\n` +
        `This will mark it as deleted and remove tracker data from the portal view.\n` +
        `You can restore it later.`,
      tone: "danger",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          setConfirmState((s) => ({ ...s, loading: true }));
          setLoadingAllSheets(true);

          await sheetService.deleteUserSheet(row.id);
          await fetchAllSheets();

          if (row.business?.id === selectedAccount) {
            loadTrackers(selectedAccount);
          }

          closeConfirm();
        } catch (err) {
          console.error("Failed to delete sheet:", err?.response || err);
          closeConfirm();
          alert("Failed to delete sheet. Check console for details.");
        } finally {
          setLoadingAllSheets(false);
        }
      },
    });
  };


  // Restore a deleted sheet
  const handleRestoreSheet = async (row) => {
    if (!row?.id) return;

    const businessName = row.business?.name || "this business";

    openConfirm({
      title: "Restore Sheet",
      message:
        `Restore the sheet for "${businessName}"?\n\n` +
        `It will be restored as INACTIVE. You can activate it after restoring.`,
      tone: "primary",
      confirmText: "Restore",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          setConfirmState((s) => ({ ...s, loading: true }));
          setLoadingAllSheets(true);

          await sheetService.restoreUserSheet(row.id);
          await fetchAllSheets();

          if (row.business?.id === selectedAccount) {
            loadTrackers(selectedAccount);
          }

          closeConfirm();
        } catch (err) {
          console.error("Failed to restore sheet:", err?.response || err);
          closeConfirm();
          alert("Failed to restore sheet. Check console for details.");
        } finally {
          setLoadingAllSheets(false);
        }
      },
    });
  };

  // Handle status change with validation and confirmation
  const handleStatusChange = async (row, newStatus) => {
    if (!row?.id || !newStatus) return;

    const businessName = row.business?.name || "this business";
    const statusText = newStatus === "active" ? "Activate" : "Deactivate";

    // If activating, check if another is active for same business
    const activeSheet = newStatus === "active"
      ? allSheets.find(
        (sheet) =>
          sheet.status === "active" &&
          sheet.id !== row.id &&
          sheet.business_id === row.business_id
      )
      : null;

    // Build modal message
    const msgLines = [];
    msgLines.push(`${statusText} this sheet for "${businessName}"?`);

    if (activeSheet) {
      msgLines.push("");
      msgLines.push(
        `Another sheet is already active. If you continue, it will be set to inactive automatically.`
      );
    }

    openConfirm({
      title: `${statusText} Sheet`,
      message: msgLines.join("\n"),
      tone: newStatus === "active" ? "primary" : "warning",
      confirmText: statusText,
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          setConfirmState((s) => ({ ...s, loading: true }));

          setLoadingAllSheets(true);

          // If another sheet is active, deactivate it first
          if (activeSheet) {
            await sheetService.updateSheetStatus(activeSheet.id, "inactive");
          }

          // Now update this row
          await sheetService.updateSheetStatus(row.id, newStatus);

          await fetchAllSheets();

          if (row.business?.id === selectedAccount) {
            loadTrackers(selectedAccount);
          }

          closeConfirm();
        } catch (err) {
          console.error(`Failed to ${statusText.toLowerCase()} sheet:`, err?.response || err);
          // Optional: show inline toast/snackbar instead of alert
          closeConfirm();
          alert(`Failed to ${statusText.toLowerCase()} sheet. Check console for details.`);
        } finally {
          setLoadingAllSheets(false);
        }
      },
    });
  };


  const handleBusinessChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  // const selectedBusinessName =
  //   businesses.find((b) => b.id === selectedAccount)?.name || null;

  // --- FAQ editing state ---
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [formState, setFormState] = useState({});

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
    if (!smileServiceId || !selectedAccount) return;
    try {
      await dispatch(
        updateSectionAnswers({
          serviceId: smileServiceId,
          businessId: selectedAccount,
          sectionId: section.id,
          answers: formState,
        })
      ).unwrap();
      cancelSectionEdit();
    } catch (e) {
      console.error(e);
    }
  };

  const normalizeOptions = (opts) => {
    if (!opts) return [];
    if (Array.isArray(opts)) return opts;
    if (typeof opts === "string")
      return opts
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  };

  // Tabs: which FAQ section is currently active
  const [activeFaqTab, setActiveFaqTab] = useState(null);

  useEffect(() => {
    const faqs = (businessServiceDetails?.sections || []).filter((s) => editableSectionNames.has(s.section_name));
    if (!faqs.length) {
      setActiveFaqTab(null);
      return;
    }
    setActiveFaqTab((prev) => (prev && faqs.some((f) => f.section_name === prev) ? prev : faqs[0].section_name));
  }, [businessServiceDetails?.sections]);

  const formatSectionName = (name) =>
    String(name || "")
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const generatePDFContent = (doc, sections, startY = 20) => {
    let yPos = startY;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const maxWidth = doc.internal.pageSize.width - 2 * margin;

    sections.forEach((section, sectionIdx) => {
      // Section title
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      const sectionTitle = section.section_title || formatSectionName(section.section_name);
      doc.text(sectionTitle, margin, yPos);
      yPos += 10;

      // Questions and answers
      doc.setFontSize(10);
      const questions = (section.questions || []).filter((q) => q.field_type !== "table");

      questions.forEach((q, idx) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        // Question
        doc.setFont(undefined, "bold");
        const questionLines = doc.splitTextToSize(`Q${idx + 1}: ${q.question}`, maxWidth);
        doc.text(questionLines, margin, yPos);
        yPos += questionLines.length * 5 + 2;

        // Answer
        doc.setFont(undefined, "normal");
        const answer = q.answer == null || q.answer === ""
          ? "Not answered"
          : Array.isArray(q.answer)
            ? q.answer.join(", ")
            : String(q.answer);
        const answerLines = doc.splitTextToSize(`A: ${answer}`, maxWidth);
        doc.text(answerLines, margin, yPos);
        yPos += answerLines.length * 5 + 8;
      });

      // Add spacing between sections
      if (sectionIdx < sections.length - 1) {
        yPos += 5;
      }
    });
  };

  const downloadFAQSection = (section) => {
    const doc = new jsPDF();

    // Title page
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(`${selectedBusinessName || "Business"} - FAQ`, 15, 15);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Exported: ${new Date().toLocaleString()}`, 15, 22);

    // Generate content
    generatePDFContent(doc, [section], 35);

    // Save
    const fileName = `${selectedBusinessName || 'business'}_${section.section_name}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const downloadAllFAQs = () => {
    const faqSections = (businessServiceDetails?.sections || []).filter((s) => editableSectionNames.has(s.section_name));
    if (!faqSections.length) return;

    const doc = new jsPDF();

    // Title page
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(`${selectedBusinessName || "Business"} - All FAQs`, 15, 15);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Exported: ${new Date().toLocaleString()}`, 15, 22);

    // Generate content for all sections
    generatePDFContent(doc, faqSections, 35);

    // Save
    const fileName = `${selectedBusinessName || 'business'}_all_faqs_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const allSheetsRef = React.useRef(null);

  return (
    <div className="space-y-6">
      {/* ✅ Dropdown always visible */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 py-3">
        <div>
          <label className={label}>Select Business</label>
          <select
            className={inputBase}
            value={selectedAccount}
            onChange={handleBusinessChange}
          >
            <option value="">— Select a business —</option>
            {businesses.length === 0 && (
              <option value="" disabled>
                No businesses
              </option>
            )}
            {businesses.map((b) => (
              <option key={b?.id} value={b?.id}>
                {b?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 ml-auto text-right">
          <Typography
            variant="small"
            className="text-xs text-light-muted dark:text-dark-muted"
          >
            Records loaded
          </Typography>
          <Typography className="text-sm">
            Booked:{" "}
            <span className="font-semibold">{bookedRows.length}</span> · Leads:{" "}
            <span className="font-semibold">{leadRows.length}</span>
          </Typography>

          {/* If selected business has no sheet mapping, call it out */}
          {/* Sheet status banner (no ugly deleted text) */}

          {selectedAccount && (
            <>
              {selectedSheetStatus == null && selectedSheetExists === false && (
                <Typography variant="small" className="text-xs text-red-500 mt-2">
                  No sheet connected yet — use the Create button below to create and connect a sheet.
                </Typography>
              )}
            </>
          )}
          {loadingTrackers && (
            <Typography
              variant="small"
              className="text-xs text-indigo-500"
            >
              Loading tracker data…
            </Typography>
          )}
        </div>
      </div>

      {/* Optional error line */}
      {localError && !noSheet && (
        <Typography className="text-xs text-red-500">{localError}</Typography>
      )}

      {/* ✅ CONTENT STATES */}
      {!selectedAccount ? (
        <div className="flex flex-col items-center justify-center p-8 mb-10">
          <NoSymbolIcon className="w-14 h-14 text-gray-400 mb-3" />
          <Typography variant="h5" className="text-light-text dark:text-dark-text text-center">
            Select a business to manage sheets
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted text-center mt-2">
            Choose a business from the dropdown to view its trackers, connect a sheet, or edit Smile Support FAQs.
          </Typography>
        </div>
      ) : (
        <div>
          <GoogleSheetsSetup businessId={selectedAccount} />
        </div>
      )}

      {/* Smile Support FAQ sections (editable) */}
      <div className="mt-6">

        {selectedAccount && (
          <>
            <Typography variant="h6" className="text-sm font-semibold">Smile Support FAQs</Typography>
            <div className="mt-3">
              {(() => {
                const faqSections = (businessServiceDetails?.sections || []).filter((s) => editableSectionNames.has(s.section_name));
                if (!faqSections.length) return (
                  <div className="mt-4 p-4 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border flex items-start gap-3">
                    <InformationCircleIcon className="h-5 w-5 text-light-muted" />
                    <div>
                      <div className="text-sm font-medium text-light-text dark:text-dark-text">No FAQ sections available</div>
                      <div className="text-xs text-light-muted">The Smile Support FAQ sections are not configured yet for this service.</div>
                    </div>
                  </div>
                );

                const selectedSection = faqSections.find((s) => s.section_name === activeFaqTab) || faqSections[0];

                return (
                  <>
                    <div className="flex flex-wrap gap-2 border-b border-light-border dark:border-dark-border">
                      {faqSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => setActiveFaqTab(section.section_name)}
                          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeFaqTab === section.section_name
                            ? "text-primary border-b-2 border-primary"
                            : "text-light-muted dark:text-dark-muted hover:text-primary"
                            }`}
                        >
                          {section.section_title || formatSectionName(section.section_name)}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 p-4 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                      <div className="flex justify-end items-end mb-3">
                        {/* <div>
                      <div className="font-semibold text-sm">{selectedSection.section_title || selectedSection.section_name}</div>
                      {selectedSection.section_subtitle && <div className="text-xs text-light-muted">{selectedSection.section_subtitle}</div>}
                    </div> */}

                        <div className="flex gap-2">
                          {selectedAccount && (
                            <div className="relative">
                              <button
                                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                                className="text-sm px-3 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                Download FAQs ▾
                              </button>
                              {showDownloadMenu && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowDownloadMenu(false)}
                                  />
                                  <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border z-20">
                                    <div className="py-1">
                                      <button
                                        onClick={() => {
                                          downloadFAQSection(selectedSection);
                                          setShowDownloadMenu(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        Download Selected Section
                                      </button>
                                      <button
                                        onClick={() => {
                                          downloadAllFAQs();
                                          setShowDownloadMenu(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        Download All Sections
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          {!editingSectionId && selectedAccount && (
                            <button onClick={() => startSectionEdit(selectedSection)} className="text-sm px-3 py-1 rounded bg-primary text-white">Edit Section</button>
                          )}
                          {editingSectionId === selectedSection.id && (
                            <>
                              <button disabled={isSavingSection} onClick={() => saveSection(selectedSection)} className="text-sm px-3 py-1 rounded bg-primary text-white">{isSavingSection ? 'Saving...' : 'Save'}</button>
                              <button onClick={cancelSectionEdit} className="text-sm px-3 py-1 rounded border">Cancel</button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(selectedSection.questions || [])
                          .filter((q) => q.field_type !== "table")
                          .map((q, idx) => {
                            const name = q.field_name;
                            const value = editingSectionId === selectedSection.id ? formState[name] : q.answer;
                            const set = (v) => setFormState((s) => ({ ...s, [name]: v }));

                            return (
                              <div key={idx} className="border-b border-light-border dark:border-dark-border pb-3 last:border-b-0">
                                <Typography className="font-medium text-light-text dark:text-dark-text mb-1">{q.question}</Typography>

                                {editingSectionId === selectedSection.id ? (
                                  <div>
                                    {q.field_type === 'textarea' ? (
                                      <textarea value={value ?? ''} onChange={(e) => set(e.target.value)} className="w-full p-2 border rounded bg-light-surface dark:bg-dark-surface" rows={4} />
                                    ) : q.field_type === 'radio' ? (
                                      <div className="flex flex-wrap gap-3">{normalizeOptions(q.options).map((opt) => (
                                        <label key={opt} className="flex items-center gap-2"><input type="radio" checked={value === opt} onChange={() => set(opt)} /> <span>{opt}</span></label>
                                      ))}</div>
                                    ) : q.field_type === 'checkbox' ? (
                                      <div className="flex flex-wrap gap-3">{normalizeOptions(q.options).map((opt) => { const arr = Array.isArray(value) ? value : []; const checked = arr.includes(opt); return (<label key={opt} className="flex items-center gap-2"><input type="checkbox" checked={checked} onChange={(e) => { if (e.target.checked) set([...arr, opt]); else set(arr.filter((x) => x !== opt)); }} /> <span>{opt}</span></label>); })}</div>
                                    ) : (
                                      <input value={value ?? ''} onChange={(e) => set(e.target.value)} className="w-full p-2 border rounded bg-light-surface dark:bg-dark-surface" />
                                    )}
                                  </div>
                                ) : (
                                  <Typography className="text-light-muted dark:text-dark-muted whitespace-pre-wrap">{value == null || value === "" ? 'Not answered' : Array.isArray(value) ? value.join(', ') : String(value)}</Typography>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </>
        )}
      </div>

      <div className="mt-6" ref={allSheetsRef}>
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <Typography variant="h6" className="text-sm font-semibold">All Sheets</Typography>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAllSheets(!showAllSheets)}
              className="text-sm px-3 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              {showAllSheets ? 'Hide All Sheets' : 'Show All Sheets'}
            </button>
            <button
              onClick={() => setShowDeletedSheets(!showDeletedSheets)}
              className="text-sm px-3 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              {showDeletedSheets ? 'Hide Restore Sheets' : 'Restore Sheets'}
            </button>
          </div>
        </div>

        {/* Active/Inactive Sheets Table */}
        {showAllSheets && (
          <div className="mt-3">
            <Table
              columns={sheetColumns}
              rows={allSheets.filter((sheet) => sheet.status === 'active' || sheet.status === 'inactive')}
              loading={loadingAllSheets}
            />
          </div>
        )}

        {/* Deleted Sheets Table */}
        {showDeletedSheets && (
          <div className="mt-3">
            <Typography variant="small" className="text-xs text-light-muted mb-2 block">Deleted Sheets</Typography>
            <Table
              columns={deletedSheetColumns}
              rows={allSheets.filter((sheet) => sheet.status === 'deleted')}
              loading={loadingAllSheets}
            />
          </div>
        )}
      </div>

      <Dialog
        open={confirmState.open}
        handler={closeConfirm}
        size="sm"
        className="
    bg-light-surface dark:bg-dark-surface
    text-light-text dark:text-dark-text
    border border-light-border dark:border-dark-border
    rounded-2xl
  "
      >
        <DialogHeader
          className="
      px-5 pt-5 pb-3
      text-light-text dark:text-dark-text
      border-b border-light-border dark:border-dark-border
    "
        >
          <span className="text-base font-semibold">{confirmState.title}</span>
        </DialogHeader>

        <DialogBody
          className="
      px-5 py-4
      text-sm whitespace-pre-line
      text-light-muted dark:text-dark-muted
    "
        >
          {confirmState.message}
        </DialogBody>

        <DialogFooter
  className="
    px-5 pb-5 pt-3
    border-t border-light-border dark:border-dark-border
    flex gap-2
  "
>
  {/* Cancel */}
  <Button
    variant="text"
    onClick={closeConfirm}
    disabled={confirmState.loading}
    className="
      rounded-lg
      border border-light-border dark:border-dark-border
      text-light-text dark:text-dark-text
      hover:bg-black/5 dark:hover:bg-white/10
      px-4 py-2
    "
  >
    {confirmState.cancelText}
  </Button>

  {/* Confirm */}
  <Button
    onClick={() => confirmState.onConfirm?.()}
    loading={confirmState.loading}
    className={[
      "rounded-lg px-4 py-2",
      confirmState.tone === "danger"
        ? toneStyles.danger.btnSolid
        : confirmState.tone === "warning"
        ? toneStyles.primary.btnOutline
        : toneStyles.primary.btnSolid,
    ].join(" ")}
  >
    {confirmState.confirmText}
  </Button>
</DialogFooter>

      </Dialog>

    </div>
  );
};

export default AdminBusinessSheets;
