import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

import { fetchBusinesses, fetchBusinessById } from "@/redux/actions/business.actions";
import { fetchServices } from "@/redux/actions/services.actions";
import Trackers from "@/pages/dashboard/SmileSupport/Trackers";

const AdminSmileSupport = () => {
  const [selectedAccount, setSelectedAccount] = useState("");

  const { businesses = [], selectedBusiness } = useSelector((state) => state.business || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusiness?.id) setSelectedAccount(String(selectedBusiness.id));
  }, [selectedBusiness]);

  const businessId = selectedAccount || null;

  return (
    <div className="p-5 min-h-screen">
      {/* ✅ ALWAYS VISIBLE SELECTOR */}
      <div className="flex flex-col w-full sm:w-72">
        <label className="font-medium mb-1 text-sm sm:text-base">Select Client</label>

        <div className="relative w-full">
          <select
            value={selectedAccount}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedAccount(val);
              if (val) dispatch(fetchBusinessById(val));
            }}
            className="p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-light-text dark:text-dark-text w-full appearance-none"
          >
            <option value="">Select Account</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>

          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            ▼
          </span>
        </div>
      </div>

      {/* ✅ CONTENT AREA */}
      {!businessId ? (
        <div className="flex flex-col items-center justify-center p-8 mt-10">
          <NoSymbolIcon className="w-14 h-14 text-gray-400 mb-3" />
          <Typography variant="h5" className="text-light-text dark:text-dark-text text-center">
            Please select a business to view forms data
          </Typography>
          <Typography className="text-light-muted dark:text-dark-muted text-center mt-2">
            Choose a business from the dropdown above to load trackers.
          </Typography>
        </div>
      ) : (
        <div className="mt-6">
          <Trackers businessId={businessId} />
        </div>
      )}
    </div>
  );
};

export default AdminSmileSupport;
