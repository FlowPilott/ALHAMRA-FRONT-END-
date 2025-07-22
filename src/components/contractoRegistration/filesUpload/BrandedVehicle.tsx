import React from 'react';
import FileUpload from '../../Interaction Form/FileUpload';

const BrandedVehicle = ({ setFormData, errors }) => {
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
      if Vehicle is Branded, all Side Color Pictures (for multiple pictures, please zip the files)

      </label>
      
      <div className="flex w-full flex-col md:w-[70%]" >
        <span>
          <div className="relative w-full">
            <FileUpload
              name="brandedVehicle"
              initialFileName="Upload File"
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}
              accept='.zip,.rar,.7zip,.pdf'
            />
          </div>
        </span>

       
      </div>
    </div>
  );
};

export default BrandedVehicle;
