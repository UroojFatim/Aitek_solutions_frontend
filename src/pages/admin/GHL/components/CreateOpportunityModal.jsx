import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import ghl_service from "@/services/ghl.service";
import { fetchGhlOpportunitiesByPipelineId } from "@/redux/actions/ghl.actions";

const STATUS_OPTIONS = ["open", "won", "lost", "abandoned"];
const DEFAULT_LOCATION_ID = "1GUw2okV7aCJ4cJdBU8m";

const CreateOpportunityModal = ({
  isOpen,
  onClose,
  onCreated,
  onUpdated,
  locationId = DEFAULT_LOCATION_ID,
  initialOpportunity = null,
  selectedPipelineIdFromParent = "",
}) => {

  const dispatch = useDispatch();

  const isEdit = !!initialOpportunity;

  // --- lookup options ---
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [users, setUsers] = useState([]);
  // const [showFollowersDropdown, setShowFollowersDropdown] = useState(false);

  // --- loading flags ---
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingContact, setCreatingContact] = useState(false);

  // --- form state ---
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContactId, setSelectedContactId] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");

  const [opportunityName, setOpportunityName] = useState("");
  const [pipelineId, setPipelineId] = useState("");
  const [stageId, setStageId] = useState("");
  const [status, setStatus] = useState("open");
  const [opportunityValue, setOpportunityValue] = useState("");
  const [ownerId, setOwnerId] = useState("");
  // const [followerIds, setFollowerIds] = useState([]);
  // const [businessName, setBusinessName] = useState("");
  const [opportunitySource, setOpportunitySource] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  // const [treatment, setTreatment] = useState("");

  const [errors, setErrors] = useState({});

  // --- Redux: pipelines already in state ---
  const ghlState = useSelector((state) => state?.ghl ?? { pipelines: [] });
  const pipelines = ghlState?.pipelines ?? ghlState?.list ?? [];

  // contact dropdown
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  // -------------------------------
  // API helpers (local + backend)
  // -------------------------------
  const api = {
    async fetchContacts() {
      // TODO: hook this to your real GHL contacts endpoint later
      return [];
    },

    async createContact(name, email, phone) {
      const payload = {
        name,
        locationId,
        // email, phone can be added later if you want
      };

      const res = await fetch("http://localhost:5000/api/ghl/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error("Non-JSON response from /api/ghl/contact", e);
        throw e;
      }

      if (!res.ok || !data?.success) {
        const msg = data?.message || `HTTP ${res.status} creating contact`;
        throw new Error(msg);
      }

      const raw = data.data?.contact || data.data || {};

      const normalized = {
        id: raw.id,
        name:
          raw.name || `${raw.firstName || ""} ${raw.lastName || ""}`.trim(),
        fullName: raw.fullName,
        contactName: raw.contactName,
        email: raw.email,
        phone: raw.phone,
      };

      return normalized;
    },

    async fetchPipelines() {
      // we already have them from Redux
      return pipelines;
    },

    async fetchStagesForPipeline(pipelineId) {
      const pipeline = pipelines.find((p) => p.id === pipelineId);
      if (!pipeline) return [];
      const orderedStages = [...(pipeline.stages || [])].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );
      return orderedStages;
    },

    async fetchUsers() {
      const res = await ghl_service.fetchUsers(locationId);
      const list = res?.users || res || [];
      return list;
    },

    async createOpportunity(payload) {
      const {
        contactId,
        primaryEmail,
        primaryPhone,
        locationId,
        ...opportunityPayload
      } = payload;

      // 1) Update contact with email / phone if provided
      try {
        if (contactId && (primaryEmail || primaryPhone || selectedTagIds.length)) {
          const isValidEmail = (value) =>
            !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

          if (!isValidEmail(primaryEmail)) {
            console.error("Invalid email format");
            return;
          }

          await ghl_service.updateContact(
            contactId,
            primaryEmail || undefined,
            primaryPhone || undefined,
            selectedTagIds        // ✅ full array of tags
          );
        }
      } catch (err) {
        console.error("Failed to update contact (email/phone)", err);
      }

      // 2) Create opportunity with the remaining payload
      const opportunityBody = {
        ...opportunityPayload,
        locationId,
        contactId,
      };

      const opportunity = await ghl_service.createOpportunity(opportunityBody);
      return opportunity;
    },

    async updateOpportunity(opportunityId, payload) {
      const {
        contactId,
        primaryEmail,
        primaryPhone,
        locationId,
        ...opportunityPayload
      } = payload;

      // 1) Update contact (same as create)
      try {
        if (contactId && (primaryEmail || primaryPhone || selectedTagIds.length)) {
          const isValidEmail = (value) =>
            !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

          if (!isValidEmail(primaryEmail)) {
            console.error("Invalid email format");
            return;
          } else {
            await ghl_service.updateContact(
              contactId,
              primaryEmail || undefined,
              primaryPhone || undefined,
              selectedTagIds
            );

          }
        }
      } catch (err) {
        console.error("Failed to update contact (email/phone)", err);
      }

      // 2) Update opportunity
      const opportunityBody = {
        ...opportunityPayload,
        locationId,
        contactId,
      };

      // 👇 assuming you have this; if not, create it in ghl_service
      const updated = await ghl_service.updateOpportunity(
        opportunityId,
        opportunityBody
      );

      return updated;
    },

  };

  // ----------------------------------
  // Load initial lookup data on open
  // ----------------------------------
  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        setLoadingLookups(true);
        const [contactsRes, , usersRes] = await Promise.all([
          api.fetchContacts(),
          api.fetchPipelines(),
          api.fetchUsers(),
        ]);

        setContacts(contactsRes || []);
        setUsers(usersRes || []);
      } catch (err) {
        console.error("Failed to load lookups", err);
      } finally {
        setLoadingLookups(false);
      }
    };

    load();
  }, [isOpen]);

  // ✅ When pipeline changes, derive stages from pipeline.stages
  useEffect(() => {
    if (!pipelineId) {
      setStages([]);
      setStageId("");
      return;
    }

    const loadStages = async () => {
      try {
        const stagesRes = await api.fetchStagesForPipeline(pipelineId);
        setStages(stagesRes || []);

        if (stagesRes && stagesRes.length > 0) {
          const stillValid = stagesRes.some((s) => s.id === stageId);
          if (!stillValid) {
            setStageId(stagesRes[0].id);
          }
        } else {
          setStageId("");
        }
      } catch (err) {
        console.error("Failed to load stages", err);
      }
    };

    loadStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineId, pipelines]);

  useEffect(() => {
    if (!isOpen) {
      // reset everything when modal closes
      setContactSearch("");
      setSelectedContactId("");
      setPrimaryEmail("");
      setPrimaryPhone("");
      setOpportunityName("");
      setPipelineId("");
      setStageId("");
      setStatus("open");
      setOpportunityValue("");
      setOwnerId("");
      // setFollowerIds([]);
      // setBusinessName("");
      setOpportunitySource("");
      setSelectedTagIds([]);
      // setTreatment("");
      setErrors({});
      setShowContactDropdown(false);
      setStages([]);
      return;
    }

    // When opened in EDIT mode, prefill from initialOpportunity
    if (initialOpportunity) {
      const opp = initialOpportunity;
      const contact =
        opp.contact || opp.relations?.[0] || {};
      setSelectedContactId(opp.contactId || contact.id || "");
      setContactSearch(
        contact.fullName ||
        contact.contactName ||
        contact.name ||
        ""
      );
      setPrimaryEmail(contact.email || contact.emailAddress || "");
      setPrimaryPhone(contact.phone || "");

      setOpportunityName(opp.name || "");
      setPipelineId(opp.pipelineId || "");
      setStageId(opp.pipelineStageId || opp.pipelineStageUId || "");
      setStatus(opp.status || "open");
      setOpportunityValue(
        opp.monetaryValue != null ? String(opp.monetaryValue) : ""
      );
      // setOwnerId(opp.assignedTo || opp.ownerId || "");
      // setFollowerIds(opp.followerIds || []);
      // setBusinessName(contact.companyName || "");
      // setOpportunitySource(opp.source || "");
      // setSelectedTagIds(contact.tags || []);
      // setTreatment(opp.treatment || "");
      // setErrors({});
      setOwnerId(opp.assignedTo || "");

      // Followers (array of objects on the opp)
      // const followerIdsFromOpp = (opp.followers || []).map(
      //   (f) => f.id || f.userId
      // ).filter(Boolean);
      // setFollowerIds(followerIdsFromOpp);

      // Business name (comes from contact in your object)
      // setBusinessName(opp.businessName || contact.companyName || "");

      // Source (top-level field on opp – but in your sample it’s null)
      setOpportunitySource(opp.source || "");

      // ⬇ PREFILL selectedTagIds from contact.tags
      const contactTags = Array.isArray(contact.tags) ? contact.tags : [];
      setSelectedTagIds(contactTags);

      // Treatment – only if you’re storing it somewhere on opp/customFields
      // setTreatment(opp.treatment || "");
      setErrors({});

    } else {
      // opened in CREATE mode – ensure clean form
      setContactSearch("");
      setSelectedContactId("");
      setPrimaryEmail("");
      setPrimaryPhone("");
      setOpportunityName("");

      // 👇 important: pre-select the pipeline from parent if provided
      setPipelineId(selectedPipelineIdFromParent || "");

      setStageId("");
      setStatus("open");
      setOpportunityValue("");
      setOwnerId("");
      // setFollowerIds([]);
      // setBusinessName("");
      setOpportunitySource("");
      setSelectedTagIds([]);
      // setTreatment("");
      setErrors({});
    }
  }, [isOpen, initialOpportunity, selectedPipelineIdFromParent]);

  // -----------------------------
  // Derived: filtered contacts
  // -----------------------------
  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contacts;

    const q = contactSearch.toLowerCase();

    return contacts.filter((c) => {
      const name = (c.name || c.fullName || c.contactName || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [contacts, contactSearch]);

  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === selectedContactId) || null,
    [contacts, selectedContactId]
  );

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleSelectContact = (c) => {
    setSelectedContactId(c.id);
    setContactSearch(c.name || c.fullName || c.contactName || "");
    setPrimaryEmail(c.email || "");
    setPrimaryPhone(c.phone || "");
    setShowContactDropdown(false);
  };

  const handleCreateContact = async () => {
    const name = contactSearch.trim();
    if (!name) return;

    try {
      setCreatingContact(true);

      const newContact = await api.createContact(name);

      // add and select
      setContacts((prev) => [newContact, ...prev]);
      handleSelectContact(newContact);
    } catch (err) {
      console.error("Failed to create contact", err);
    } finally {
      setCreatingContact(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedContactId) newErrors.contact = "Primary contact is required";
    if (!opportunityName.trim())
      newErrors.opportunityName = "Opportunity name is required";
    if (!pipelineId) newErrors.pipelineId = "Pipeline is required";
    if (!stageId) newErrors.stageId = "Stage is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    try {
      setCreating(true);

      const payload = {
        locationId,
        contactId: selectedContactId,
        primaryEmail: primaryEmail || undefined,
        primaryPhone: primaryPhone || undefined,
        name: opportunityName,
        pipelineId,
        pipelineStageId: stageId,
        status,
        monetaryValue: opportunityValue ? Number(opportunityValue) : 0,
        ownerId: ownerId || null,
        assignedTo: ownerId || null,
        source: opportunitySource || undefined,
      };

      let resultOpp = null;

      if (isEdit && initialOpportunity?.id) {
        const updated = await api.updateOpportunity(initialOpportunity.id, payload);
        resultOpp = updated;
        if (onUpdated) {
          onUpdated(updated);
        }
      } else {
        const created = await api.createOpportunity(payload);
        resultOpp = created;
        if (onCreated) {
          onCreated(created);
        }
      }

      // 🔥 Force refresh from Redux as well (extra safety)
      if (pipelineId) {
        dispatch(
          fetchGhlOpportunitiesByPipelineId({
            locationId,
            pipelineId,
          })
        );
      }

      onClose && onClose();
    } catch (err) {
      console.error(isEdit ? "Failed to update opportunity" : "Failed to create opportunity", err);
    } finally {
      setCreating(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3 border-b border-light-border dark:border-dark-border">
          <div>
            <Typography
              variant="h5"
              className="font-semibold text-light-text dark:text-dark-text text-lg"
            >
              {isEdit ? "Update opportunity" : "Add new opportunity"}
            </Typography>
            <Typography className="text-sm text-light-muted dark:text-dark-muted mt-1">
              {isEdit
                ? "Update the opportunity details."
                : "Create a new opportunity by filling in details and selecting a contact."}
            </Typography>

          </div>
          <button
            type="button"
            className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left side tab (static for now) */}
          <div className="hidden sm:block w-56 border-r border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background py-6 px-4">
            <button className="w-full text-left text-sm font-semibold text-primary bg-primary/10 rounded-lg px-3 py-2">
              Opportunity Details
            </button>
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Contact details */}
            <div className="space-y-4">
              <Typography className="font-semibold text-light-text dark:text-dark-text">
                Contact details
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Contact Name */}
                <div className="relative">
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Primary Contact Name <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex items-center justify-between rounded-md border px-3 py-2 cursor-text bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ${errors.contact
                      ? "border-red-400"
                      : "border-light-border dark:border-dark-border"
                      }`}
                    onClick={() => setShowContactDropdown(true)}
                  >
                    <input
                      type="text"
                      value={contactSearch}
                      onChange={(e) => {
                        setContactSearch(e.target.value);
                        setShowContactDropdown(true);
                        setSelectedContactId("");
                      }}
                      placeholder="Select Contact"
                      className="w-full text-sm bg-transparent outline-none placeholder:text-light-muted dark:placeholder:text-dark-muted text-light-text dark:text-dark-text"
                    />
                    <ChevronDownIcon className="w-4 h-4 text-light-muted dark:text-dark-muted" />
                  </div>
                  {errors.contact && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.contact}
                    </p>
                  )}

                  {/* Dropdown */}
                  {showContactDropdown && (
                    <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-lg">
                      {loadingLookups && (
                        <div className="px-3 py-2 text-xs text-light-muted dark:text-dark-muted">
                          Loading contacts...
                        </div>
                      )}

                      {!loadingLookups && filteredContacts.length === 0 && (
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-primary/5"
                          onClick={handleCreateContact}
                          disabled={creatingContact || !contactSearch.trim()}
                        >
                          {creatingContact
                            ? "Creating contact..."
                            : `Create contact "${contactSearch.trim()}"`}
                        </button>
                      )}

                      {!loadingLookups &&
                        filteredContacts.map((c) => (
                          <button
                            key={
                              c.id ||
                              `${c.email || "no-email"}-${c.phone || "no-phone"
                              }-${c.name || "no-name"}`
                            }
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs hover:bg-light-background dark:hover:bg-dark-background"
                            onClick={() => handleSelectContact(c)}
                          >
                            <div className="font-medium text-light-text dark:text-dark-text">
                              {c.name || c.fullName || c.contactName}
                            </div>
                            {(c.email || c.phone) && (
                              <div className="text-[11px] text-light-muted dark:text-dark-muted">
                                {c.email || c.phone}
                              </div>
                            )}
                          </button>
                        ))}

                      {/* Create contact when there *are* results but user typed new name */}
                      {!loadingLookups &&
                        filteredContacts.length > 0 &&
                        contactSearch.trim() &&
                        !filteredContacts.some(
                          (c) =>
                            (
                              c.name ||
                              c.fullName ||
                              c.contactName ||
                              ""
                            ).toLowerCase() ===
                            contactSearch.trim().toLowerCase()
                        ) && (
                          <button
                            type="button"
                            className="w-full border-t border-light-border dark:border-dark-border text-left px-3 py-2 text-xs text-primary hover:bg-primary/5"
                            onClick={handleCreateContact}
                            disabled={creatingContact}
                          >
                            {creatingContact
                              ? "Creating contact..."
                              : `Create contact "${contactSearch.trim()}"`}
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {/* Primary Email */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Primary Email
                  </label>
                  <Input
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="!text-sm text-light-text dark:text-dark-text"
                  />
                </div>

                {/* Primary Phone */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Primary Phone
                  </label>
                  <Input
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    placeholder="Phone"
                    className="!text-sm text-light-text dark:text-dark-text"
                  />
                </div>
              </div>
            </div>

            {/* Opportunity Details */}
            <div className="space-y-4">
              <Typography className="font-semibold text-light-text dark:text-dark-text">
                Opportunity Details
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opportunity Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Opportunity Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={opportunityName}
                    onChange={(e) => setOpportunityName(e.target.value)}
                    placeholder="Enter opportunity name"
                    className="!text-sm text-light-text dark:text-dark-text"
                  />
                  {errors.opportunityName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.opportunityName}
                    </p>
                  )}
                </div>

                {/* Pipeline */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Pipeline <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={pipelineId}
                    onChange={(e) => setPipelineId(e.target.value)}
                    className={`w-full text-sm rounded-md px-3 py-2 outline-none bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ${errors.pipelineId
                      ? "border-red-400"
                      : "border border-light-border dark:border-dark-border"
                      }`}
                  >
                    <option value="">Select pipeline</option>
                    {pipelines.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {errors.pipelineId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.pipelineId}
                    </p>
                  )}
                </div>

                {/* Stage */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stageId}
                    onChange={(e) => setStageId(e.target.value)}
                    className={`w-full text-sm rounded-md px-3 py-2 outline-none bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ${errors.stageId
                      ? "border-red-400"
                      : "border border-light-border dark:border-dark-border"
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
                    <p className="mt-1 text-xs text-red-500">
                      {errors.stageId}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full text-sm rounded-md px-3 py-2 outline-none bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Opportunity Value */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Opportunity Value
                  </label>
                  <div className="flex items-center rounded-md border border-light-border dark:border-dark-border px-3 py-2 bg-light-background dark:bg-dark-background">
                    <span className="mr-1 text-xs text-light-muted dark:text-dark-muted">
                      $
                    </span>
                    <input
                      type="number"
                      className="flex-1 bg-transparent text-sm outline-none text-light-text dark:text-dark-text"
                      value={opportunityValue}
                      onChange={(e) => setOpportunityValue(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Owner */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Owner
                  </label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full text-sm rounded-md px-3 py-2 outline-none bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.fullName || u.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Followers (multi-select) */}
                {/* <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Followers
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background px-2 py-1 text-light-text dark:text-dark-text"
                      onClick={() =>
                        setShowFollowersDropdown((prev) => !prev)
                      }
                    >
                      <div className="flex flex-wrap gap-1 text-left">
                        {followerIds.length === 0 && (
                          <span className="text-[11px] text-light-muted dark:text-dark-muted">
                            Add Followers
                          </span>
                        )}
                        {followerIds.map((id) => {
                          const u = users.find((x) => x.id === id);
                          if (!u) return null;
                          return (
                            <span
                              key={id}
                              className="rounded-full bg-light-surface dark:bg-dark-surface px-2 py-0.5 text-[11px] text-light-text dark:text-dark-text"
                            >
                              {u.name || u.fullName || u.email}
                            </span>
                          );
                        })}
                      </div>

                      <ChevronDownIcon className="ml-2 h-4 w-4 text-light-muted dark:text-dark-muted" />
                    </button>

                    {showFollowersDropdown && (
                      <div className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-lg">
                        {users.length === 0 && (
                          <div className="px-3 py-2 text-[11px] text-light-muted dark:text-dark-muted">
                            No users found
                          </div>
                        )}

                        {users.map((u) => (
                          <label
                            key={u.id}
                            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[11px] text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background"
                          >
                            <input
                              type="checkbox"
                              className="h-3 w-3"
                              checked={followerIds.includes(u.id)}
                              onChange={() => toggleFollower(u.id)}
                            />
                            <span>{u.name || u.fullName || u.email}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div> */}

                {/* Business Name */}
                {/* <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Business Name
                  </label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter Business Name"
                    className="!text-sm text-light-text dark:text-dark-text"
                  />
                </div> */}

                {/* Opportunity Source */}
                <div>
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Opportunity Source
                  </label>
                  <Input
                    value={opportunitySource}
                    onChange={(e) => setOpportunitySource(e.target.value)}
                    placeholder="Enter Source"
                    className="!text-sm text-light-text dark:text-dark-text"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Tags
                  </label>

                  <div className="rounded-md border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background px-2 py-2">

                    {/* Show selected tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedTagIds.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] text-primary"
                        >
                          {tag}
                          <button
                            type="button"
                            className="text-[10px] text-light-muted hover:text-red-500"
                            onClick={() =>
                              setSelectedTagIds((prev) => prev.filter((t) => t !== tag))
                            }
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Tag Input */}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          e.preventDefault();
                          setSelectedTagIds((prev) => [...prev, tagInput.trim()]);
                          setTagInput("");
                        }
                      }}
                      placeholder="Add tag and press Enter"
                      className="w-full bg-transparent text-xs outline-none text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted"
                    />
                  </div>
                </div>

                {/* Treatment */}
                {/* <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                    Treatment
                  </label>
                  <Input
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Treatment"
                    className="!text-sm text-light-text dark:text-dark-text"
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* Footer */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-light-border dark:border-dark-border bg-light-background/60 dark:bg-dark-background/60">
            <Button
              type="submit"
              className="px-6 text-sm normal-case bg-primary text-white hover:bg-primary/90"
              disabled={creating}
            >
              {creating
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunityModal;
