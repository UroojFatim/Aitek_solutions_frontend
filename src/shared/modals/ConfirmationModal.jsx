import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

const ConfirmationModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      handler={onCancel}
      size="sm"
      className="!bg-light-surface dark:!bg-dark-surface"
    >
      <DialogHeader className="text-light-text dark:text-dark-text flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 text-red-600 dark:text-red-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c.866 1.5 2.926 2.871 5.303 2.871 2.378 0 4.437-1.371 5.303-2.871M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span>{title}</span>
      </DialogHeader>

      <DialogBody className="text-light-text dark:text-dark-text">
        <Typography className="text-base font-normal">
          {message}
        </Typography>
      </DialogBody>

      <DialogFooter className="space-x-3 py-4">
        <Button
          variant="text"
          color="gray"
          onClick={onCancel}
          disabled={isLoading}
          className="text-light-text dark:text-dark-text"
        >
          {cancelText}
        </Button>
        <Button
          color={confirmColor}
          onClick={onConfirm}
          loading={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationModal;
