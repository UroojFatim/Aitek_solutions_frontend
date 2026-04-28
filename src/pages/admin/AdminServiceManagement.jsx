// pages/admin/ServiceManagement/index.jsx
import React, { useState, useMemo } from "react";
import Tabs from "@/shared/components/Tabs";
import TabContent from "@/shared/components/Tabs/TabContent";

// Existing admin pages/components
import AdminAssignPipeline from "@/pages/admin/AdminAssignPipeline";
import SmileSupport from "@/pages/admin/AdminAccountSheetPage"; // if you want SAME as user OR your admin version
import AdminBrandEstablishment from "@/pages/admin/BrandEstablishment";

const AdminServiceManagement = () => {
  const [activeTab, setActiveTab] = useState("crm");

  const tabs = useMemo(
    () => [
      {
        label: "CRM Account Mapping",
        value: "crm",
        content: <AdminAssignPipeline />,
      },
      {
        label: "24/7 Smile Support",
        value: "smile_support",
        content: <SmileSupport />,
      },
      {
        label: "Brand Establishment",
        value: "brand_establishment",
        content: <AdminBrandEstablishment />,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background transition-colors">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-light-text dark:text-dark-text">
          Service Management
        </h1>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <TabContent tabs={tabs} activeTab={activeTab} />
    </div>
  );
};

export default AdminServiceManagement;
