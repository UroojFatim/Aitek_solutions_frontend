import React, { useEffect, useState } from "react";

const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const CallDialer = ({
  defaultPhoneNumber = "",
  contactId = "",      // GHL contactId (if you have it)
  locationId = "",     // GHL locationId
  onClose,             // modal close handler (required)
}) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [callSid, setCallSid] = useState(null);
  const [fromNumber, setFromNumber] = useState(""); // Twilio number (we'll set from API)

  // Keep phoneNumber in sync if defaultPhoneNumber changes
  useEffect(() => {
    setPhoneNumber(defaultPhoneNumber || "");
  }, [defaultPhoneNumber]);

  // simple timer when call is in progress
  useEffect(() => {
    let timer;
    if (callInProgress) {
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callInProgress]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (!callInProgress && typeof onClose === "function") {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callInProgress, onClose]);

  const handleKeyPress = (digit) => {
    setPhoneNumber((prev) => prev + digit);
  };

  const handleClear = () => {
    setPhoneNumber("");
  };

  const handleCall = async () => {
    if (!phoneNumber) {
      setStatus("Please enter a phone number first.");
      return;
    }

    setLoading(true);
    setStatus("Dialing...");
    setElapsed(0);

    try {
      const res = await fetch("http://localhost:5000/api/twilio/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phoneNumber }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Call initiated. Ringing...");
        setCallInProgress(true);
        setCallSid(data.call?.sid || null);
        setFromNumber(data.call?.from || "");
      } else {
        setStatus(data.message || "Failed to initiate call.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error talking to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndAndLog = async () => {
    if (!callInProgress) return;

    setCallInProgress(false);
    setStatus("Ending call & logging to CRM...");

    const endedAt = new Date().toISOString();
    const startedAt = new Date(Date.now() - elapsed * 1000).toISOString();

    try {
      const res = await fetch(
        "http://localhost:5000/api/ghl/conversations/calls/outbound-call-log",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationId,
            contactId,
            conversationId: "e9p4qe1KE0Deo1R5Tvlp",
            conversationProviderId: "e9p4qe1KE0Deo1R5Tvlp",
            to: phoneNumber,
            from: fromNumber,
            callSid,
            duration: elapsed,
            startedAt,
            endedAt,
            notes,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setStatus("Call ended and logged to GHL ✅");
        setTimeout(() => {
          if (typeof onClose === "function") onClose();
        }, 800);
      } else {
        setStatus(data.message || "Call ended, but logging to GHL failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Call ended, but error logging to GHL.");
    }
  };

  // Backdrop click close (disabled while call in progress)
  const handleBackdropClick = (e) => {
    if (
      e.target === e.currentTarget &&
      !callInProgress &&
      typeof onClose === "function"
    ) {
      onClose();
    }
  };

  return (
    // Modal overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="
          relative mx-4 w-full max-w-3xl
          rounded-2xl border border-light-border dark:border-dark-border
          bg-light-surface dark:bg-dark-surface
          shadow-2xl p-4 sm:p-6
          grid gap-6
          max-h-[90vh] overflow-hidden
          md:grid-cols-[2fr,3fr]
        "
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute right-4 top-3 text-2xl text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
          onClick={() =>
            !callInProgress && typeof onClose === "function" && onClose()
          }
          title={callInProgress ? "End call before closing" : "Close"}
        >
          ×
        </button>

        {/* Left side: dialer */}
        <div className="flex flex-col gap-4 border-b border-light-border dark:border-dark-border pb-4 md:border-b-0 md:border-r md:pr-4">
          <h2 className="text-lg sm:text-xl font-semibold text-light-text dark:text-dark-text">
            Call Dialer
          </h2>

          {/* Phone display */}
          <div className="flex items-center justify-between rounded-xl border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background px-3 sm:px-4 py-2.5">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-transparent text-base sm:text-lg tracking-wide text-light-text dark:text-dark-text outline-none"
              placeholder="+923001234567"
            />
            <button
              onClick={handleClear}
              className="ml-2 text-xs text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
            >
              Clear
            </button>
          </div>

          {/* Status + timer */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
            <span className="text-light-muted dark:text-dark-muted">
              {status || "Ready to call."}
            </span>
            <span className="font-mono text-primary text-right">
              {callInProgress ? formatTime(elapsed) : "00:00"}
            </span>
          </div>

          {/* Dial pad */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
              (d) => (
                <button
                  key={d}
                  onClick={() => handleKeyPress(d)}
                  className="
                    h-12 sm:h-14 rounded-full
                    border border-light-border dark:border-dark-border
                    bg-light-background dark:bg-dark-background
                    text-base sm:text-lg font-semibold
                    text-light-text dark:text-dark-text
                    shadow-sm
                    hover:bg-primary/10 hover:border-primary
                    active:scale-95 transition
                  "
                >
                  {d}
                </button>
              )
            )}
          </div>

          {/* Call / End buttons */}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleCall}
              disabled
              className="
                flex-1 h-10 sm:h-11 rounded-full
                bg-primary text-white font-semibold
                hover:bg-primary/90
                disabled:bg-primary/40 disabled:text-white/70
                transition
              "
            >
              {loading ? "Dialing..." : "Call"}
            </button>
            <button
              onClick={handleEndAndLog}
              disabled={!callInProgress}
              className="
                flex-1 h-10 sm:h-11 rounded-full
                bg-red-500 text-white font-semibold
                hover:bg-red-400
                disabled:bg-red-900 disabled:text-white/60
                transition
              "
            >
              End &amp; Log
            </button>
          </div>

          {/* Optional plain Close button when not in call */}
          {!callInProgress && (
            <button
              onClick={() => typeof onClose === "function" && onClose()}
              className="mt-1 self-start text-xs text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
            >
              Close without logging
            </button>
          )}
        </div>

        {/* Right side: notes + meta */}
        <div className="flex flex-col gap-4 overflow-y-auto pt-2 md:pt-0">
          <h3 className="text-base sm:text-lg font-semibold text-light-text dark:text-dark-text">
            Call Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-light-text dark:text-dark-text">
            <div>
              <div className="text-[11px] text-light-muted dark:text-dark-muted">
                To
              </div>
              <div className="font-mono break-all">
                {phoneNumber || "-"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-light-muted dark:text-dark-muted">
                From (Twilio)
              </div>
              <div className="font-mono break-all">
                {fromNumber || "auto"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-light-muted dark:text-dark-muted">
                Contact ID
              </div>
              <div className="font-mono break-all">
                {contactId || "-"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-light-muted dark:text-dark-muted">
                Location ID
              </div>
              <div className="font-mono break-all">
                {locationId || "-"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-light-muted dark:text-dark-muted">
                Call SID
              </div>
              <div className="font-mono break-all">
                {callSid || "-"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-light-muted dark:text-dark-muted">
                Duration
              </div>
              <div className="font-mono">{formatTime(elapsed)}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-light-text dark:text-dark-text">
              Call Notes
            </label>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="
                w-full resize-none rounded-xl
                border border-light-border dark:border-dark-border
                bg-light-background dark:bg-dark-background
                px-3 py-2 text-sm
                text-light-text dark:text-dark-text
                outline-none focus:border-primary
              "
              placeholder="Summary, next steps, objections, etc."
            />
            <p className="text-xs text-light-muted dark:text-dark-muted">
              Notes are sent along with the outbound call log to GoHighLevel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDialer;
