import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmins, deleteAdmin, restoreAdmin } from '@/redux/actions/user.actions';
import Table from '@/shared/components/table/Table';
import AddAdminModal from '@/shared/modals/AddAdminModal';
import ConfirmationModal from '@/shared/modals/ConfirmationModal';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';

const AdminsManagement = () => {
  const dispatch = useDispatch();
  const { admins } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
    admin: null,
    isLoading: false,
  });

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleDeleteAdmin = (admin) => {
    setConfirmationModal({
      open: true,
      title: 'Delete Admin',
      message: `Are you sure you want to delete ${admin.full_name} (${admin.email})? This admin will be logged out and won't be able to access the system.`,
      action: 'delete',
      admin,
      isLoading: false,
    });
  };

  const handleRestoreAdmin = (admin) => {
    setConfirmationModal({
      open: true,
      title: 'Restore Admin',
      message: `Restore ${admin.full_name} (${admin.email}) access to the system?`,
      action: 'restore',
      admin,
      isLoading: false,
    });
  };

  const handleConfirm = async () => {
    const { action, admin } = confirmationModal;
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      if (action === 'delete') {
        const result = await dispatch(deleteAdmin(admin.id));
        if (result.type === 'user/deleteAdmin/fulfilled') {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          dispatch(fetchAdmins());
        }
      } else if (action === 'restore') {
        const result = await dispatch(restoreAdmin(admin.id));
        if (result.type === 'user/restoreAdmin/fulfilled') {
          dispatch(fetchAdmins());
        }
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setConfirmationModal((prev) => ({ ...prev, open: false, isLoading: false }));
    }
  };

  const handleCancel = () => {
    setConfirmationModal((prev) => ({ ...prev, open: false }));
  };

  const columns = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Status', accessor: 'status' },
    { header: 'Email', accessor: 'email' },
    { header: 'Privilege', accessor: 'role' },
    {
      header: 'Actions',
      render: (admin) => (
        <div className="flex gap-2">
          {admin?.status === 'deleted' ? (
            <Button
              onClick={() => handleRestoreAdmin(admin)}
              className={`transition px-3 py-1 rounded bg-green-600 text-white hover:opacity-90`}
            >
              Restore
            </Button>
          ) : (
            <Button
              onClick={() => handleDeleteAdmin(admin)}
              disabled={
                user?.email !== "info@aitek-solutions.com" || admin.email === "info@aitek-solutions.com"
              }
              className={`transition px-3 py-1 rounded 
                ${user?.email !== "info@aitek-solutions.com" || admin.email === "info@aitek-solutions.com"
                  ? 'bg-light-muted text-light-surface cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-red-700'}
              `}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 bg-light-background dark:bg-dark-background min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">Admins Details</h1>

      <div className=' w-full mx-auto overflow-x-hidden'>

        <Table columns={columns} rows={admins} />
      </div>

      <button
        className="mt-6 px-5 py-2 bg-primary text-white rounded hover:opacity-90 transition"
        onClick={() => setIsModalOpen(true)}
      >
        Add Admin
      </button>

      <AddAdminModal open={isModalOpen} handleOpen={() => setIsModalOpen(false)} />

      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.action === 'delete' ? 'Delete' : 'Restore'}
        confirmColor={confirmationModal.action === 'delete' ? 'red' : 'green'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={confirmationModal.isLoading}
      />

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
          Admin successfully deleted!
        </div>
      )}
    </div>
  );
};

export default AdminsManagement;
