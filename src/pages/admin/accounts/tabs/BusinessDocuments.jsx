import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessDocuments, getDownloadUrl } from '@/redux/actions/document.actions';
import { ALLOWED_FILE_TYPES } from '@/constants/documents';

const BusinessDocuments = ({selectedBusiness}) => {
  const dispatch = useDispatch();
  const { documents } = useSelector((state) => state.documents);

  useEffect(() => {
    if (selectedBusiness?.id) {
      dispatch(getBusinessDocuments(selectedBusiness.id));
    }
  }, [dispatch, selectedBusiness]);

  return (
    <Card className="rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none p-6 !bg-light-surface dark:!bg-dark-surface"
      >
        <Typography variant="h5" className="text-light-text dark:text-dark-text">
          My Documents
        </Typography>
      </CardHeader>
      <CardBody className="px-6 pt-0 !bg-light-surface dark:!bg-dark-surface">
        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-background dark:hover:bg-dark-background transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <Typography className="text-light-text dark:text-dark-text font-medium">
                      {doc.original_name || doc.name}
                    </Typography>
                    <div className="flex flex-col gap-1">
                      <Typography className="text-light-muted dark:text-dark-muted text-sm">
                        Created: {new Date(doc.createdAt).toLocaleDateString()}
                      </Typography>
                      {doc.file_size && (
                        <Typography className="text-light-muted dark:text-dark-muted text-sm">
                          Size: {(doc.file_size / 1024).toFixed(2)} KB
                        </Typography>
                      )}
                      {doc.mime_type && (
                        <Typography className="text-light-muted dark:text-dark-muted text-sm">
                          Type: {ALLOWED_FILE_TYPES[doc.mime_type] || doc.mime_type}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="text"
                    size="sm"
                    className="normal-case text-light-text dark:text-dark-text"
                    onClick={() => dispatch(getDownloadUrl({
                      documentId: doc.id,
                      fileName: doc.original_name || doc.name
                    }))}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography className="text-light-muted dark:text-dark-muted text-center py-8">
            No documents available
          </Typography>
        )}
      </CardBody>
    </Card>
  );
};

export default BusinessDocuments; 