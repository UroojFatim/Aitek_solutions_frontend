// src/components/ghl/ContactAppointmentModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ghl_service from "@/services/ghl.service";

const ContactAppointmentModal = ({
  isOpen,
  onClose,
  contactId,
  locationId,
  defaultTitle = "", // optional: can pass opportunity name
  onAppointmentChanged, // callback(newAppointment or null)
}) => {
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [calendarId, setCalendarId] = useState("");
  const [title, setTitle] = useState(defaultTitle || "");
  const [meetingLocationType, setMeetingLocationType] = useState("custom");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // pick "current" appointment = first appointment for this contact
  const currentAppointment = useMemo(
    () => (appointments && appointments.length > 0 ? appointments[0] : null),
    [appointments]
  );

  // ---------- 30-MIN SLOT HELPERS ----------
  const generateSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = useMemo(() => generateSlots(), []);

  const handleStartTimeChange = (value) => {
    setStartTime(value);

    // AUTO-CALCULATE END TIME (start + 30 mins)
    const [hour, minute] = value.split(":").map(Number);

    let newHour = hour;
    let newMinute = minute + 30;

    if (newMinute >= 60) {
      newMinute -= 60;
      newHour += 1;
    }
    if (newHour >= 24) newHour = 23; // keep same day

    const computedEndTime = `${String(newHour).padStart(2, "0")}:${String(
      newMinute
    ).padStart(2, "0")}`;

    setEndTime(computedEndTime);
  };

  // When modal opens, load calendars + existing appointments
  useEffect(() => {
    if (!isOpen || !contactId || !locationId) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [calRes, appRes] = await Promise.all([
          ghl_service.getCalendars(locationId),
          ghl_service.getAppointmentsForContact(contactId),
        ]);
        const calList = calRes?.calendars || calRes || [];
        const appList = appRes?.events || appRes || [];

        setCalendars(calList);
        setAppointments(appList);

        if (appList.length > 0) {
          // Existing appointment: only show details (no need to prefill form)
          const appt = appList[0];
          setCalendarId(appt.calendarId || "");
          setTitle(appt.title || defaultTitle || "");
          setMeetingLocationType(appt.meetingLocationType || "custom");

          if (appt.startTime) {
            const start = new Date(appt.startTime);
            setDate(start.toISOString().slice(0, 10)); // yyyy-mm-dd
            setStartTime(start.toISOString().slice(11, 16)); // HH:MM
          }
          if (appt.endTime) {
            const end = new Date(appt.endTime);
            setEndTime(end.toISOString().slice(11, 16));
          }
        } else {
          // no existing appointment: reset form for creation
          setCalendarId(calList[0]?.id || "");
          setTitle(defaultTitle || "");
          setMeetingLocationType("custom");
          setDate("");
          setStartTime("");
          setEndTime("");
        }
      } catch (err) {
        console.error("Failed to load calendars/appointments", err);
        setError(err.message || "Select another slot; this one is full.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, contactId, locationId, defaultTitle]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = [];
    if (!calendarId) errors.push("Calendar is required");
    if (!title.trim()) errors.push("Appointment title is required");
    if (!date) errors.push("Date is required");
    if (!startTime) errors.push("Start time is required");
    if (!endTime) errors.push("End time is required");

    if (errors.length > 0) {
      setError(errors.join(" • "));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setError("");

    try {
      // Compose ISO strings from date + time
      const startISO = new Date(`${date}T${startTime}`).toISOString();
      const endISO = new Date(`${date}T${endTime}`).toISOString();

      const payload = {
        title,
        meetingLocationType,
        appointmentStatus: "confirmed",
        calendarId,
        locationId,
        contactId,
        startTime: startISO,
        endTime: endISO,
      };

      // Only ONE appointment per contact/opportunity:
      if (currentAppointment) {
        const eventId = currentAppointment.eventId || currentAppointment.id;
        if (eventId) {
          await ghl_service.deleteAppointment(eventId);
        }
      }

      const created = await ghl_service.createAppointment(payload);
      const newAppt = created?.appointment || created;

      setAppointments(newAppt ? [newAppt] : []);
      onAppointmentChanged && onAppointmentChanged(newAppt || null);

      onClose && onClose();
    } catch (err) {
      console.error("Failed to create/update appointment", err);
      setError("SELECT ANOTHER SLOT THIS ONE IS FULL.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOnly = async () => {
    if (!currentAppointment) return;
    setSaving(true);
    setError("");

    try {
      const eventId = currentAppointment.eventId || currentAppointment.id;
      if (eventId) {
        await ghl_service.deleteAppointment(eventId);
      }
      setAppointments([]);
      onAppointmentChanged && onAppointmentChanged(null);
      onClose && onClose();
    } catch (err) {
      console.error("Failed to delete appointment", err);
      setError("Failed to delete appointment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose && onClose();
      }}
    >
      <div className="w-full max-w-2xl mx-4 rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-2xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-light-border dark:border-dark-border">
          <div>
            <Typography
              variant="h6"
              className="text-base sm:text-lg font-semibold text-light-text dark:text-dark-text"
            >
              Appointment
            </Typography>
            <Typography className="mt-0.5 text-xs text-light-muted dark:text-dark-muted">
              {currentAppointment
                ? "This contact already has an appointment. You can view or delete it."
                : "Create a new appointment for this contact."}
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

        {/* BODY */}
        <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-light-muted dark:text-dark-muted">
              Loading calendars...
            </p>
          ) : (
            <>
              {currentAppointment ? (
                // ---------- VIEW-ONLY MODE ----------
                <div className="space-y-1 rounded-md border border-amber-200 dark:bg-red-900 bg-amber-50 px-3 py-3 text-xs text-light-text dark:text-dark-text">
                  <div className="mb-1 font-semibold text-light-text dark:text-dark-text">
                    Existing Appointment
                  </div>
                  <div>
                    <span className="font-semibold">Title: </span>
                    {currentAppointment.title || "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Status: </span>
                    {currentAppointment.appointmentStatus || "confirmed"}
                  </div>
                  <div>
                    <span className="font-semibold">When: </span>
                    {currentAppointment.startTime
                      ? new Date(
                          currentAppointment.startTime
                        ).toLocaleString()
                      : "-"}{" "}
                    –{" "}
                    {currentAppointment.endTime
                      ? new Date(
                          currentAppointment.endTime
                        ).toLocaleTimeString()
                      : "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Calendar: </span>
                    {currentAppointment.calendarName ||
                      currentAppointment.calendarId ||
                      "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Location Type: </span>
                    {currentAppointment.meetingLocationType || "custom"}
                  </div>
                </div>
              ) : (
                // ---------- CREATION FORM MODE ----------
                <>
                  {/* Calendar */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                      Calendar <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={calendarId}
                      onChange={(e) => setCalendarId(e.target.value)}
                      className="
                        w-full rounded-md border px-3 py-2 text-sm outline-none
                        bg-light-background dark:bg-dark-background
                        border-light-border dark:border-dark-border
                        text-light-text dark:text-dark-text
                        focus:border-primary
                      "
                    >
                      <option value="">Select calendar</option>
                      {calendars.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name || c.title || c.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                      Appointment Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter appointment title"
                      className="
                        w-full rounded-md border px-3 py-2 text-sm outline-none
                        bg-light-background dark:bg-dark-background
                        border-light-border dark:border-dark-border
                        text-light-text dark:text-dark-text
                        focus:border-primary
                      "
                    />
                  </div>

                  {/* Meeting location */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                        Meeting Location Type
                      </label>
                      <select
                        value={meetingLocationType}
                        onChange={(e) =>
                          setMeetingLocationType(e.target.value)
                        }
                        className="
                          w-full rounded-md border px-3 py-2 text-sm outline-none
                          bg-light-background dark:bg-dark-background
                          border-light-border dark:border-dark-border
                          text-light-text dark:text-dark-text
                          focus:border-primary
                        "
                      >
                        <option value="custom">Custom</option>
                        <option value="zoom">Zoom</option>
                        <option value="google_meet">Google Meet</option>
                      </select>
                    </div>
                  </div>

                  {/* Date + 30-Min Slots */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {/* DATE */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                        Date (can select next day only)
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="
                          w-full rounded-md border px-3 py-2 text-sm outline-none
                          bg-light-background dark:bg-dark-background
                          border-light-border dark:border-dark-border
                          text-light-text dark:text-dark-text
                          focus:border-primary
                        "
                      />
                    </div>

                    {/* START TIME (30-min slots) */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={startTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        className="
                          w-full rounded-md border px-3 py-2 text-sm outline-none
                          bg-light-background dark:bg-dark-background
                          border-light-border dark:border-dark-border
                          text-light-text dark:text-dark-text
                          focus:border-primary
                        "
                      >
                        <option value="">Select start time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* END TIME (auto) */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-light-text dark:text-dark-text">
                        End Time (auto)
                      </label>
                      <input
                        type="text"
                        value={endTime}
                        disabled
                        className="
                          w-full rounded-md border px-3 py-2 text-sm outline-none
                          bg-light-background dark:bg-dark-background
                          border-light-border dark:border-dark-border
                          text-light-muted dark:text-dark-muted
                        "
                      />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <p className="mt-1 text-[11px] text-red-500">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-light-border dark:border-dark-border bg-light-background/60 dark:bg-dark-background/60">
          {currentAppointment ? (
            // VIEW MODE FOOTER: delete + close
            <>
              <Button
                variant="text"
                color="red"
                onClick={handleDeleteOnly}
                disabled={saving}
                className="text-xs normal-case border-primary border text-primary  "
              >
                Delete Appointment
              </Button>

            </>
          ) : (
            // CREATE MODE FOOTER: cancel + save
            <>
              <div />
              <div className="flex gap-2">
                <Button
                  className="px-4 py-2 text-sm normal-case bg-primary text-white hover:bg-primary/90"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save appointment"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAppointmentModal;
