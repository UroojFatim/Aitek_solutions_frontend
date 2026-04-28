const TrackerTabs = ({ activeTab, setActiveTab }) => (
    <div className="flex border-b border-light-border dark:border-dark-border">
        <button
            onClick={() => setActiveTab("booked")}
            className={`px-4 py-2 ${
                activeTab === "booked"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-light-muted dark:text-dark-muted"
            }`}
        >
            Booked Tracker
        </button>
        <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 ${
                activeTab === "leads"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-light-muted dark:text-dark-muted"
            }`}
        >
            Lead Tracker
        </button>
    </div>
);

export default TrackerTabs;
