import React from 'react';
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

import { Input, Checkbox } from '@/shared/components/form';
import { addUser, fetchUsers } from '@/redux/actions/user.actions';

const validationSchema = Yup.object({
  full_name: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  service_ids: Yup.array()
    .min(1, 'At least one service must be selected')
    .required('Services are required'),
});

const CreateUserModal = ({ open, handleOpen, allServices, businessId: overrideBusinessId = null, onSuccess }) => {
  const dispatch = useDispatch();

  // 🔹 Get logged-in business details from Redux
  const { businessDetails } = useSelector((state) => state.business);

  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      password: '',
      service_ids: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // choose explicit override business id if provided (e.g. admin page)
      const business_id = overrideBusinessId || businessDetails?.id;

      dispatch(
        addUser({
          data: {
            ...values,
            business_id, // 👉 pass business id with payload
          },
          callback: () => {
            handleOpen();
            resetForm();
            if (onSuccess) onSuccess();
            else dispatch(fetchUsers());
          },
        })
      );
    },
  });

  const { resetForm, touched, errors } = formik;

  const handleClose = () => {
    handleOpen();
    resetForm();
  };

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
            Create New User
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
            {/* User Details */}
            <Typography
              variant="h6"
              className="text-light-text dark:text-dark-text mb-2"
            >
              User Details
            </Typography>

            <div className="grid grid-cols-2 gap-4">
              <Input name="full_name" label="Full Name" />
              <Input name="email" type="email" label="Email" />
            </div>
            <Input name="password" type="password" label="Password" />

            {/* Divider */}
            <div className="w-full h-px bg-light-border dark:bg-dark-border my-4" />

            {/* Services */}
            <Typography
              variant="h6"
              className="text-light-text dark:text-dark-text mb-2"
            >
              Assign Services
            </Typography>

            {touched.service_ids && errors.service_ids && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.service_ids}
              </Typography>
            )}

            <div className="grid grid-cols-2 gap-3">
              {allServices?.map((service) => (
                <Checkbox
                  key={service.id}
                  name="service_ids"
                  value={service.id}
                  label={service.name}
                  showError={false}
                />
              ))}
            </div>
          </DialogBody>

          <DialogFooter className="space-x-2">
            <Button
              variant="outlined"
              onClick={handleClose}
              className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:opacity-90">
              Create
            </Button>
          </DialogFooter>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default CreateUserModal;
