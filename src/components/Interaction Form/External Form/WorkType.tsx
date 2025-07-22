import React from 'react';

const WorkType = ({ formData, handleChange }) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center">
      <label className="mb-1 block text-sm font-normal md:w-[30%]">
        Work Type *
      </label>
      <div className=" flex flex-col md:flex-row md:space-x-4">
        <label className="flex items-center text-[#1C1C1C]">
          <input
            type="radio"
            name="workType"
            value="Internal Work"
            checked={formData.workType === 'Internal Work'}
            onChange={handleChange}
            className="mr-2 h-5 w-5 border-[1px] accent-[#B2282F] "
          />
          Internal Work
        </label>
        <label className="flex items-center text-[#1C1C1C]">
          <input
            type="radio"
            name="workType"
            value="External Work"
            checked={formData.workType === 'External Work'}
            onChange={handleChange}
            className="mr-2 h-5 w-5 border-[1px] accent-[#B2282F]"
          />
          External Work
        </label>
      </div>
    </div>
  );
};

export default WorkType;
