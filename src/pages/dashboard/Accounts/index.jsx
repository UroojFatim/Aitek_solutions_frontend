import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchBusinessDetails } from "@/redux/actions/business.actions";
import BusinessDetails from "./tabs/BusinessDetails";
import Tabs from "@/shared/components/Tabs";
import TabContent from "@/shared/components/Tabs/TabContent";
import MyDocuments from "./tabs/myDocuments";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("details");
  
  const tabs = [
    {
      label: "My Account",
      value: "details",
      content: <BusinessDetails />,
    },
    {
      label: "My Documents",
      value: "documents",
      content: <MyDocuments />,
    },
  ];

  return (
    <div className="p-6 md:p-10 min-h-screen bg-light-background dark:bg-dark-background transition-colors">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <TabContent
        tabs={tabs}
        activeTab={activeTab}
      />
    </div>
  );
}

export default Accounts;
