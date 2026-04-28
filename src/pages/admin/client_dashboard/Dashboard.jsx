import React, { useEffect, useState } from "react";
import { fetchBusinesses, fetchBusinessById } from '../../../redux/actions/business.actions';
import { fetchServices } from '@/redux/actions/services.actions';
import { Select } from "react-day-picker";
import { useSelector, useDispatch } from 'react-redux';
import UnderConstruction from "@/shared/components/UnderConstruction/UnderConstruction";

const Dashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { businesses, selectedBusiness } = useSelector((state) => state.business);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusiness?.id) {
      setSelectedAccount(selectedBusiness.id);
    }
  }, [selectedBusiness]);

  return (
    <div className="p-5 min-h-screen">

      <div className="flex flex-col w-full sm:w-auto">
        <label className="font-medium mb-1 text-sm sm:text-base">Select Client</label>
        <div className="relative w-full sm:w-60">
        <Select
          name="selectedAccount"
          label="Select Account"
          value={selectedAccount || ""}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedAccount(val);
            dispatch(fetchBusinessById(val));
          }}
          className="p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-light-text dark:text-dark-text w-full appearance-none"
        >
          <option value="">Select Account</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name}
            </option>
          ))}
        </Select>
        {/* Custom arrow for consistent look */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          ▼
        </span>
      </div>
      <UnderConstruction/>
      </div> 


    </div>
  );
};

export default Dashboard;
