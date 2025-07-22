import React from 'react';
import FileUpload from '../FileUpload';

const ProposedLayoutDrawing = ({ setFormData, errors }) => {
  const handleFileChange = (name, file) => {
    if (file) {
      setFormData(file); // Directly pass the File object to formik.setFieldValue
    }
  };
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Upload Proposed Layout Drawing (if applicable)
        {/* <span className="text-[#B2282F]">*</span> */}

      </label>
      
      <div className="flex w-full flex-col">
        <span>
          <div className="relative w-full">
            <FileUpload
              name="ProposedLayoutDrawing"
              initialFileName="Upload File"
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}

              accept='.zip,.rar,.7zip,.pdf'
            />
          </div>
        </span>

        <span>
          {errors.ProposedLayoutDrawing && (
            <p style={{ color: 'red' }}>
              {errors.ProposedLayoutDrawing}
            </p>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProposedLayoutDrawing;
