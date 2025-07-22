import React, { useState, useRef } from 'react';
import upload from '../../../../images/upload.png';

const Step2 = ({ selectedFiles, setSelectedFiles }) => {
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

  return (
    <div>
      <div className="">
        <label className="text-sm font-medium text-[#6E6D6D]">Upload Files</label>
        {/* File upload box */}
        <div className="sm:w-[80%] w-full rounded-md border-2 border-dashed border-[#E8BFC1] p-2 text-center mt-1">
          <input
            type="file"
            id="file-input"
            multiple
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef} // Attach the ref to the file input
          />
          <div className="flex items-center justify-center">
            <img src={upload} alt="" />
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
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap mt-2 mb-2 gap-1">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <p className="w-40 truncate text-sm font-medium">
                    {file?.name}
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
    </div>
  );
};

export default Step2;