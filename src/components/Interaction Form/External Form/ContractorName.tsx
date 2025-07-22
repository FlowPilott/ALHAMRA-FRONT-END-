import React from 'react';
import personicon from '../../../images/personicon.png';

const ContractorName = ({ formData, handleChange, errors }) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Contractor Name
      </label>
      <div className="flex w-full flex-col">
        <span>
          <div className="relative w-full">
            <input
              type="text"
              name="contractorName"
              value={formData?.contractorName}
              onChange={handleChange}
              className="w-full border-[1px] border-[#ccc] py-[6px] pl-[8px] pr-[30px] text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:py-[10px] md:pl-[12px]"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <img src={personicon} alt="" />
            </div>
          </div>
        </span>
        <span>
          {errors.contractorName && (
            <p style={{ color: 'red' }}>{errors.contractorName}</p>
          )}
        </span>
      </div>
    </div>
  );
};

export default ContractorName;
