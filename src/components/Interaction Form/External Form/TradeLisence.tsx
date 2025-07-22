import React, { useEffect, useState } from 'react';
import companies from '../../../utils/companies.json'; 

const TradeLisence = ({ formData, handleChange }) => {
  
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Trade License Number
      </label>
      <div className='flex flex-col w-full'>
      <input
        name="trade_licence_no"
        value={formData?.trade_licence_no}
        onChange={handleChange}
        type='text'
        className="w-full border-[1px] border-[#ccc] px-[8px] py-[6px] text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
      />
     
          </div>
    </div>
  );
};

export default TradeLisence;
