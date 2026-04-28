import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Alert,
  Progress,
} from "@material-tailwind/react";
import { CloudArrowUpIcon, ExclamationCircleIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from 'react-redux';
import { getUploadUrl, uploadToAzure, confirmUpload, deleteDocument, getDownloadUrl, getMyDocuments } from '@/redux/actions/document.actions';
import { clearUploadData } from '@/redux/reducers/document.reducer';
import { ALLOWED_FILE_TYPES, getAcceptedFileExtensions, getSupportedFormatsText } from '@/constants/documents';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

const MyDocuments = () => {
  const dispatch = useDispatch();
  const { documents, error: reduxError } = useSelector((state) => state.documents);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    dispatch(getMyDocuments());
  }, [dispatch]);

  // Show error from Redux if present
  useEffect(() => {
    if (reduxError) {
      setError(typeof reduxError === 'string' ? reduxError : 'An error occurred during upload');
      setStatus('');
    }
  }, [reduxError]);

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 50MB');
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES[file.type]) {
      throw new Error('File type not supported. Please upload PDF, Word, Image, or Text files.');
    }

    return true;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');
    setMessage('');
    setStatus('');

    if (file) {
      try {
        validateFile(file);
        setSelectedFile(file);
      } catch (error) {
        setError(error.message);
        setSelectedFile(null);
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setMessage('');
    setError('');
    setStatus('');
    dispatch(clearUploadData());
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');
    setMessage('');

    try {
      // Step 1: Get pre-signed URL
      setStatus('Getting upload URL...');
      const uploadUrlResponse = await dispatch(getUploadUrl({
        fileData: {
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileSize: selectedFile.size
        }
      })).unwrap();

      // Step 2: Upload to Azure with progress tracking
      setStatus('Uploading Document...');
      await uploadToAzure(
        uploadUrlResponse.uploadUrl, 
        selectedFile,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Step 3: Confirm upload
      setStatus('Confirming upload...');
      await dispatch(confirmUpload({
        documentId: uploadUrlResponse.documentId,
        callback: () => {
          dispatch(getMyDocuments());
        }
      })).unwrap();

      setMessage('File uploaded successfully!');
      setStatus('');
      setUploadProgress(100);
      
      // Reset everything after a short delay
      setTimeout(resetUpload, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error?.response?.data?.message || error?.message || 'Upload failed. Please try again.');
      setStatus('');
    } finally {
      setUploading(false);
    }
  };

  // Helper function to get status/error message color
  const getMessageColor = () => {
    if (error) return "text-red-500";
    if (status) return "text-blue-500";
    if (message) return "text-green-500";
    return "";
  };

  // Helper function to get current message
  const getCurrentMessage = () => {
    if (error) return error;
    if (status) return status;
    if (message) return message;
    return "";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Section */}
      <Card className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
        <CardHeader
          floated={false}
          shadow={false}
          className="flex items-center justify-between p-6 pb-2 bg-transparent"
        >
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Upload Document
          </Typography>
          <IconButton variant="text" size="sm" className="text-light-muted dark:text-dark-muted">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </IconButton>
        </CardHeader>
        <CardBody className="p-6">
          <div className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl bg-light-background dark:bg-dark-background">
            <CloudArrowUpIcon className="w-12 h-12 text-light-text dark:text-dark-text opacity-75" />
            <div className="text-center">
              <Typography variant="h6" className="text-light-text dark:text-dark-text mb-2">
                Drop files here or click to upload
              </Typography>
              <Typography className="text-light-muted dark:text-dark-muted text-sm mb-4">
                Supported formats: {getSupportedFormatsText()}
                <br />
                Maximum file size: 50MB
              </Typography>
            </div>
            
            <Button 
              variant="outlined"
              className="normal-case flex items-center gap-2 relative border-primary text-light-text dark:text-dark-text"
            >
              <input
                type="file"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept={getAcceptedFileExtensions()}
              />
              Choose File
            </Button>
            
            {selectedFile && (
              <div className="mt-4 text-center">
                <Typography className="text-light-text dark:text-dark-text font-medium">
                  {selectedFile.name}
                </Typography>
                <Typography className="text-light-muted dark:text-dark-muted text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                
                {/* Upload Progress */}
                {uploading && (
                  <div className="w-full max-w-xs mt-4">
                    <Progress value={uploadProgress} size="sm" color="blue" className="h-1" />
                    <Typography className="text-light-muted dark:text-dark-muted text-sm mt-2">
                      {Math.round(uploadProgress)}%
                    </Typography>
                  </div>
                )}

                {/* Status/Error Message */}
                {getCurrentMessage() && (
                  <Typography className={`text-sm mt-2 ${getMessageColor()}`}>
                    {getCurrentMessage()}
                  </Typography>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="mt-4 normal-case bg-primary shadow-none hover:shadow-none"
                  color="blue"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Documents List */}
      <Card className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
        <CardHeader
          floated={false}
          shadow={false}
          className="flex items-center justify-between p-6 pb-2 bg-transparent"
        >
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            My Documents
          </Typography>
          <IconButton variant="text" size="sm" className="text-light-muted dark:text-dark-muted">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </IconButton>
        </CardHeader>
        <CardBody className="p-6">
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
                        {doc.original_name || doc.file_name}
                      </Typography>
                      <div className="flex flex-col gap-1">
                        <Typography className="text-light-muted dark:text-dark-muted text-sm">
                          Created: {new Date(doc.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography className="text-light-muted dark:text-dark-muted text-sm">
                          Size: {(doc.file_size / 1024).toFixed(2)} KB
                        </Typography>
                        <Typography className="text-light-muted dark:text-dark-muted text-sm">
                          Type: {ALLOWED_FILE_TYPES[doc.mime_type] || doc.mime_type}
                        </Typography>
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
                        fileName: doc.original_name || doc.file_name
                      }))}
                    >
                      Download
                    </Button>
                    <Button
                      variant="text"
                      size="sm"
                      color="red"
                      className="normal-case"
                      onClick={() => dispatch(deleteDocument({
                        documentId: doc.id,
                        callback: () => {
                          dispatch(getMyDocuments());
                          setMessage('Document deleted successfully');
                        }
                      }))}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Typography className="text-light-muted dark:text-dark-muted">
                No documents available
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MyDocuments; 