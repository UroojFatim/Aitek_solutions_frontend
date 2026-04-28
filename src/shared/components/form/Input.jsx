import React from 'react';
import { useField } from 'formik';
import { Input as MTInput, Typography } from "@material-tailwind/react";

const Input = ({ label, isRequired = false, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="w-full">
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: var(--text-color);
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px var(--surface-color);
        }

        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
          --text-color: #ffffff;
          --surface-color: rgb(30, 41, 59);
        }

        :root {
          --text-color: #1e293b;
          --surface-color: #ffffff;
        }
      `}</style>
      <MTInput
        {...field}
        {...props}
        label={label}
        error={meta.touched && meta.error ? true : false}
        // className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface focus:!border-primary"
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

export default Input; 