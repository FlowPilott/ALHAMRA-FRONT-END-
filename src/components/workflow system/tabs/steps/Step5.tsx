import React, { useEffect, useRef, useState } from 'react';
import upload from '../../../../images/upload.png';
import { useLocation } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
const Step5 = ({
  selectedFiles,
  setSelectedFiles,
  formData,
  setFormData,
  phoneError,
  setPhoneError,
  workflow
}) => {
  const location = useLocation();
  const item = location?.state?.item;
 const fileInputRef = useRef(null); // Ref for the file input

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };
 
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handlePhoneChange = (value) => {
    if (value && isValidPhoneNumber(value)) {
      setPhoneError('');
      setFormData((prev) => ({ ...prev, contact: value })); // Ensure the key matches formData structure
    } else {
      setPhoneError('Please enter a valid phone number (11-15 digits).');
    }
  };

  return (
    <div>
      {/* Form Section */}
      {!(item?.taskType === 'RFI') && (
        <>
        <div className="space-y-4">
          {/* Name Input */}
         {workflow?.amount ?
         <>
          <div className="flex flex-wrap items-center justify-between">
            <label className="w-full text-[#6E6D6D] sm:w-[20%]">Amount</label>
            <input
              type="text"
              readOnly
              className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
              value={`${workflow?.amount} AED`}
              onChange={handleChange}
            />
          </div>
          </>:""
        } 
          <div className="flex flex-wrap items-center justify-between">
            <label className="w-full text-[#6E6D6D] sm:w-[20%]">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
              value={formData.name}
              readOnly
              onChange={handleChange}
              ref={fileInputRef}
            />
          </div>
          

          {/* Email Input */}
          <div className="flex flex-wrap items-center justify-between">
            <label className="w-full text-[#6E6D6D] sm:w-[20%]">Email</label>
            <input
              type="email"
              name="email"
              readOnly
              className="w-full border border-[#ECE9E9] p-2 text-sm font-medium text-[#1C1C1C] sm:w-[80%]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Contact Input */}
          <div className="flex flex-wrap items-center justify-between">
            <label className="w-full text-[#6E6D6D] sm:w-[20%]">
              Contact No
            </label>
            <span className="w-full sm:w-[80%]">
              <PhoneInput
                name="contactNo"
                defaultCountry="AE"
                value={formData.contact}
                placeholder="Enter phone number"
                onChange={handlePhoneChange} // Use the corrected function here
                withCountryCallingCode={true}
                international={true}
                readOnly
                countryCallingCodeEditable={false}
                className="PhoneInputInput w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
              />

              {phoneError && (
                <p className="text-red mt-1 text-sm">{phoneError}</p>
              )}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <label className="w-full text-[#6E6D6D] sm:w-[20%]">Paid By</label>
            <input
              type="text"
              name="paidBy"
              className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
              value={formData.paidBy}
              onChange={handleChange}
            />
          </div>
          
        </div>
      
      {/* File Upload Section */}
      <div className="flex flex-wrap items-start justify-between mt-4">
        <label className="w-full text-[#6E6D6D] sm:w-[20%]">
        Upload Invoice / Payment Receipt <span className='text-[#B2282F]'>*</span> 
        </label> 
        <div className="mb-4 w-full rounded-md border-2 border-dashed border-[#E8BFC1] p-4 text-center sm:w-[80%]">
          <input
            type="file"
            id="file-input"
            multiple
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef} // Attach the ref to the file input

          />
          <div className="flex items-center justify-center">
            <img src={upload} alt="Upload" />
          </div>
          <label
            htmlFor="file-input"
            className="cursor-pointer text-xs font-normal text-[#B2282F]"
          >
            UPLOAD A FILE
          </label>
          <p className="mt-1 text-xs font-normal text-[#6E6D6D]">
            PNG, JPG, GIF Up To 10MB
          </p>
        </div>
      </div>
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap justify-end gap-1">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <p className="w-40 truncate text-sm font-medium">
                    {file.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
</>

    )}
    </div>
  );
};

export default Step5;
