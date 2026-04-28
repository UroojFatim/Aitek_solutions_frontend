import { Card, CardBody, Button, Typography, Spinner } from "@material-tailwind/react";

const TopBarCard = ({
    sheetUrl,
    sheetStatus,
    bookedRows,
    leadRows,
    lastSyncedAt,
    loading,
    loadingTrackers,
    onOpen,
    onCreate,
    onShare
}) => {
    // Show "Create Sheet" only if there's no sheet or if it's inactive
    const showCreateButton = !sheetUrl || sheetStatus === "inactive";
    // Can open/sync only if sheet exists and is active
    const canUseSheet = sheetUrl && sheetStatus === "active";

    // Determine what to display based on status
    const isDeleted = sheetStatus === 'deleted';
    const isActiveOrInactive = sheetStatus === 'active' || sheetStatus === 'inactive';

    // Handle create sheet button click
    const handleCreateClick = () => {
        if (sheetStatus === 'active') {
            alert("Cannot create another sheet. Inactivate current active sheet first.");
            return;
        }
        onCreate();
    };

    return (
        <Card className="border bg-light-surface dark:bg-dark-surface ">
            <CardBody className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}
                <div className="space-y-1 max-w-3xl">
                    <Typography variant="h6" className="uppercase tracking-wide">
                        {isDeleted ? "Deleted Sheet" : sheetStatus === 'active' ? "Active Sheet" : sheetStatus === 'inactive' ? "Last Inactive Sheet" : "Selected Sheet"}
                    </Typography>
                    <Typography variant="small">
                        {isDeleted ? "Deleted Sheet" : (sheetUrl ? "ATS Portal Sheet" : "No sheet connected yet")}
                    </Typography>
                    {isDeleted ? (
                        <Typography variant="small" className="text-red-400">
                            This sheet has been deleted. You can restore it or create a new one.
                        </Typography>
                    ) : isActiveOrInactive && sheetUrl ? (
                        <>
                            <Typography variant="small" className="text-gray-400 break-all">
                                {sheetUrl}
                            </Typography>
                            {sheetStatus && (
                                <>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${sheetStatus === 'active' ? 'bg-green-500/20 text-green-800' :
                                        sheetStatus === 'inactive' ? 'border-green-800 text-green-800 ' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {sheetStatus}
                                </span>
                                {/* <Typography variant="small" className="text-primary ml-2 inline-block">
                                    activate this sheet or create a new one.
                                </Typography> */}
                                </>
                            )}

                        </>
                    ) : null}
                </div>

                {/* Stats */}
                {/* <div className="flex flex-wrap gap-6 lg:justify-center"> */}
                    {/* <div className="text-right">
                        <p className="uppercase text-gray-400 text-sm">Booked</p>
                        <p className="text-xl font-semibold">
                            {loadingTrackers ? <Spinner className="h-4 w-4" /> : bookedRows.length}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="uppercase text-gray-400 text-sm">Leads</p>
                        <p className="text-xl font-semibold">
                            {loadingTrackers ? <Spinner className="h-4 w-4" /> : leadRows.length}
                        </p>
                    </div> */}

                    {/* <div className="text-right">
                        <p className="uppercase text-gray-400 text-sm">Last Sync</p>
                        <p className="text-sm">
                            {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "—"}
                        </p>
                    </div> */}
                {/* </div> */}

                {/* Actions */}
                <div className="flex gap-2 lg:flex-row flex-col">
                    <Button size="sm" color="green" variant="outlined" disabled={!canUseSheet} onClick={onOpen}>
                        Open Sheet
                    </Button>
                    {canUseSheet && onShare && (
                        <Button
                            size="sm"
                            variant="outlined"
                            onClick={onShare}
                            className="border-primary text-primary hover:bg-primary/10"
                        >
                            Share Access
                        </Button>
                    )}
                    {showCreateButton && (
                        <Button size="sm" color="red" onClick={handleCreateClick} disabled={loading}>
                            {loading ? "Working..." : "Create Sheet"}
                        </Button>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default TopBarCard;
