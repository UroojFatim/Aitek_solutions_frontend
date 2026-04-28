// src/components/google/GoogleSheetsSetup.jsx
import { useState, useEffect } from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
    fetchUserSheet,
    createOrFetchUserSheet,
    syncUserSheets,
} from "@/redux/actions/sheets.actions";
import { useDispatch, useSelector } from "react-redux";
import sheetService from "@/services/sheets.service";
import { fetchBusinessById } from "@/redux/actions/business.actions";
import TopBarCard from "@/shared/components/smileSupportComponents/TopBarCard";
import { ShareSheetAccessModal } from "@/shared/modals";

const GoogleSheetsSetup = ({ businessId }) => {
    const dispatch = useDispatch();

    // If admin passes a businessId, ensure business details are fetched into the store
    useEffect(() => {
        if (!businessId) return;
        dispatch(fetchBusinessById(businessId));
    }, [dispatch, businessId]);

    const [sheetUrl, setSheetUrl] = useState(null);
    const [sheetStatus, setSheetStatus] = useState(null);
    const [sheetId, setSheetId] = useState(null);
    const [message, setMessage] = useState(null);
    const [localError, setLocalError] = useState(null);

    const [bookedRows, setBookedRows] = useState([]);
    const [leadRows, setLeadRows] = useState([]);
    const [loadingTrackers, setLoadingTrackers] = useState(false);
    
    // Share modal state
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [sharingAccess, setSharingAccess] = useState(false);

    const toneStyles = {
        primary: {
            chip: "bg-primary/15 text-primary border border-primary/40",
            btnSolid:
                "bg-primary text-white hover:opacity-90 focus:ring-2 focus:ring-primary/30",
            btnOutline:
                "border border-primary text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/20",
        },
        success: {
            chip: "bg-green-500/15 text-green-500 border border-green-500/40",
            btnSolid:
                "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500/30",
            btnOutline:
                "border border-green-600 text-green-600 hover:bg-green-600/10 focus:ring-2 focus:ring-green-500/20",
        },
        danger: {
            chip: "bg-red-500/15 text-red-500 border border-red-500/40",
            btnSolid:
                "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500/30",
            btnOutline:
                "border border-red-600 text-red-600 hover:bg-red-600/10 focus:ring-2 focus:ring-red-500/20",
        },
    };

    const { sheetRecord, loading, lastSyncedAt, error } = useSelector(
        (s) => s.sheets || {}
    );
    const { user } = useSelector((s) => s.auth || {});
    const { businessDetails } = useSelector((s) => s.business || {});

    const effectiveError = localError || error;

    // ===== Fetch User Sheet =====
    useEffect(() => {
        const id = businessDetails?.id || businessId;
        // Clear previous URL immediately when business changes
        if (!id) {
            setSheetUrl(null);
            setSheetStatus(null);
            setSheetId(null);
            return;
        }

        setSheetUrl(null);
        setSheetStatus(null);
        setSheetId(null);
        dispatch(fetchUserSheet({ businessId: id }))
            .unwrap()
            .then((record) => {
                setSheetUrl(record?.spreadsheet_url || null);
                setSheetStatus(record?.status || null);
                setSheetId(record?.id || null);
            })
            .catch(() => {
                setSheetUrl(null);
                setSheetStatus(null);
                setSheetId(null);
            });
    }, [dispatch, businessDetails?.id, businessId]);

    // Hydrate URL when sheetRecord updates, but only if the record belongs to the current business
    useEffect(() => {
        const id = businessDetails?.id || businessId;
        // If sheetRecord is for a different business (stale), ignore it
        if (sheetRecord && sheetRecord.business_id && id && sheetRecord.business_id !== id) {
            return;
        }
        setSheetUrl(sheetRecord?.spreadsheet_url || null);
        setSheetStatus(sheetRecord?.status || null);
        setSheetId(sheetRecord?.id || null);
    }, [sheetRecord, businessDetails?.id, businessId]);

    // ===== Load Booked + Lead Trackers =====
    const loadTrackers = async () => {
        const id = businessDetails?.id || businessId;
        if (!id) return;
        try {
            setLoadingTrackers(true);
            const [booked, leads] = await Promise.all([
                sheetService.getBookedForCurrentUser(id),
                sheetService.getLeadsForCurrentUser(id),
            ]);

            setBookedRows(booked || []);
            setLeadRows(leads || []);
        } catch (err) {
            setLocalError(err.message);
        } finally {
            setLoadingTrackers(false);
        }
    };

    useEffect(() => {
        loadTrackers();
    }, [businessDetails?.id, businessId, lastSyncedAt]);

    // ===== Actions =====
    const handleCreateSpreadsheet = () => {
        const id = businessDetails?.id || businessId;
        const email = businessDetails?.email || "";
        if (!id) return;
        dispatch(createOrFetchUserSheet({ businessId: id, businessEmail: email }))
            .unwrap()
            .then((r) => {
                setSheetUrl(r.spreadsheet_url);
                setSheetStatus(r.status);
                setSheetId(r.id);
            })
            .catch((err) => setLocalError(err.message));
    };
    const handleSyncFromSheet = () => {
        const id = businessDetails?.id || businessId;
        if (!sheetUrl || !id) return;

        dispatch(syncUserSheets({ businessId: id }))
            .unwrap()
            .then(() => loadTrackers())
            .catch((err) => setLocalError(err.message));
    };

    const handleRestoreSheet = async () => {
        if (!sheetId) return;
        try {
            const res = await sheetService.restoreUserSheet(sheetId);
            setSheetStatus('inactive');
            setMessage('Sheet restored as inactive. Click Activate to enable it.');
            // Reload sheet data
            const id = businessDetails?.id || businessId;
            if (id) {
                dispatch(fetchUserSheet({ businessId: id }));
            }
        } catch (err) {
            setLocalError(err.message || 'Failed to restore sheet');
        }
    };

    const handleShareAccess = async (email, role) => {
        if (!sheetId) return;
        
        try {
            setSharingAccess(true);
            await sheetService.shareSheetAccess(sheetId, email, role);
            setMessage(`Successfully shared access with ${email} as ${role}`);
            setShareModalOpen(false);
        } catch (err) {
            setLocalError(err.message || 'Failed to share sheet access');
        } finally {
            setSharingAccess(false);
        }
    };

    return (
        <div className="mt-6 space-y-4">
            {/* Deleted banner */}
            {sheetStatus === "deleted" && (
                <div className="px-2 flex justify-between items-center">
                    <Typography className="text-xs mt-1">
                        You can restore it (restores as inactive) or create a new sheet.
                    </Typography>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                            onClick={handleRestoreSheet}
                            className={`text-xs px-4 py-2 rounded-lg ${toneStyles.primary.btnOutline}`}
                        >
                            Restore Sheet
                        </Button>

                    <Button
                            onClick={handleCreateSpreadsheet}
                            className={`text-xs px-4 py-2 rounded-lg ${toneStyles.success.btnSolid}`}
                        >
                            Create New Sheet
                        </Button>
                    </div>
                </div>
            )}

            {/* Your existing TopBarCard (kept) */}
            <TopBarCard
                sheetUrl={sheetUrl}
                sheetStatus={sheetStatus}
                bookedRows={bookedRows}
                leadRows={leadRows}
                lastSyncedAt={lastSyncedAt}
                loading={loading}
                loadingTrackers={loadingTrackers}
                onOpen={() => window.open(sheetUrl, "_blank")}
                onCreate={handleCreateSpreadsheet}
                onSync={handleSyncFromSheet}
                onShare={() => setShareModalOpen(true)}
            />

            {/* Share Access Modal */}
            <ShareSheetAccessModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                onShare={handleShareAccess}
                loading={sharingAccess}
            />

            {/* Feedback lines */}
            {message && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
                    <p className="text-green-500 text-xs">{message}</p>
                </div>
            )}

            {effectiveError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                    <p className="text-red-500 text-xs">{effectiveError}</p>
                </div>
            )}
        </div>
    );

};

export default GoogleSheetsSetup;
