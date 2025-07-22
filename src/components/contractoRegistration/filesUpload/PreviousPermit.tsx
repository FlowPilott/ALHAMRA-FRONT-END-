import React from 'react';
import FileUpload from '../../Interaction Form/FileUpload';

const PreviousPermit = ({ setFormData, errors }) => {
  const handleFileChange = (name, file) => {
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    }
  };
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
      PreviousPermit (if Any)
      
      </label>
      
      <div className="flex w-full flex-col md:w-[70%]" >
        <span>
          <div className="relative w-full">
            <FileUpload
              name="previousPermit"
              initialFileName="Upload File"
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}
              accept='.zip,.rar,.7zip,.pdf'
            />
          </div>
        </span>

        <span>
          {errors.previousPermit && (
            <p style={{ color: 'red' }}>
                {errors.previousPermit}
            </p>
          )}
        </span>
      </div>
    </div>
  );
};

export default PreviousPermit;
