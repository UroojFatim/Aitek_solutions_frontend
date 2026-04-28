import { useState, useEffect } from "react";
import { Typography, Select, Option } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import sheetService from "@/services/sheets.service";
import TrackerTabs from "@/shared/components/smileSupportComponents/TrackerTabs";
import BookedTrackerSection from "@/shared/components/smileSupportComponents/BookedTrackerSection";
import LeadTrackerSection from "@/shared/components/smileSupportComponents/LeadTrackerSection";
import Spinner from "@/shared/components/spinner/spinner";

const Trackers = ({ businessId }) => {
    const { businessDetails } = useSelector((s) => s.business || {});
    const id = businessDetails?.id || businessId;

    const [bookedRows, setBookedRows] = useState([]);
    const [leadRows, setLeadRows] = useState([]);
    const [loadingTrackers, setLoadingTrackers] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [activeTab, setActiveTab] = useState("booked");

    const [sheetRecord, setSheetRecord] = useState(null);
    const [checkingSheet, setCheckingSheet] = useState(false);
    const [allSheets, setAllSheets] = useState([]);
    const [selectedSheetId, setSelectedSheetId] = useState(null);
    const [loadingSheets, setLoadingSheets] = useState(false);

    const loadTrackers = async () => {
        if (!id) return;
        try {
            setLoadingTrackers(true);
            setLocalError(null);

            // 1) Fetch all sheets for this business
            setLoadingSheets(true);
            let sheets = [];
            try {
                sheets = await sheetService.getUserSheet(id);
                // Convert to array if single sheet returned
                if (!Array.isArray(sheets)) {
                    sheets = sheets ? [sheets] : [];
                }
            } catch (e) {
                sheets = [];
            }

            // Filter active and inactive sheets (exclude deleted)
            const validSheets = sheets.filter(sheet => sheet.status === 'active' || sheet.status === 'inactive');
            setAllSheets(validSheets);

            // Set default to active sheet first, or first sheet if no active sheet exists
            const activeSheet = validSheets.find(sheet => sheet.status === 'active');
            const defaultSheet = activeSheet || validSheets[0];
            setSheetRecord(defaultSheet || null);
            // Ensure active sheet is selected by default in dropdown
            setSelectedSheetId(defaultSheet?.id || null);
            setLoadingSheets(false);

            const sheetExists = !!(defaultSheet && defaultSheet.spreadsheet_url);

            // If no sheet mapping exists, clear trackers and stop
            if (!sheetExists) {
                setBookedRows([]);
                setLeadRows([]);
                return;
            }

            // 2) Automatically sync the sheet when business user visits this page
            try {
                await sheetService.syncUserSheets(id);
            } catch (syncErr) {
                console.warn("Auto-sync failed:", syncErr);
                // Continue loading even if sync fails
            }

            // 3) Load booked & lead rows when sheet exists
            const [booked, leads] = await Promise.all([
                sheetService.getBookedForCurrentUser(id, defaultSheet?.id),
                sheetService.getLeadsForCurrentUser(id, defaultSheet?.id),
            ]);

            setBookedRows(booked || []);
            setLeadRows(leads || []);
        } catch (err) {
            setLocalError(err.message || "Failed to load trackers");
        } finally {
            setLoadingTrackers(false);
            setCheckingSheet(false);
        }
    };

    const handleSheetChange = async (sheetId) => {
        const selected = allSheets.find(s => s.id === sheetId);
        if (selected) {
            setSelectedSheetId(sheetId);
            setSheetRecord(selected);
            
            // Clear previous data immediately
            setBookedRows([]);
            setLeadRows([]);
            
            // Reload tracker data for the selected sheet
            try {
                setLoadingTrackers(true);
                setLocalError(null);
                
                const [booked, leads] = await Promise.all([
                    sheetService.getBookedForCurrentUser(id, sheetId),
                    sheetService.getLeadsForCurrentUser(id, sheetId),
                ]);
                setBookedRows(booked || []);
                setLeadRows(leads || []);
            } catch (err) {
                setLocalError(err.message || "Failed to load trackers");
                setBookedRows([]);
                setLeadRows([]);
            } finally {
                setLoadingTrackers(false);
            }
        }
    };

    useEffect(() => {
        loadTrackers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessDetails?.id, businessId]);

    return (
        <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
                <Typography variant="h4" className="font-semibold text-light-text dark:text-dark-text">
                    Active Trackers
                </Typography>
                
                {/* Sheet Selector Dropdown */}
                {allSheets.length > 0 && (
                    <div className="w-64">
                        <Select 
                            value={selectedSheetId || ""} 
                            onChange={(value) => handleSheetChange(value)}
                            disabled={loadingSheets}
                            label="Select Sheet"
                            className="!bg-light-surface dark:!bg-dark-surface !text-light-text dark:!text-dark-text"
                            menuProps={{
                                className: "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text",
                            }}
                        >
                            {allSheets.map(sheet => (
                                <Option key={sheet.id} value={sheet.id}>
                                    {sheet.spreadsheet_url?.split('/')[-1] || `Sheet - ${sheet.id.slice(0, 8)}`} ({sheet.status})
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
            </div>

            {/* Loading Spinner */}
            {(checkingSheet || loadingSheets || (loadingTrackers && !bookedRows.length && !leadRows.length)) ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Spinner />
                </div>
            ) : (
                <>
                    {/* If no sheet is connected, show a clear message asking user to contact admin */}
                    {!sheetRecord ? (
                        <div className="mt-3 p-4 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3a1 1 0 00-.993.883L9 8v3a1 1 0 00.883.993L10 12h.01a1 1 0 00.997-.877L11 11V8a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-light-text dark:text-dark-text">No sheet connected yet</div>
                                <div className="text-xs text-light-muted dark:text-dark-muted">This account does not have a Google Sheet connected. Please ask your administrator to create and connect a sheet for this business so trackers will populate.</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <TrackerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                            {localError && <p className="text-red-400 text-xs">{localError}</p>}

                            {activeTab === "booked" ? (
                                <BookedTrackerSection rows={bookedRows} loading={loadingTrackers} />
                            ) : (
                                <LeadTrackerSection rows={leadRows} loading={loadingTrackers} />
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Trackers;
