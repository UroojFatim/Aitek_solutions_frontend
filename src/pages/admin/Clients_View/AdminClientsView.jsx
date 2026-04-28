// pages/admin/ClientsView/index.jsx
import React, { useMemo, useState } from "react";
import Tabs from "@/shared/components/Tabs";
import TabContent from "@/shared/components/Tabs/TabContent";

// User-like pages (exactly like user)
import GhlUserPipelines from "@/pages/admin/GHL/index";
import SmileSupport from "@/pages/admin/Clients_View/AdminSmileSupport";
import BrandEstablishment from "@/pages/admin/BrandEstablishment";

const AdminClientsView = () => {
  const [activeTab, setActiveTab] = useState("lead_management");

  const tabs = useMemo(
    () => [
      {
        label: "Lead Management",
        value: "lead_management",
        content: <GhlUserPipelines />,
      },
      {
        label: "24/7 Smile Support",
        value: "smile_support",
        content: <SmileSupport />,
      },
      {
        label: "Brand Establishment",
        value: "brand_establishment",
        content: <BrandEstablishment />,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background transition-colors">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-light-text dark:text-dark-text">
          Client’s View
        </h1>
        <p className="text-sm text-light-muted dark:text-dark-muted">
          Preview client modules exactly as a client sees them.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <TabContent tabs={tabs} activeTab={activeTab} />
    </div>
  );
};

export default AdminClientsView;
