import React from 'react';

const PropertyType = ({ formData, handleChange, errors }) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Property Type <span className="text-[#B2282F]">*</span>
      </label>
      <div className="flex w-full flex-col">
        <div className=" flex space-x-4">
          <label className="flex items-center text-[#1C1C1C]">
            <input
              type="radio"
              name="propertyType"
              value="Villa"
              checked={formData?.propertyType === 'Villa'}
              onChange={handleChange}
              className="mr-2 h-5 w-5 border-[1px] accent-[#B2282F] "
            />
            Villa
          </label>
          <label className="flex items-center text-[#1C1C1C]">
            <input
              type="radio"
              name="propertyType"
              value="Apartment"
              checked={formData?.propertyType === 'Apartment'}
              onChange={handleChange}
              className="mr-2 h-5 w-5 border-[1px] accent-[#B2282F]"
            />
            Apartment
          </label>
        </div>
        <span>
          {errors.propertyType && (
            <p style={{ color: 'red' }}>{errors.propertyType}</p>
          )}
        </span>
      </div>
    </div>
  );
};

export default PropertyType;
