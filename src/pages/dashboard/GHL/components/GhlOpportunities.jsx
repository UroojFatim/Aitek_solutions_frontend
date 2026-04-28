// src/components/ghl/GhlOpportunities.jsx
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
  PencilSquareIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import CallDialer from "./CallDialer";
import GHL_Conversations from "./GHL_Conversations";
import UpdateOpportunityModal from "./UpdateOpportunityModal";
import ContactTagsModal from "./ContactTagsModal";
import ContactNotesModal from "./ContactNotesModal";
import ContactTasksModal from "./ContactTasksModal";
import ghl_service from "@/services/ghl.service";
import ContactAppointmentModal from "./ContactAppointmentModal";
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchGhlOpportunitiesByPipelineId } from "@/redux/actions/ghl.actions";

const currency = (v) => {
  if (v == null) return "$0.00";
  if (typeof v !== "number") return `$${String(v)}`;
  return `$${v.toLocaleString()}`;
};

const DEFAULT_LOCATION_ID = "1GUw2okV7aCJ4cJdBU8m";

const GhlOpportunities = ({
  opportunitiesByStage = {},
  selectedPipeline = null,
  onOpportunityUpdated,
  onEditOpportunity,
}) => {
  const dispatch = useDispatch();

  const [showConversationsModal, setShowConversationsModal] = useState(false);
  const [conversationContactId, setConversationContactId] = useState("");
  const [showCallDialer, setShowCallDialer] = useState(false);
  const [dialerPhone, setDialerPhone] = useState("");
  const [dialerContactId, setDialerContactId] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [tagsContactId, setTagsContactId] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesContactId, setNotesContactId] = useState("");
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [tasksContactId, setTasksContactId] = useState("");
  const [users, setUsers] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentContactId, setAppointmentContactId] = useState("");
  const [appointmentTitle, setAppointmentTitle] = useState("");

  // 🔁 Central refresh helper used by all modals
  const refreshOpportunities = useCallback(() => {
    if (selectedPipeline?.id) {
      dispatch(
        fetchGhlOpportunitiesByPipelineId({
          locationId: DEFAULT_LOCATION_ID,
          pipelineId: selectedPipeline.id,
        })
      );
    }

    if (typeof onOpportunityUpdated === "function") {
      // parent GhlPipelines will also refresh
      onOpportunityUpdated();
    }
  }, [dispatch, selectedPipeline, onOpportunityUpdated]);

  if (!selectedPipeline) return null;

  // sort stages by position
  const stages = (selectedPipeline.stages || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  // Load users when component mounts
  useEffect(() => {
    if (!DEFAULT_LOCATION_ID) return;

    const loadUsers = async () => {
      try {
        const users = await ghl_service.fetchUsers(DEFAULT_LOCATION_ID);
        const list = users?.users || users || [];
        setUsers(list);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="mt-4 text-light-text dark:text-dark-text">
      {/* horizontal stages container */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const opps = opportunitiesByStage[stage.id] || [];
          const totalValue = opps.reduce(
            (s, o) => s + (Number(o.monetaryValue) || 0),
            0
          );

          return (
            <div
              key={stage.id}
              className="min-w-[320px] max-w-[320px] flex flex-col rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm transition-colors"
            >
              {/* stage header */}
              <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border bg-light-background/60 dark:bg-dark-background/60 p-3">
                <div>
                  <Typography className="text-sm font-semibold text-light-text dark:text-dark-text">
                    {stage.name}
                  </Typography>
                  <Typography className="text-xs text-light-muted dark:text-dark-muted">
                    {opps.length} Opportunities • {currency(totalValue)}
                  </Typography>
                </div>
                <div>
                  <span className="inline-block rounded border border-light-border/60 dark:border-dark-border/60 bg-light-background dark:bg-dark-background px-2 py-1 text-[11px] text-light-text dark:text-dark-text">
                    {stage.position != null ? stage.position + 1 : ""}
                  </span>
                </div>
              </div>

              {/* vertical scroll area for opp cards */}
              <div className="flex-1 max-h-[60vh] space-y-3 overflow-y-auto p-3">
                {opps.length === 0 ? (
                  <div className="py-6 text-center text-sm text-light-muted dark:text-dark-muted">
                    No opportunities
                  </div>
                ) : (
                  opps.map((opp) => {
                    const contact = opp.contact || opp.relations?.[0] || {};
                    return (
                      <div
                        key={opp.id}
                        className="rounded-md border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-3 transition-colors"
                        onClick={() => {
                          if (typeof onEditOpportunity === "function") {
                            onEditOpportunity(opp);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Typography className="truncate text-sm font-medium text-light-text dark:text-dark-text">
                              {opp.name ||
                                contact.fullName ||
                                contact.contactName ||
                                "-"}
                            </Typography>
                            <Typography className="truncate text-xs text-light-muted dark:text-dark-muted">
                              {contact.email ||
                                contact.emailAddress ||
                                contact.phone ||
                                "-"}
                            </Typography>
                            <div className="mt-1 text-xs text-light-muted dark:text-dark-muted">
                              Source: {opp.source || "-"}
                            </div>
                          </div>
                          <div className="ml-3 text-right">
                            <div
                              className={`rounded px-2 py-1 text-[11px] ${opp.status === "open"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : "bg-light-background text-light-muted border border-light-border dark:bg-dark-background dark:text-dark-muted dark:border-dark-border"
                                }`}
                            >
                              {opp.status || "-"}
                            </div>
                            <div className="mt-2 text-xs font-semibold text-light-text dark:text-dark-text">
                              {currency(opp.monetaryValue)}
                            </div>
                          </div>
                        </div>

                        {/* Bottom: actions */}
                        <div className="mt-2 flex items-center justify-between text-[11px] text-light-muted dark:text-dark-muted">
                          <div className="flex items-center gap-2 text-light-muted dark:text-dark-muted">
                            {/* Call */}
                            <button
                              type="button"
                              className="rounded-full p-1 transition hover:bg-light-background dark:hover:bg-dark-background hover:text-light-text dark:hover:text-dark-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDialerPhone(contact.phone || "");
                                setDialerContactId(
                                  contact.id || opp.contactId || ""
                                );
                                setShowCallDialer(true);
                              }}
                              title="Call"
                            >
                              <PhoneIcon className="h-4 w-4" />
                            </button>

                            {/* View conversations */}
                            <button
                              type="button"
                              className="rounded-full p-1 transition hover:bg-light-background dark:hover:bg-dark-background hover:text-light-text dark:hover:text-dark-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                const contactId =
                                  contact.id || opp.contactId || "";
                                setConversationContactId(contactId);
                                setShowConversationsModal(true);
                              }}
                              title="View conversations"
                            >
                              <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            </button>

                            {/* Add tag */}
                            <button
                              type="button"
                              className="rounded-full p-1 transition hover:bg-light-background dark:hover:bg-dark-background hover:text-light-text dark:hover:text-dark-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                const contactId =
                                  contact.id || opp.contactId || "";
                                setTagsContactId(contactId);
                                setShowTagsModal(true);
                              }}
                              title="Add / manage tags"
                            >
                              <TagIcon className="h-4 w-4" />
                            </button>

                            {/* Add note */}
                            <button
                              type="button"
                              className="rounded-full p-1 transition hover:bg-light-background dark:hover:bg-dark-background hover:text-light-text dark:hover:text-dark-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                const contactId =
                                  contact.id || opp.contactId || "";
                                setNotesContactId(contactId);
                                setShowNotesModal(true);
                              }}
                              title="Add / view notes"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>

                            {/* Add task */}
                            <button
                              type="button"
                              className="rounded-full p-1 transition hover:bg-light-background dark:hover:bg-dark-background hover:text-light-text dark:hover:text-dark-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                const contactId =
                                  contact.id || opp.contactId || "";
                                setTasksContactId(contactId);
                                setShowTasksModal(true);
                              }}
                              title="View / Add Tasks"
                            >
                              <ClipboardDocumentCheckIcon className="h-4 w-4" />
                            </button>

                            {/* Add appointment */}
                            <button
                              type="button"
                              className="rounded-full p-1 transition hover:bg-light-background dark:hover:bg-dark-background hover:text-light-text dark:hover:text-dark-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                const contactId =
                                  contact.id || opp.contactId || "";
                                setAppointmentContactId(contactId);
                                setAppointmentTitle(
                                  opp.name ||
                                  contact.fullName ||
                                  "Appointment"
                                );
                                setShowAppointmentModal(true);
                              }}
                              title="Add appointment"
                            >
                              <CalendarDaysIcon className="h-4 w-4" />
                            </button>

                            {/* Update stage / status */}
                            <button
                              type="button"
                              className="rounded-full p-1 transition hover:bg-light-background dark:hover:bg-dark-background hover:text-light-text dark:hover:text-dark-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingOpportunity(opp);
                                setShowUpdateModal(true);
                              }}
                              title="Update stage / status"
                            >
                              <ArrowsRightLeftIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCallDialer && (
        <CallDialer
          defaultPhoneNumber={"+923122386670"}
          contactId={dialerContactId}
          locationId={DEFAULT_LOCATION_ID}
          onClose={() => setShowCallDialer(false)}
        />
      )}

      {showConversationsModal && (
        <GHL_Conversations
          initialContactId={conversationContactId}
          onClose={() => setShowConversationsModal(false)}
        />
      )}

      {showUpdateModal && editingOpportunity && (
        <UpdateOpportunityModal
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingOpportunity(null);
          }}
          opportunity={editingOpportunity}
          stages={stages}
          onUpdated={(updated) => {
            setShowUpdateModal(false);
            setEditingOpportunity(null);
            refreshOpportunities(); // 🔁 refresh after update
          }}
        />
      )}

      {showTagsModal && tagsContactId && (
        <ContactTagsModal
          isOpen={showTagsModal}
          contactId={tagsContactId}
          onClose={() => {
            setShowTagsModal(false);
            setTagsContactId("");
          }}
          onTagsUpdated={(newTags) => {
            refreshOpportunities(); // 🔁 refresh after tags change
          }}
        />
      )}

      {showNotesModal && notesContactId && (
        <ContactNotesModal
          isOpen={showNotesModal}
          contactId={notesContactId}
          onClose={() => {
            setShowNotesModal(false);
            setNotesContactId("");
          }}
          onNotesUpdated={(newNotes) => {
            refreshOpportunities(); // 🔁 refresh after notes change
          }}
        />
      )}

      {showTasksModal && tasksContactId && (
        <ContactTasksModal
          isOpen={showTasksModal}
          contactId={tasksContactId}
          users={users}
          onClose={() => setShowTasksModal(false)}
          onTasksUpdated={(tasks) => {
            refreshOpportunities(); // 🔁 refresh after tasks change
          }}
        />
      )}

      {showAppointmentModal && appointmentContactId && (
        <ContactAppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          contactId={appointmentContactId}
          locationId={DEFAULT_LOCATION_ID}
          users={[]} // or pass your users list if you want AssignedTo
          defaultTitle={appointmentTitle}
          onAppointmentChanged={(appt) => {
            refreshOpportunities(); // 🔁 refresh after appointment change
          }}
        />
      )}
    </div>
  );
};

GhlOpportunities.propTypes = {
  opportunitiesByStage: PropTypes.object,
  selectedPipeline: PropTypes.object,
  onOpportunityUpdated: PropTypes.func,
  onEditOpportunity: PropTypes.func,
};

export default GhlOpportunities;
