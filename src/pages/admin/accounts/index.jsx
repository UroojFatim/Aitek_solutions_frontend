import React, { useEffect, useState } from 'react';
import {
  Button,
} from "@material-tailwind/react";
import CreateAccountModal from './components/CreateAccountModal';
import EditAccountModal from './components/EditAccountModal';
import BusinessDetails from './tabs/BusinessDetails';
import BusinessDocuments from './tabs/BusinessDocuments';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinesses, fetchBusinessById } from '../../../redux/actions/business.actions';
import { fetchServices } from '@/redux/actions/services.actions';
import Select from '@/shared/components/form/Select';
import Tabs from '@/shared/components/Tabs';
import TabContent from '@/shared/components/Tabs/TabContent';

const Accounts = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const dispatch = useDispatch();

  const handleOpenCreate = () => setOpenCreateDialog(!openCreateDialog);
  const handleOpenEdit = () => setOpenEditDialog(!openEditDialog);

  const { businesses, selectedBusiness } = useSelector((state) => state.business);

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusiness?.id) {
      setSelectedAccount(selectedBusiness.id);
    }
  }, [selectedBusiness]);

  const tabs = [
    {
      label: "Business Details",
      value: "details",
      content: (
        <BusinessDetails
          selectedBusiness={selectedBusiness}
          handleOpenEdit={handleOpenEdit}
        />
      ),
    },
    {
      label: "Documents",
      value: "documents",
      content: (
        <BusinessDocuments 
          selectedBusiness={selectedBusiness} 
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background transition-colors">
      {/* Header with Select and Create Button */}
       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div className="w-full md:w-auto">
          <Select
            name="selectedAccount"
            label="Select Account"
            value={selectedAccount}
            options={businesses.map((business) => ({
              value: business?.id,
              label: business?.name
            }))}
            onChange={(val) => {
              setSelectedAccount(val);
              dispatch(fetchBusinessById(val));
            }}
          />
        </div>
        <Button
          size="sm"
         className="flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white normal-case w-full md:w-auto"
      onClick={handleOpenCreate}
        >
          + Create Account
        </Button>
      </div>

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

      {/* Create Account Modal */}
      <CreateAccountModal open={openCreateDialog} handleOpen={handleOpenCreate} />

      {/* Edit Account Modal */}
      <EditAccountModal
        open={openEditDialog}
        handleOpen={handleOpenEdit}
        accountData={selectedBusiness}
      />
    </div>
  );
};

export default Accounts; 