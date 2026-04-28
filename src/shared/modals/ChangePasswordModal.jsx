import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/shared/components/form';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '@/redux/actions/auth.action';

const validationSchema = Yup.object({
  current_password: Yup.string()
    .required('Current password is required'),
  new_password: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  confirm_password: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
});

const ChangePasswordModal = ({ open, handleOpen, isInitialPasswordChange = false }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  
  const formik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(changePassword({
          current_password: values.current_password,
          new_password: values.new_password,
          callback: () => {
            // Close modal and reset form on success
            handleOpen();
            resetForm();
          }
        }));
      } catch (error) {
        console.error('Error changing password:', error);
      }
    },
  });

  const { resetForm } = formik;

  return (
    <Dialog
      open={open}
      handler={isInitialPasswordChange ? undefined : handleOpen}
      className="!bg-light-surface dark:!bg-dark-surface"
      size="md"
    >
      <FormikProvider value={formik}>
        <Form>
          <DialogHeader className="text-light-text dark:text-dark-text">
            {isInitialPasswordChange ? 'Welcome! Change Your Password' : 'Change Password'}
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4">
            <Typography variant="small" className="text-light-muted dark:text-dark-muted mb-4">
              {isInitialPasswordChange 
                ? 'Welcome to your account! For security reasons, please change your initial password to continue.'
                : 'Please enter your current password and choose a new password.'
              }
            </Typography>
            
            {error && (
              <Typography color="red" className="text-sm mb-2">
                {error}
              </Typography>
            )}
            
            <Input
              name="current_password"
              type="password"
              label="Current Password"
            />
            
            <Input
              name="new_password"
              type="password"
              label="New Password"
            />
            
            <Input
              name="confirm_password"
              type="password"
              label="Confirm New Password"
            />
          </DialogBody>
          <DialogFooter className="space-x-2">
            {!isInitialPasswordChange && (
              <Button
                variant="outlined"
                onClick={() => {
                  handleOpen();
                  resetForm();
                }}
                className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="bg-primary hover:opacity-90"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Changing...' : (isInitialPasswordChange ? 'Set New Password' : 'Change Password')}
            </Button>
          </DialogFooter>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default ChangePasswordModal; 