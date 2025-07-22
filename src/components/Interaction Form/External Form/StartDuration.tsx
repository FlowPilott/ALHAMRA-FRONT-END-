import React from 'react';
import DatePickerComponent from '../DatePickerComponent';

const StartDuration = ({ handleDateChange, date }) => {
  return (
    <div>
    <input
      type="date"
      name="date"
      value={date || ""}
      onChange={(e) => handleDateChange(e.target.value, new Date(e.target.value))}
      className="flex w-full items-center justify-between border-[1px] border-[#ccc] px-2 py-1.5 text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-3 md:py-2"
    />
  </div>
  );
};

export default StartDuration;
