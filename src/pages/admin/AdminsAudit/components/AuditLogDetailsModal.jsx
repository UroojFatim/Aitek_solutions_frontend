import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Chip
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AuditLogDetailsModal = ({ open, handleOpen, selectedLog }) => {
  if (!selectedLog) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'green';
    if (statusCode >= 400 && statusCode < 500) return 'amber';
    if (statusCode >= 500) return 'red';
    return 'blue-gray';
  };

  const getCrudOperationColor = (operation) => {
    const colors = {
      CREATE: 'green',
      READ: 'blue',
      UPDATE: 'amber',
      DELETE: 'red'
    };
    return colors[operation] || 'blue-gray';
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
      className="!bg-light-surface dark:!bg-dark-surface"
    >
      <DialogHeader className="flex justify-between items-start border-b border-light-border dark:border-dark-border">
        <div className="flex-1">
          <Typography variant="h4" className="text-light-text dark:text-dark-text">
            Audit Log Details
          </Typography>
          <Typography variant="small" className="font-normal text-light-muted dark:text-dark-muted mt-1">
            Detailed information about user action and system response
          </Typography>
        </div>
        <IconButton
          variant="text"
          size="sm"
          onClick={handleOpen}
          className="text-light-muted dark:text-dark-muted hover:text-primary"
        >
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[70vh]">
        <div className="space-y-6">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                User Name
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted">
                {selectedLog.user_name}
              </Typography>
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                User Email
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted">
                {selectedLog.user_email}
              </Typography>
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                User Role
              </Typography>
              <Chip
                value={selectedLog.user_role}
                size="sm"
                className="w-fit"
              />
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                Action
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted">
                {selectedLog.action}
              </Typography>
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                CRUD Operation
              </Typography>
              <Chip
                value={selectedLog.crud_operation}
                color={getCrudOperationColor(selectedLog.crud_operation)}
                size="sm"
                className="w-fit"
              />
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                HTTP Method
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted font-mono">
                {selectedLog.method}
              </Typography>
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                Endpoint
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted font-mono text-sm break-all">
                {selectedLog.endpoint}
              </Typography>
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                Status Code
              </Typography>
              <Chip
                value={selectedLog.status_code}
                color={getStatusColor(selectedLog.status_code)}
                size="sm"
                className="w-fit"
              />
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                IP Address
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted font-mono">
                {selectedLog.ip_address || 'N/A'}
              </Typography>
            </div>
            
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <Typography className="font-medium text-light-text dark:text-dark-text mb-2">
                Timestamp
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted">
                {formatDate(selectedLog.created_at)}
              </Typography>
            </div>
          </div>

          {/* Request Data Section */}
          {selectedLog.request_data && (
            <div className="pt-4">
              <Typography variant="h6" className="text-light-text dark:text-dark-text mb-4 pb-2 border-b border-light-border dark:border-dark-border">
                Request Data
              </Typography>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
                <pre className="text-xs font-mono text-light-text dark:text-dark-text whitespace-pre-wrap overflow-auto max-h-60 leading-relaxed">
                  {typeof selectedLog.request_data === 'string' 
                    ? selectedLog.request_data 
                    : JSON.stringify(selectedLog.request_data, null, 2)
                  }
                </pre>
              </div>
            </div>
          )}

          {/* Response Data Section */}
          {selectedLog.response_data && (
            <div className="pt-4">
              <Typography variant="h6" className="text-light-text dark:text-dark-text mb-4 pb-2 border-b border-light-border dark:border-dark-border">
                Response Data
              </Typography>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
                <pre className="text-xs font-mono text-light-text dark:text-dark-text whitespace-pre-wrap overflow-auto max-h-60 leading-relaxed">
                  {typeof selectedLog.response_data === 'string' 
                    ? selectedLog.response_data 
                    : JSON.stringify(selectedLog.response_data, null, 2)
                  }
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default AuditLogDetailsModal;
