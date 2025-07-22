import React from 'react';
import FileUpload from '../FileUpload';

const UploadScopeOfWork = ({ errors, setFormData }) => {
  const handleFileChange = (name, file) => {
    if (file) {
      setFormData(file); // Directly pass the File object to formik.setFieldValue
    }
  };
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Upload Detailed Scope of Work <span className="text-[#B2282F]">*</span>
      </label>
      <div className="flex w-full flex-col">
        {' '}
        <span>
          <div className="relative w-full">
            <FileUpload
              name="detailedScopeofWork"
              initialFileName=""
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}
              accept='.zip,.rar,.7zip,.pdf'

            />
            
          </div>
        </span>
        <span>
          {errors.detailedScopeofWork && (
            <p style={{ color: 'red' }}>{errors.detailedScopeofWork}</p>
          )}
        </span>
      </div>
    </div>
  );
};

export default UploadScopeOfWork;
