import React from 'react';
import FileUpload from '../FileUpload';

const UploadEmiratesId = ({ errors, setFormData }) => {
  const handleFileChange = (name, file) => {
    if (file) {
      setFormData(file); // Directly pass the File object to formik.setFieldValue
    }
  };
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Upload Emirates ID of Employees{' '}
      <span className='text-xs'>(for multiple id's please zip )</span>

      </label>
      
      <div className="flex w-full flex-col">
        <span>
          <div className="relative w-full">
            <FileUpload
              name="emiratesId"
              initialFileName=""
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}
              accept='.zip,.rar,.7zip,.pdf'

            />
          </div>
        </span>
        {/* <span>
          {errors.emiratesId && (
            <p style={{ color: 'red' }}>{errors.emiratesId}</p>
          )}
        </span> */}
      </div>
    </div>
  );
};

export default UploadEmiratesId;
