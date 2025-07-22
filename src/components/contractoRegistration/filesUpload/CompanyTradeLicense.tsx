import React from 'react';
import FileUpload from '../../Interaction Form/FileUpload';

interface CompanyTradeLicenseProps {
  setFormData: (callback: (prevData: any) => any) => void;
  errors: {
    companyTradeLicense?: string;
  };
  touched?: boolean;
  onBlur?: () => void;
}

interface FileChangeData {
  name: string;
  file: File | null;
}

const CompanyTradeLicense: React.FC<CompanyTradeLicenseProps> = ({ 
  setFormData, 
  errors,
  touched,
  onBlur 
}) => {
  const [fileError, setFileError] = React.useState<string>('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState(false);

  const validateFile = (file: File | null): string => {
    if (!file) {
      return 'Company Trade License is required';
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size should not exceed 5MB';
    }

    // Check file type
    const allowedTypes = ['.zip', '.rar', '.7zip', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return 'Invalid file type. Please upload a ZIP, RAR, 7ZIP, or PDF file';
    }

    return '';
  };

  const handleFileChange = (name: string, file: File | null) => {
    const error = file ? validateFile(file) : 'Company Trade License is required';
    setFileError(error);
    setHasAttemptedSubmit(true);

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: file || '',
      errors: {
        ...prevData.errors,
        companyTradeLicense: error
      }
    }));
  };

  // Show error if the field is touched or form has been attempted to submit
  const shouldShowError = (touched || hasAttemptedSubmit) && (fileError || errors.companyTradeLicense);

  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-start md:gap-12">
      <label className="mb-1 block text-sm font-normal md:w-[30%]">
        Copy of Company Trade License
        <span className="text-[#B2282F]">*</span>
      </label>

      <div className="flex w-full flex-col md:w-[70%]">
        <div className="relative w-full">
          <FileUpload
            name="companyTradeLicense"
            initialFileName="Upload File"
            initialFileSize=""
            onFileChange={(name: string, file: File | null) => handleFileChange(name, file)}
            accept=".zip,.rar,.7zip,.pdf"
          />
          {shouldShowError && (
            <p className="mt-1 text-sm text-[#B2282F]">
              {fileError || errors.companyTradeLicense}
            </p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CompanyTradeLicense;
