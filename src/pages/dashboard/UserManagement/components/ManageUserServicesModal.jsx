// src/pages/.../components/ManageUserServicesModal.jsx
import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';

import { Checkbox } from '@/shared/components/form';
import { updateUserServices, fetchUsers, changeUserPassword } from '@/redux/actions/user.actions';

const validationSchema = Yup.object({
  service_ids: Yup.array()
    .min(1, 'At least one service must be selected')
    .required('Services are required'),
});

const ManageUserServicesModal = ({ open, handleOpen, user, allServices, businessId: overrideBusinessId = null, onSuccess = null }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  const initialServiceIds = useMemo(
    () => user?.services?.map((s) => s.id) || [],
    [user]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      service_ids: initialServiceIds,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!user?.id) return;

      dispatch(
        updateUserServices({
          id: user.id,
          service_ids: values.service_ids,
          business_id: overrideBusinessId,
          callback: () => {
            handleOpen(); // close modal
            resetForm();
            if (typeof onSuccess === 'function') onSuccess();
            else dispatch(fetchUsers());
          },
        })
      );
    },
  });

  const { touched, errors, resetForm } = formik;

  const handleClose = () => {
    handleOpen();
    resetForm();
  };

  const handlePasswordChange = () => {
    if (!newPassword || newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    dispatch(
      changeUserPassword({
        userId: user.id,
        newPassword,
        callback: () => {
          setNewPassword('');
          setShowPasswordField(false);
        },
      })
    );
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
      className="!bg-light-surface dark:!bg-dark-surface"
    >
      <FormikProvider value={formik}>
        <Form>
          <DialogHeader className="text-light-text dark:text-dark-text">
            Update for {user.full_name}
          </DialogHeader>

          <DialogBody className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
            <Typography
              variant="h6"
              className="text-light-text dark:text-dark-text mb-2"
            >
              Select Services
            </Typography>

            {touched.service_ids && errors.service_ids && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.service_ids}
              </Typography>
            )}

            {allServices?.length === 0 ? (
              <Typography className="text-sm text-light-text dark:text-dark-text">
                No services available to assign.
              </Typography>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {allServices.map((service) => (
                  <Checkbox
                    key={service.id}
                    name="service_ids"
                    value={service.id}
                    label={service.name}
                    showError={false}
                  />
                ))}
              </div>
            )}
          </DialogBody>

          {/* Password Change Section */}

          <div className="border-t border-light-border dark:border-dark-border px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <Typography className="text-light-text dark:text-dark-text font-semibold">
                Change Password
              </Typography>
              <Button
                size="sm"
                variant="text"
                onClick={() => setShowPasswordField(!showPasswordField)}
                className="text-primary"
              >
                {showPasswordField ? 'Cancel' : 'Change'}
              </Button>
            </div>

            {showPasswordField && (
              <div className="gap-x-3 flex items-center justify-center">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  size="sm"
                  onClick={handlePasswordChange}
                  className="bg-primary hover:opacity-90"
                >
                  Update Password
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="space-x-2">
            <Button
              variant="outlined"
              onClick={handleClose}
              className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:opacity-90">
              Save
            </Button>
          </DialogFooter>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default ManageUserServicesModal;
