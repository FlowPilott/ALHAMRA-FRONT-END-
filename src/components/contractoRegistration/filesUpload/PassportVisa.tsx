import React from 'react';
import FileUpload from '../../Interaction Form/FileUpload';

const PassportVisa = ({ setFormData, 
  errors,
  touched,
  onBlur  }) => {
  const [fileError, setFileError] = React.useState<string>('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState(false);

  const handleFileChange = (name: string, file: File | null) => {
    const error = file ? validateFile(file) : 'Passport Visa is required';
    setFileError(error);
    setHasAttemptedSubmit(true);

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: file || '',
      errors: {
        ...prevData.errors,
          passportVisa: error
      }
    }));
  };

  // Show error if the field is touched or form has been attempted to submit
  const shouldShowError = (touched || hasAttemptedSubmit) && (fileError || errors.passportVisa);
  const validateFile = (file: File | null): string => {
    if (!file) {
      return 'Passport Visa is required';
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
      Color Copies of Passport/Visa/Emirates Id with Same Company Name on Visa
        <span className="text-[#B2282F]">*</span>

      </label>
      
      <div className="flex w-full flex-col md:w-[70%]" >
       
          <div className="relative w-full">
            <FileUpload
              name="passportVisa"
              initialFileName="Upload File"
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}

              accept='.zip,.rar,.7zip,.pdf'
            />
            {shouldShowError && (
            <p className="mt-1 text-sm text-[#B2282F]">
              {fileError || errors.passportVisa}
            </p>
          )}
          </div>
        

      </div>
    </div>
  );
};

export default PassportVisa;
