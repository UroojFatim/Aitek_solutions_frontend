import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnboardingClients } from '@/redux/actions/businessOnboarding.actions';
import Table from '@/shared/components/table/Table';

const STATUS = {
  ONBOARDING: 'onboarding',
  ACTIVE: 'active',
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { clients = [] } = useSelector((state) => state.businessOnboarding);

  useEffect(() => {
    dispatch(fetchOnboardingClients());
  }, [dispatch]);

  const totalOnboarding = useMemo(() => {
    const onboarding = clients?.filter(
      (client) => client.status?.toLowerCase() === STATUS.ONBOARDING
    ) || [];
    return onboarding.length;
  }, [clients]);

  const totalActiveClients = useMemo(() => {
    const active = clients?.filter(
      (client) => client.status?.toLowerCase() === STATUS.ACTIVE
    ) || [];
    return active.length;
  }, [clients]);

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Steps Completed',
      render: (client) => {
        const [completed, total] = client.stepsCompleted.split(' / ').map(Number);
        return `${completed} / ${total}`;
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-light-background dark:bg-dark-background min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">Admin Dashboard</h1>

      {/* Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="border-2 border-primary bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text p-5 rounded-lg shadow-lg">
          <h2 className="text-base md:text-lg font-semibold">Total Onboarding Clients</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2">{totalOnboarding}</p>
        </div>
        <div className="border-2 border-primary text-light-text bg-light-surface dark:bg-dark-surface dark:text-dark-text p-5 rounded-lg shadow-lg">
          <h2 className="text-base md:text-lg font-semibold">Total Active Clients</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2">{totalActiveClients}</p>
        </div>
      </div>

      {/* Overview Table */}
      <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg shadow overflow-x-auto">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
          Current Onboarding Clients
        </h3>

        <Table
          columns={columns}
          rows={clients}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
