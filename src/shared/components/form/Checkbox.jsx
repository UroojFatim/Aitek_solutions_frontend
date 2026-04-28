import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Checkbox as MTCheckbox, Typography } from "@material-tailwind/react";

const Checkbox = ({ label, checked, onChange, name, showError = true, ...props }) => {
  const formik = useFormikContext();
  
  // If inside Formik context, use Formik's field
  const [field, meta] = formik ? 
    useField({ ...props, type: 'checkbox', name }) : 
    [{ checked, onChange }, {}];

  return (
    <div className="flex flex-col">
      <MTCheckbox
        {...field}
        {...props}
        label={label}
        checked={formik ? field.checked : checked}
        onChange={formik ? field.onChange : onChange}
        error={meta.touched && meta.error ? true : false}
        className="text-primary hover:before:opacity-0"
        labelProps={{
          className: "text-light-text dark:text-dark-text pl-2"
        }}
        containerProps={{
          className: "p-0 gap-2"
        }}
      />
      {showError && meta.touched && meta.error && (
        <Typography color="red" className="mt-1 text-xs">
          {meta.error}
        </Typography>
      )}
    </div>
  );
};

export default Checkbox; 