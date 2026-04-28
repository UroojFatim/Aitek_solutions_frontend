import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Stepper,
  Step,
  IconButton,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Input, Select, Checkbox, Textarea, DatePicker } from '@/shared/components/form';
import { TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import {  submitServiceOnboarding } from '@/redux/actions/serviceOnboarding.actions';

const ServiceOnboardingFormModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [sections, setSections] = useState([]);
  const [newEntryData, setNewEntryData] = useState({});

  
  const {serviceDetails, progressTracking} = useSelector(state => state.service_onboarding);
  
  useEffect(() => {
    if (serviceDetails?.sections) {
      // Sort sections by section_order before setting them
      const sortedSections = [...serviceDetails.sections].sort((a, b) => a.section_order - b.section_order);
      setSections(sortedSections);
    }
  }, [serviceDetails]);
  

  useEffect(() => {
    if (progressTracking.step_number) {
      setCurrentStep(progressTracking.step_number - 1);
    }
  }, [progressTracking]);

  useEffect(() => {
    console.log("currentStep", currentStep);
    console.log("sections.length", sections.length);
  }, [currentStep, sections]);



  // Create dynamic validation schema based on current section
  const validationSchema = useMemo(() => {
    if (!sections || !sections[currentStep]) return Yup.object({});

    const currentSection = sections[currentStep];
    console.log("currentSection", currentSection);
    const schemaShape = {};

    currentSection.questions?.forEach((question) => {
      // const { field_name, yup_validation } = question;
      const { field_name } = question;
      const yup_validation = question.yup_validation || { type: 'string' };
      let schema;

      switch ((yup_validation.type || 'string')) {
        case 'string':
          schema = Yup.string();
          if (yup_validation.required) schema = schema.required(`${question.label} is required`);
          if (yup_validation.min) schema = schema.min(yup_validation.min, `Must be at least ${yup_validation.min} characters`);
          if (yup_validation.max) schema = schema.max(yup_validation.max, `Must be at most ${yup_validation.max} characters`);
          if (yup_validation.email) schema = schema.email('Invalid email address');
          if (yup_validation.url) schema = schema.url('Must be a valid URL');
          if (yup_validation.matches) schema = schema.matches(yup_validation.matches, 'Must match the pattern');
          break;

        case 'boolean':
          schema = Yup.boolean();
          if (yup_validation.required) schema = schema.required(`${question.label} is required`);
          break;

        case 'date':
          schema = Yup.date();
          if (yup_validation.required) schema = schema.required(`${question.label} is required`);
          break;

        case 'array':
          // Check if this is a checkbox field (array of strings) or table field (array of objects)
          if (question.field_type === 'checkbox') {
            // For checkbox fields, validate as array of strings
            schema = Yup.array().of(Yup.string());
            if (yup_validation.required) schema = schema.required(`${question.label} is required`);
            if (yup_validation.min) schema = schema.min(yup_validation.min, `At least ${yup_validation.min} option(s) required`);
          } else {
            // For table fields, validate as array of objects
            const tableItemSchema = {};

            // Build validation for each column in the table
            question.options?.forEach((option) => {
              let fieldSchema;

              switch (option.type) {
                case 'email':
                  fieldSchema = Yup.string().email('Invalid email address');
                  break;
                case 'tel':
                  fieldSchema = Yup.string();
                  break;
                case 'select':
                  fieldSchema = Yup.string();
                  break;
                case 'text':
                default:
                  fieldSchema = Yup.string();
                  break;
              }

              if (option.required) {
                fieldSchema = fieldSchema.required(`${option.label} is required`);
              }

              tableItemSchema[option.field] = fieldSchema;
            });

            schema = Yup.array().of(Yup.object().shape(tableItemSchema));
            if (yup_validation.required) schema = schema.required(`${question.label} is required`);
            if (yup_validation.min) schema = schema.min(yup_validation.min, `At least ${yup_validation.min} item(s) required`);
          }
          break;

        default:
          schema = Yup.string();
          if (yup_validation.required) schema = schema.required(`${question.label} is required`);
      }

      schemaShape[field_name] = schema;
    });

    return Yup.object(schemaShape);
  }, [currentStep, sections]);

  // Create initial values based on current section
  const getInitialValues = () => {
    if (!sections || !sections[currentStep]) return {};

    const initialValues = {};
    sections[currentStep].questions?.forEach((question) => {
      const hasDefault = typeof question.default_value !== 'undefined' && question.default_value !== null && String(question.default_value).trim() !== '';
      switch (question.field_type) {
        case 'boolean':
          // initialValues[question.field_name] = false;
         initialValues[question.field_name] = hasDefault
        ? (String(question.default_value).toLowerCase() === 'true')
         : false; 
          break;

        case 'table':
          // initialValues[question.field_name] = []; // Start with empty array instead of [{}]
          initialValues[question.field_name] = hasDefault
         ? (Array.isArray(question.default_value)
            ? question.default_value
            : (() => { try { return JSON.parse(question.default_value); } catch { return []; } })())
         : [];
          break;

        case 'checkbox':
          // initialValues[question.field_name] = []; // Array for multiple selections
          initialValues[question.field_name] = hasDefault
         ? (Array.isArray(question.default_value)
            ? question.default_value
            : String(question.default_value).split(',').map(s => s.trim()).filter(Boolean))
         : [];
          break;

        case 'radio':
          // initialValues[question.field_name] = ''; // String for single selection
          initialValues[question.field_name] = hasDefault ? String(question.default_value) : '';
          break;
        case 'number':
          // initialValues[question.field_name] = '';
          initialValues[question.field_name] = hasDefault ? Number(question.default_value) : '';
          break;
        default:
          // initialValues[question.field_name] = '';
          initialValues[question.field_name] = hasDefault ? String(question.default_value) : '';
      }
    });
    return initialValues;
  };

  useEffect(() => {
    console.log("getInitialValues()", getInitialValues());
  }, []);

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Submit current step data and wait for response
        const result = await dispatch(submitServiceOnboarding({
          data: values,
          endpoint: sections[currentStep].section_name
        })).unwrap();

        // Only proceed if submission was successful
        if (result) {
          // Move to next step or close if last step
          if (currentStep < sections.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            onClose();
          }
        }
      } catch (error) {
        console.error('Error submitting onboarding step:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    console.log("formik.values", formik.values);
  }, [formik.values]);

  const handleClose = () => {
    setCurrentStep(0);
    formik.resetForm();
    onClose();
  };

  const renderField = (question) => {
    const { field_name, field_type, label, placeholder, options, is_required } = question;

    switch (field_type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            key={field_name}
            name={field_name}
            type={field_type}
            label={<>{label}{is_required && <span className="text-red-500 ml-1"> *</span>}</>}
          />
        );

      case 'textarea':
        return (
          <Textarea
            key={field_name}
            name={field_name}
            label={<>{label}{is_required && <span className="text-red-500 ml-1"> *</span>}</>}
            rows={3}
          />
        );

      case 'boolean':
        return (
          <div key={field_name} className="space-y-2">
            <Typography variant="h6" className="text-light-text font-normal dark:text-dark-text">
              {label}{is_required && <span className="text-red-500 ml-1"> *</span>}
            </Typography>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id={`${field_name}_yes`}
                  name={field_name}
                  value="true"
                  checked={formik.values[field_name] === true}
                  onChange={() => formik.setFieldValue(field_name, true)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor={`${field_name}_yes`}
                  className="ml-2 block text-sm font-medium text-light-text dark:text-dark-text cursor-pointer"
                >
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id={`${field_name}_no`}
                  name={field_name}
                  value="false"
                  checked={formik.values[field_name] === false}
                  onChange={() => formik.setFieldValue(field_name, false)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor={`${field_name}_no`}
                  className="ml-2 block text-sm font-medium text-light-text dark:text-dark-text cursor-pointer"
                >
                  No
                </label>
              </div>
            </div>
            {formik.touched[field_name] && formik.errors[field_name] && (
              <div className="text-red-500 text-sm mt-1">{formik.errors[field_name]}</div>
            )}
          </div>
        );

      case 'select':
        return (
          <Select
            key={field_name}
            name={field_name}
            label={<>{label}{is_required && <span className="text-red-500 ml-1"> *</span>}</>}
            options={options || []}
          />
        );

      case 'date':
        return (
          <Input
            key={field_name}
            name={field_name}
            label={<>{label}{is_required && <span className="text-red-500 ml-1"> *</span>}</>}
            type="date"
          />
        );

      case 'table':
        return (
          <div key={field_name} className="space-y-4">
            <Typography variant="h6" className="text-light-text dark:text-dark-text">
              {label}
            </Typography>

            {/* Form fields on top */}
            <div className="p-4 border border-light-border dark:border-dark-border rounded-lg space-y-3">
              <Typography variant="small" className="text-light-text dark:text-dark-text font-medium">
                Add New Entry
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options?.map((option) => (
                  option.type === 'select' ? (
                    <div key={`new_${option.field}`} className="space-y-1">
                      <label className="block text-sm font-medium text-light-text dark:text-dark-text">
                        {option.label}
                        {option.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <select
                        value={newEntryData[option.field] || ''}
                        onChange={(e) => {
                          setNewEntryData(prev => ({
                            ...prev,
                            [option.field]: e.target.value
                          }));
                        }}
                        className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md 
                                 bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select {option.label}</option>
                        {option.options?.map((selectOption) => (
                          <option key={selectOption.value} value={selectOption.value}>
                            {selectOption.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div key={`new_${option.field}`} className="space-y-1">
                      <label className="block text-sm font-medium text-light-text dark:text-dark-text">
                        {option.label}
                        {option.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={option.type}
                        value={newEntryData[option.field] || ''}
                        onChange={(e) => {
                          setNewEntryData(prev => ({
                            ...prev,
                            [option.field]: e.target.value
                          }));
                        }}
                        className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md 
                                 bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder={`Enter ${option.label}`}
                      />
                    </div>
                  )
                ))}
              </div>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => {
                  // Validate required fields
                  const isValid = options?.every(option =>
                    !option.required || newEntryData[option.field]
                  );

                  if (isValid) {
                    const newValues = [...(formik.values[field_name] || []), newEntryData];
                    formik.setFieldValue(field_name, newValues);
                    // Clear form after adding
                    setNewEntryData({});
                  } else {
                    // Show validation error or highlight required fields
                    console.log('Please fill all required fields');
                  }
                }}
                className="border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
              >
                Add Entry
              </Button>
            </div>

            {/* Data table */}
            {formik.values[field_name]?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border border-light-border dark:border-dark-border rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-light-text dark:text-dark-text font-medium border-b border-light-border dark:border-dark-border">
                        #
                      </th>
                      {options?.map((option) => (
                        <th
                          key={option.field}
                          className="px-4 py-2 text-left text-light-text dark:text-dark-text font-medium border-b border-light-border dark:border-dark-border"
                        >
                          {option.label}
                        </th>
                      ))}
                      <th className="px-4 py-2 text-center text-light-text dark:text-dark-text font-medium border-b border-light-border dark:border-dark-border">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formik.values[field_name]?.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-2 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">
                          {index + 1}
                        </td>
                        {options?.map((option) => (
                          <td
                            key={option.field}
                            className="px-4 py-2 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border"
                          >
                            {option.type === 'select'
                              ? (option.options?.find(opt => opt.value === row[option.field])?.label || '-')
                              : (row[option.field] || '-')}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center border-b border-light-border dark:border-dark-border">
                          <Button
                            size="sm"
                            variant="outlined"
                            color="red"
                            onClick={() => {
                              const newValues = [...formik.values[field_name]];
                              newValues.splice(index, 1);
                              formik.setFieldValue(field_name, newValues);
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Display validation errors for table */}
            {formik.touched[field_name] && formik.errors[field_name] && (
              <div className="text-red-500 text-sm mt-1">{formik.errors[field_name]}</div>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field_name} className="space-y-3">
            <Typography variant="h6" className="text-light-text dark:text-dark-text">
              {label} {is_required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <div className="space-y-2">
              {options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field_name}_${option.value}`}
                    name={field_name}
                    value={option.value}
                    checked={formik.values[field_name] === option.value}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label
                    htmlFor={`${field_name}_${option.value}`}
                    className="ml-3 block text-sm font-medium text-light-text dark:text-dark-text cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched[field_name] && formik.errors[field_name] && (
              <div className="text-red-500 text-sm mt-1">{formik.errors[field_name]}</div>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field_name} className="space-y-3">
            <Typography variant="h6" className="text-light-text dark:text-dark-text">
              {label} {is_required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <div className="space-y-2">
              {options?.map((option) => (
                <div key={option.value}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${field_name}_${option.value}`}
                      name={field_name}
                      value={option.value}
                      checked={
                        option.value.toLowerCase() === 'other'
                          ? formik.values[`${field_name}_other_checked`] || false
                          : formik.values[field_name]?.includes(option.value) || false
                      }
                      onChange={(e) => {
                        const currentValues = formik.values[field_name] || [];

                        if (option.value.toLowerCase() === 'other') {
                          // Handle "other" checkbox specially
                          if (e.target.checked) {
                            // Just mark as checked, don't add to array yet
                            formik.setFieldValue(`${field_name}_other_checked`, true);
                          } else {
                            // Remove the "other" flag and any custom text from array
                            formik.setFieldValue(`${field_name}_other_checked`, false);
                            const otherText = formik.values[`${field_name}_other_text`] || '';
                            if (otherText) {
                              const filteredValues = currentValues.filter(val => val !== otherText);
                              formik.setFieldValue(field_name, filteredValues);
                            }
                            formik.setFieldValue(`${field_name}_other_text`, '');
                          }
                        } else {
                          // Handle regular options
                          if (e.target.checked) {
                            formik.setFieldValue(field_name, [...currentValues, option.value]);
                          } else {
                            formik.setFieldValue(field_name, currentValues.filter(val => val !== option.value));
                          }
                        }
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`${field_name}_${option.value}`}
                      className="ml-3 block text-sm font-medium text-light-text dark:text-dark-text cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>

                  {/* Show input field when "other" option is checked */}
                  {option.value.toLowerCase() === 'other' &&
                    formik.values[`${field_name}_other_checked`] && (
                      <div className="mt-2 ml-7">
                        <Input
                          name={`${field_name}_other_input`}
                          type="text"
                          label="Please specify..."
                          value={formik.values[`${field_name}_other_text`] || ''}
                          onChange={(e) => {
                            const currentValues = formik.values[field_name] || [];
                            const previousOtherText = formik.values[`${field_name}_other_text`] || '';
                            const newText = e.target.value.trim();

                            // Remove previous "other" text from array if it exists
                            let updatedValues = currentValues;
                            if (previousOtherText) {
                              updatedValues = currentValues.filter(val => val !== previousOtherText);
                            }

                            // Add new text to array if it's not empty
                            if (newText) {
                              updatedValues = [...updatedValues, newText];
                            }

                            // Update the form values
                            formik.setFieldValue(field_name, updatedValues);
                            formik.setFieldValue(`${field_name}_other_text`, newText);
                          }}
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
            {formik.touched[field_name] && formik.errors[field_name] && (
              <div className="text-red-500 text-sm mt-1">{formik.errors[field_name]}</div>
            )}
          </div>
        );

      case 'number':
        return (
          <Input
            key={field_name}
            name={field_name}
            type="number"
            label={label}
            placeholder={placeholder}
            required={is_required}
          />
        );

      default:
        return (
          <Input
            key={field_name}
            name={field_name}
            label={label}
            required={is_required}
          />
        );
    }
  };

  if (currentStep >= sections.length && sections.length > 0) {
    return (
      <Dialog
        open={isOpen}
        handler={handleClose}
        className="!bg-light-surface dark:!bg-dark-surface"
        size="md"
      >
        <DialogHeader className="text-light-text dark:text-dark-text flex items-center gap-3">
          <CheckCircleIcon className="h-8 w-8 text-green-500" />
          <Typography variant="h4">All Steps Completed!</Typography>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <Typography className="text-light-text dark:text-dark-text flex items-start gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <span>Congratulations! You have successfully completed {serviceDetails.name} Onboarding steps.</span>
            </Typography>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <Typography className="text-light-text dark:text-dark-text flex items-start gap-3">
              <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <span>If you need any additional assistance or have questions about another Service, please don't hesitate to contact your administrator. They're here to help ensure your service onboarding experience is smooth and successful.</span>
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={handleClose}
            className="bg-primary flex items-center gap-2"
          >
            <CheckCircleIcon className="h-5 w-5" />
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }

  if (!sections || sections.length === 0) {
    return null;
  }

  const currentSection = sections[currentStep];
  if (!currentSection) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      className="!bg-light-surface dark:!bg-dark-surface"
      size="xl"
    >

       <FormikProvider value={formik}> 
         <Form> 

          <DialogBody className="flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
            {/* Disclaimer - show only for 24/7 Smile Support */}
            {serviceDetails?.name === '24/7 Smile Support' && (
              <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <Typography className="text-red-700 dark:text-red-300 text-sm font-medium flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg flex-shrink-0">⚠</span>
                  <span>Some fields are pre-filled for your convenience. Please review and update as needed. By submitting, you confirm all information is accurate and current.</span>
                </Typography>
              </div>
            )}

            {/* Stepper */}
            <Stepper activeStep={currentStep} className="mb-6">
              {sections.map((section, index) => (
                <Step
                  key={section.id}
                  className={`
                    ${index <= currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}
                    w-8 h-8 rounded-full flex items-center justify-center
                  `}
                >
                  <Typography variant="small" className="text-white font-bold">
                    {index + 1}
                  </Typography>
                </Step>
              ))}
            </Stepper>

            {/* Current Section */} 
            <div className="space-y-6">
              <div>
                <Typography variant="h5" className="text-light-text dark:text-dark-text mb-2">
                  {currentSection.section_title}
                </Typography>
                {currentSection.section_description && (
                  <Typography variant="paragraph" className="text-light-muted dark:text-dark-muted">
                    {currentSection.section_description}
                  </Typography>
                )}
              </div>

              {/* Questions */}
             <div className="space-y-4">
                {[...currentSection.questions]
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((question) => renderField(question))}
              </div> 
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

             <Button
              type="submit"
              className="bg-primary"
              disabled={formik.isSubmitting}
            >
              {currentStep === sections.length - 1 ? 'Submit' : 'Next'}
            </Button> 
          </DialogFooter>
        </Form>
      </FormikProvider>

    </Dialog>
  );
};

export default ServiceOnboardingFormModal;