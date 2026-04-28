export const ALLOWED_FILE_TYPES = {
  // Document formats
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'application/vnd.ms-powerpoint': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  
  // Image formats
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'image/gif': 'Image',
  
  // Text format
  'text/plain': 'Text',
  
  // Video formats
  'video/mp4': 'Video',
  'video/mpeg': 'Video',
  'video/quicktime': 'Video',
  'video/x-msvideo': 'Video',
  'video/webm': 'Video'
};

// Helper function to get file extensions for accept attribute
export const getAcceptedFileExtensions = () => {
  return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.mp4,.mpeg,.mov,.avi,.webm';
};

// Helper function to get supported formats text
export const getSupportedFormatsText = () => {
  return 'PDF, Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), Images (JPG, PNG, GIF), Text, Videos (MP4, MPEG, MOV, AVI, WebM)';
}; 