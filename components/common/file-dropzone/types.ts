export interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  acceptedFormats?: string[];
  maxSizeBytes?: number;
  title?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}
