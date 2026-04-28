import React, { useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { Input } from '@/shared/components/form';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  role: Yup.string().required('Access level is required'),
});

const ShareSheetAccessModal = ({ isOpen, onClose, onShare, loading }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      role: 'writer',
    },
    validationSchema,
    onSubmit: (values) => {
      onShare(values.email, values.role);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      size="sm"
      className="!bg-light-surface dark:!bg-dark-surface"
    >
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader className="text-light-text dark:text-dark-text">
            Share Sheet Access
          </DialogHeader>
          <DialogBody className="space-y-4">
            <Typography variant="small" className="text-light-muted dark:text-dark-muted">
              Grant access to this Google Sheet by entering an email address below.
              The user will receive an email notification with access to the sheet.
            </Typography>

            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="user@example.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Typography variant="small" className="font-medium text-light-text dark:text-dark-text">
                Access Level
              </Typography>
              <Select
                label="Choose access level"
                value={formik.values.role}
                onChange={(val) => formik.setFieldValue('role', val)}
                disabled={loading}
                className="!bg-light-surface dark:!bg-dark-surface !text-light-text dark:!text-dark-text"
              >
                <Option value="writer">Editor (Can edit)</Option>
                <Option value="commenter">Commenter (Can comment)</Option>
                <Option value="reader">Viewer (Can view only)</Option>
              </Select>
              <Typography variant="small" className="text-light-muted dark:text-dark-muted">
                Choose the level of access for this user
              </Typography>
            </div>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
              className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:opacity-90"
              disabled={loading || !formik.isValid}
            >
              {loading ? "Sharing..." : "Share Access"}
            </Button>
          </DialogFooter>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default ShareSheetAccessModal;
