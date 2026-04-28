import React, { useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useSelector, useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Input, Checkbox } from '@/shared/components/form';
import { createBusiness, fetchBusinesses } from '@/redux/actions/business.actions';

const validationSchema = Yup.object({
  // User Details
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

  // Business Details
  business_name: Yup.string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters'),
  business_email: Yup.string()
    .email('Invalid email address')
    .required('Business email is required'),
  business_phone: Yup.string()
    .required('Business phone is required')
    .matches(/^[0-9()-\s]+$/, 'Invalid phone number format'),
  business_address: Yup.string()
    .required('Business address is required'),
  business_npi: Yup.string()
    .required('NPI number is required')
    .matches(/^\d{10}$/, 'NPI number must be exactly 10 digits'),
  // Services
  service_ids: Yup.array()
    .min(1, 'At least one service must be selected')
    .required('Services are required'),
});

const CreateAccountModal = ({ open, handleOpen }) => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.services);

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      business_name: "",
      business_email: "",
      business_phone: "",
      business_address: "",
      business_npi: "",
      service_ids: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(createBusiness(
        {
          data: {
            ...values,
            npi_number: values.business_npi // Map to backend field name
          },
          callback: () => {
            handleOpen();
            resetForm();
            dispatch(fetchBusinesses());
          }
        }
      ));
    },
  });

  const { resetForm } = formik;

  const SectionTitle = ({ children }) => (
    <Typography variant="h6" className="text-light-text dark:text-dark-text mb-4">
      {children}
    </Typography>
  );

  const Divider = () => (
    <div className="w-full h-px bg-light-border dark:bg-dark-border my-6"></div>
  );

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="!bg-light-surface dark:!bg-dark-surface"
      size="lg"
    >
      <FormikProvider value={formik}>
        <Form>
          <DialogHeader className="text-light-text dark:text-dark-text">
            Create New Account
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
            {/* User Details Section */}
            <SectionTitle>User Details</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="full_name"
                label="Full Name"
              />
              <Input
                name="email"
                type="email"
                label="Email"
              />
            </div>
            <Input
              name="password"
              type="password"
              label="Password"
            />

            <Divider />

            {/* Business Details Section */}
            <SectionTitle>Business Details</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="business_name"
                label="Business Name"
              />
              <Input
                name="business_email"
                type="email"
                label="Business Email"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="business_phone"
                type="tel"
                label="Business Phone"
              />
              <Input
                name="business_address"
                label="Business Address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="business_npi"
                label="NPI Number"

                maxLength={10}
              />
            </div>

            <Divider />

            {/* Services Section */}
            <SectionTitle>Services</SectionTitle>
            {formik.touched.service_ids && formik.errors.service_ids && (
              <Typography color="red" className="mt-1 text-xs">{formik.errors.service_ids}</Typography>
            )}
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
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
              onClick={() => {
                handleOpen();
                resetForm();
              }}
              className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:opacity-90"
            >
              Create
            </Button>
          </DialogFooter>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default CreateAccountModal; 