import React from 'react';
import FileUpload from '../../Interaction Form/FileUpload';

  const VehicleRegistration = ({ setFormData, 
    errors,
    touched,
    onBlur  }) => {
  const [fileError, setFileError] = React.useState<string>('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState(false);

  const handleFileChange = (name: string, file: File | null) => {
    const error = file ? validateFile(file) : 'Vehicle Registration is required';
    setFileError(error);
    setHasAttemptedSubmit(true);

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: file || '',
      errors: {
        ...prevData.errors,
        vehicleRegistration: error
      }
    }));
  };

  // Show error if the field is touched or form has been attempted to submit
    const shouldShowError = (touched || hasAttemptedSubmit) && (fileError || errors.vehicleRegistration);
  const validateFile = (file: File | null): string => {
    if (!file) {
      return 'Vehicle Registration is required';
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
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
      	Color Copy of Vehicle’s Registration 
      <span className="text-[#B2282F]">*</span>

      </label>
      
      <div className="flex w-full flex-col md:w-[70%]" >
       
          <div className="relative w-full">
            <FileUpload
              name="vehicleRegistration"
              initialFileName="Upload File"
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}
              accept='.zip,.rar,.7zip,.pdf'
            />
          </div>
          {shouldShowError && (
            <p className="mt-1 text-sm text-[#B2282F]">
              {fileError || errors.vehicleRegistration}
            </p>
          )}


       
      </div>
    </div>
  );
};

export default VehicleRegistration;
