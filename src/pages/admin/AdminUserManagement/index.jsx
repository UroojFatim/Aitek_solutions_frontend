import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-tailwind/react';
import Table from '@/shared/components/table/Table';
import Select from '@/shared/components/form/Select';
import ConfirmationModal from '@/shared/modals/ConfirmationModal';
import toast from 'react-hot-toast';

import {
  fetchSuperUsers,
  fetchServices,
  deleteUser,
  fetchUsersBySuperUser,
} from '@/redux/actions/user.actions';
import { fetchBusinessesByUser } from '@/redux/actions/business.actions';

import CreateUserModal from '@/pages/dashboard/UserManagement/components/CreateUserModal';
import ManageUserServicesModal from '@/pages/dashboard/UserManagement/components/ManageUserServicesModal';

const AdminUserManagement = () => {
  const dispatch = useDispatch();
  const { superUsers, users, services } = useSelector((state) => state.user);

  const [businessOwnerMap, setBusinessOwnerMap] = useState({}); // { business_id: { name, superUserId, superUserName } }
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedSuperUserId, setSelectedSuperUserId] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openManageServices, setOpenManageServices] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    user: null,
    isLoading: false,
  });

  // Fetch all super users on mount
  useEffect(() => {
    dispatch(fetchSuperUsers());
  }, [dispatch]);

  // Build business-to-superuser mapping
  useEffect(() => {
    if (!superUsers || superUsers.length === 0) return;

    const promises = superUsers.map((su) =>
      dispatch(fetchBusinessesByUser(su.id)).then((res) => {
        const businesses = res?.payload || [];
        return { superUser: su, businesses };
      })
    );

    Promise.all(promises).then((results) => {
      const map = {};
      results.forEach(({ superUser, businesses }) => {
        if (businesses && businesses.length > 0) {
          // Each superuser has one business
          const business = businesses[0];
          map[business.id] = {
            name: business.name,
            superUserId: superUser.id,
            superUserName: superUser.full_name,
          };
        }
      });
      setBusinessOwnerMap(map);
    });
  }, [superUsers, dispatch]);

  // When a business is selected, set the superuser and fetch users/services
  useEffect(() => {
    if (!selectedBusinessId) return;

    const businessInfo = businessOwnerMap[selectedBusinessId];
    if (!businessInfo) return;

    setSelectedSuperUserId(businessInfo.superUserId);
    dispatch(fetchUsersBySuperUser(businessInfo.superUserId));
    dispatch(fetchServices(selectedBusinessId));
  }, [dispatch, selectedBusinessId, businessOwnerMap]);

  const handleOpenCreate = () => setOpenCreate((prev) => !prev);

  const handleOpenManageServices = (user = null) => {
    setSelectedUser(user);
    setOpenManageServices((prev) => !prev);
  };

  const handleDeleteUser = (user) => {
    if (!user?.id) return;
    setConfirmationModal({
      open: true,
      user,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    const user = confirmationModal.user;
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await dispatch(deleteUser(user.id));
      if (result.type === 'user/deleteUser/fulfilled') {
        toast.success('User deleted successfully');
        if (selectedSuperUserId) {
          dispatch(fetchUsersBySuperUser(selectedSuperUserId));
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setConfirmationModal((prev) => ({ ...prev, open: false, isLoading: false }));
    }
  };

  const handleCancelDelete = () => {
    setConfirmationModal((prev) => ({ ...prev, open: false }));
  };

  const superUserOptions = (superUsers || [])
    .map((a) => ({ label: `${a.full_name} (${a.email})`, value: a.id }));

  // Build business options from the map
  const businessOptions = Object.entries(businessOwnerMap || {})
    .map(([id, info]) => ({
      label: info?.name || 'Unknown Business',
      value: id,
    }))
    .filter((opt) => opt.label && opt.value);

  // Get current selected business info to display superuser name
  const selectedBusinessInfo = selectedBusinessId ? businessOwnerMap[selectedBusinessId] : null;

  const columns = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Services',
      render: (user) => {
        const servicesArr =
          user?.services || user?.service_names?.map((name) => ({ name })) || [];

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
          <Button
            size="sm"
            className="bg-green-600 text-white normal-case hover:opacity-90"
            onClick={() => handleOpenManageServices(user)}
          >
            Update
          </Button>

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
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            Users Management (Admin)
          </h1>
          <p className="text-sm text-light-muted">Select a Super User to view their users</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-72">
            <Select
              label="Select Business"
              options={businessOptions}
              value={selectedBusinessId || ''}
              onChange={(val) => setSelectedBusinessId(val)}
            />
          </div>

          {/* Display Super User Name for selected Business */}
          {selectedBusinessInfo && (
            <div className="flex items-center gap-x-2 w-72 px-4 py-2 bg-light-surface dark:bg-dark-surface rounded border border-light-border dark:border-dark-border">
              <p className="text-sm text-light-muted dark:text-dark-muted">Super User: </p>
              <p className="text-light-text dark:text-dark-text font-semibold">{selectedBusinessInfo.superUserName}</p>
            </div>
          )}

          {/* Create button only available after a business is selected */}
          <Button
            className={`bg-primary text-white normal-case hover:opacity-90 ${!selectedBusinessId ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleOpenCreate}
            disabled={!selectedBusinessId}
          >
            + Create User
          </Button>
        </div>
      </div>

      <div className="w-full mx-auto overflow-x-auto">
        <Table columns={columns} rows={users || []} />
      </div>

      <CreateUserModal
        open={openCreate}
        handleOpen={handleOpenCreate}
        allServices={services || []}
        businessId={selectedBusinessId}
        onSuccess={() => {
          // refresh list for selected super user after creation
          if (selectedSuperUserId) dispatch(fetchUsersBySuperUser(selectedSuperUserId));
        }}
      />

      <ManageUserServicesModal
        open={openManageServices}
        handleOpen={handleOpenManageServices}
        user={selectedUser}
        allServices={services || []}
        businessId={selectedBusinessId}
        onSuccess={() => {
          if (selectedSuperUserId) dispatch(fetchUsersBySuperUser(selectedSuperUserId));
        }}
      />

      <ConfirmationModal
        open={confirmationModal.open}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmationModal.user?.full_name} (${confirmationModal.user?.email})? This user will be logged out and won't be able to access the system.`}
        confirmText="Delete"
        confirmColor="red"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={confirmationModal.isLoading}
      />
    </div>
  );
};

export default AdminUserManagement;
