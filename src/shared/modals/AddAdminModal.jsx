// shared/components/modals/AddAdminModal.jsx
import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { FormikProvider, Form, useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Select } from '@/shared/components/form';
import { useDispatch } from 'react-redux';
import { addAdmin, fetchAdmins } from '@/redux/actions/user.actions';
import toast from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  full_name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters'),
  role: Yup.string().required('Role is required'),
});

const AddAdminModal = ({ open, handleOpen }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      password: '',
      role: 'Admin',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(addAdmin(values));
        dispatch(fetchAdmins());
        resetForm();
        handleOpen();
      } catch (error) {
        toast.error('Failed to add admin:', error);
      }
    },
  });

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="md"
      className="!bg-light-surface dark:!bg-dark-surface"
    >
      <FormikProvider value={formik}>
        <Form>
          <DialogHeader className="text-light-text dark:text-dark-text">
            Add Admin
          </DialogHeader>

          <DialogBody className="flex flex-col gap-4">
            <Typography variant="small" className="text-light-muted dark:text-dark-muted">
              Fill the form to create a new admin.
            </Typography>

            <Input name="full_name" label="Name" />
            <Input name="email" label="Email" type="email" />
            <Input name="password" label="Password" type="password" />
            <Select
              name="role"
              label="Role"
              options={[
                { label: 'Admin', value: 'Admin' },
              ]}
            />
          </DialogBody>

          <DialogFooter className="space-x-2">
            <Button
              variant="outlined"
              onClick={() => {
                handleOpen();
                formik.resetForm();
              }}
              className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:opacity-90"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Adding...' : 'Add Admin'}
            </Button>
          </DialogFooter>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddAdminModal;
