import React from 'react';
import { useField } from 'formik';
import { Textarea as MTTextarea, Typography } from "@material-tailwind/react";

const Textarea = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="w-full">
      <MTTextarea
        {...field}
        {...props}
        label={label}
        error={meta.touched && meta.error ? true : false}
        // className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface focus:!border-primary min-h-[100px]"
        className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
        labelProps={{
          className: "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70 peer-focus:!text-primary"
        }}
        containerProps={{
          className: "min-w-[50px]"
        }}
      />
      {meta.touched && meta.error && (
        <Typography color="red" className="mt-1 text-xs">
          {meta.error}
        </Typography>
      )}
    </div>
  );
};

export default Textarea; 