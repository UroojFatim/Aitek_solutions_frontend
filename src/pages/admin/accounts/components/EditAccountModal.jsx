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
import { Input, Checkbox, Select } from '@/shared/components/form';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinessById, updateBusiness } from '@/redux/actions/business.actions';
import { BusinessStatus } from '@/constants/business.constants';

const validationSchema = Yup.object({
    // Business Details
    businessName: Yup.string()
        .required('Business name is required')
        .min(2, 'Business name must be at least 2 characters'),
    businessAddress: Yup.string()
        .required('Business address is required'),
    businessEmail: Yup.string()
        .email('Invalid email address')
        .required('Business email is required'),
    businessPhone: Yup.string()
        .required('Business phone is required')
        .matches(/^[0-9()-\s]+$/, 'Invalid phone number format'),
    businessStatus: Yup.string()
        .required('Business status is required'),
    businessNpi: Yup.string()
        .required('NPI number is required')
        .matches(/^\d{10}$/, 'NPI number must be exactly 10 digits'),
});

const EditAccountModal = ({ open, handleOpen, accountData }) => {
    const { services } = useSelector((state) => state.services);
    const dispatch = useDispatch();

    const statusOptions = Object.entries(BusinessStatus).map(([key, value]) => ({
        value: value,
        label: value
    }));

    const formik = useFormik({
        initialValues: {
            businessNpi: accountData?.npi_number || "",
            businessName: accountData?.name || "",
            businessAddress: accountData?.address || "",
            businessEmail: accountData?.email || "",
            businessPhone: accountData?.phone || "",
            businessStatus: accountData?.status || ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const updateData = {
                name: values.businessName,
                address: values.businessAddress,
                email: values.businessEmail,
                phone: values.businessPhone,
                status: values.businessStatus,
                npi_number: values.businessNpi
            };

            await dispatch(updateBusiness({
                id: accountData.id,
                businessData: updateData,
                callback: () => {
                    handleOpen();
                    dispatch(fetchBusinessById(accountData.id));
                }
            }))

        },
        enableReinitialize: true
    });

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
                        Edit Account
                    </DialogHeader>
                    <DialogBody className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
                        {/* Business Details Section */}
                        <SectionTitle>Business Details</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="businessNpi"
                                label="NPI Number"
                                maxLength={10}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="businessName"
                                label="Business Name"
                            />
                            <Input
                                name="businessEmail"
                                type="email"
                                label="Business Email"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="businessPhone"
                                type="tel"
                                label="Business Phone"
                            />
                            <Input
                                name="businessAddress"
                                label="Business Address"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                name="businessStatus"
                                label="Business Status"
                                options={statusOptions}
                            />
                        </div>

                        {/* ...existing code... */}
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                        <Button
                            variant="outlined"
                            onClick={handleOpen}
                            className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:opacity-90"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </Form>
            </FormikProvider>
        </Dialog>
    );
};

export default EditAccountModal; 