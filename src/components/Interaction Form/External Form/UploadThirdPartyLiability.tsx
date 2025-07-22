import React from 'react';
import FileUpload from '../FileUpload';

const UploadThirdPartyLiability = ({ errors, setFormData }) => {
  const handleFileChange = (name, file) => {
    if (file) {
      setFormData(file); // Directly pass the File object to formik.setFieldValue
    }
  };
  return (
    
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Upload Third-Party Liability Insurance Certificate{' '}
      </label>
      <div className="flex w-full flex-col">
        <span>
          <div className="relative w-full">
            <FileUpload
              name="thirdPartyLiabilityInsuranceCertificate"
              initialFileName=""
              initialFileSize=""
              onFileChange={(name, file) => handleFileChange(name, file)}

              accept='.zip,.rar,.7zip,.pdf'

            />
          </div>
        </span>
        {/* <span>
          {errors.thirdPartyLiabilityInsuranceCertificate && (
            <p style={{ color: 'red' }}>
              {errors.thirdPartyLiabilityInsuranceCertificate}
            </p>
          )}
        </span> */}
      </div>
    </div>
  );
};

export default UploadThirdPartyLiability;
