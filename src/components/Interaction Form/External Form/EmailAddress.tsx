import React from 'react';
import email from '../../../images/email.png';

const EmailAddress = ({ formData, handleChange, errors }) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal  md:w-[30%]">
        Email Address
      </label>
      <div className="flex w-full flex-col">
        <span>
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              readOnly
              className="w-full border-[1px] border-[#ccc] px-[8px] py-[6px] text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <img src={email} alt="" />
            </div>
          </div>
        </span>
        <span>
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </span>
      </div>
    </div>
  );
};

export default EmailAddress;
