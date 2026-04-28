// src/pages/.../UserManagement.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-tailwind/react';
import Table from '@/shared/components/table/Table';

import { fetchUsers, fetchServices, deleteUser } from '@/redux/actions/user.actions';

import CreateUserModal from './components/CreateUserModal';
import ManageUserServicesModal from './components/ManageUserServicesModal';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, services } = useSelector((state) => state.user);

  const [openCreate, setOpenCreate] = useState(false);
  const [openManageServices, setOpenManageServices] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchServices());
  }, [dispatch]);

  const handleOpenCreate = () => setOpenCreate((prev) => !prev);

  const handleOpenManageServices = (user = null) => {
    setSelectedUser(user);
    setOpenManageServices((prev) => !prev);
  };

  // 🆕 delete handler with confirm
  const handleDeleteUser = (user) => {
    if (!user?.id) return;
    const ok = window.confirm(
      `Are you sure you want to delete user "${user.full_name}"?`
    );
    if (!ok) return;

    dispatch(deleteUser(user.id));
  };

  const columns = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Services',
      render: (user) => {
        const servicesArr =
          user?.services ||
          user?.service_names?.map((name) => ({ name })) ||
          [];

        if (!servicesArr.length) return <span>No services</span>;

        return (
          <ul className="list-disc pl-5 space-y-1">
            {servicesArr.map((s, idx) => (
              <li key={idx} className="leading-tight">
                {s.name}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      header: 'Actions',
      render: (user) => (
        <div className="flex gap-2 items-start">
          {/* Manage Services button */}
          <Button
            size="sm"
            className="bg-green-600 text-white normal-case hover:opacity-90"
            onClick={() => handleOpenManageServices(user)}
          >
            Manage
          </Button>

          {/* Delete button niche */}
          <Button
            size="sm"
            className="bg-primary text-white normal-case hover:opacity-90"
            onClick={() => handleDeleteUser(user)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
          Users Management
        </h1>

        <Button
          className="bg-primary text-white normal-case hover:opacity-90"
          onClick={handleOpenCreate}
        >
          + Create User
        </Button>
      </div>

      <div className="w-full mx-auto overflow-x-auto">
        <Table columns={columns} rows={users || []} />
      </div>

      <CreateUserModal
        open={openCreate}
        handleOpen={handleOpenCreate}
        allServices={services || []}
      />

      <ManageUserServicesModal
        open={openManageServices}
        handleOpen={handleOpenManageServices}
        user={selectedUser}
        allServices={services || []}
      />
    </div>
  );
};

export default UserManagement;
