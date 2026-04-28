import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Select as MTSelect, Option, Typography } from "@material-tailwind/react";

const Select = ({ label, options, value, onChange, name, ...props }) => {
  const formik = useFormikContext();
  
  // If inside Formik context, use Formik's field
  const [field, meta, helpers] = formik ? useField({ name, ...props }) : [{ value, onChange: (val) => onChange(val) }, {}, {}];

  const handleChange = (val) => {
    if (formik) {
      helpers.setValue(val);
    } else {
      onChange(val);
    }
  };

  return (
    <div className="w-full">
      <MTSelect
        {...props}
        label={label}
        value={field.value}
        onChange={handleChange}
        error={meta.touched && meta.error ? true : false}
        className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
        labelProps={{
          className: "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text dark:peer-placeholder-shown:!text-dark-text"
        }}
        menuProps={{
          className: "!bg-light-surface dark:!bg-dark-surface"
        }}
      >
        {options.map((option) => (
          <Option 
            key={option.value} 
            value={option.value}
            className="text-light-text dark:text-dark-text hover:!bg-light-background dark:hover:!bg-dark-background"
          >
            {option.label}
          </Option>
        ))}
      </MTSelect>
      {meta.touched && meta.error && (
        <Typography color="red" className="mt-1 text-xs">
          {meta.error}
        </Typography>
      )}
    </div>
  );
};

export default Select; 