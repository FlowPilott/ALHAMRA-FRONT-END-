import React, { useEffect, useState } from 'react';
import companies from '../../../utils/companies.json';
import { getContractingCompName } from '../../../api/modules/Swiftsync.class';

const ContractingCompName = ({ formData, handleChange, errors }) => {
  const [companyOptions, setCompanyOptions] = useState([]);

  useEffect(() => {
    // Set company options from the JSON file
    const api = async () => {
      try {
        const response = await getContractingCompName();
        if (response?.status === 200) {
          setCompanyOptions(response?.data);
        }
      } catch (error) {}
    };
    api();
  }, []);

  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Contracting Company Name <span className="text-[#B2282F]">*</span>
      </label>
      <div className="flex w-full flex-col">
        <select
          name="contractingCompName"
          value={formData?.contractingCompName}
          onChange={handleChange}
          required
          className="w-full border-[1px] border-[#ccc] px-[8px] py-[6px] text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
        >
          <option value="">Select an option</option>
          {companyOptions?.map((company, index) => (
            <option key={index} value={company?.companyName}>
              {company?.companyName}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        <span>
          {errors.contractingCompName && (
            <p style={{ color: 'red' }}>{errors.contractingCompName}</p>
          )}
        </span>
      </div>
    </div>
  );
};

export default ContractingCompName;
