import React from 'react';

const EndDuration = ({ secondDate, handle2ndDateChange }) => {
  return (
    <div>
      <input
        type="date"
        name="endDate"
        value={secondDate || ""}
        onChange={(e) => handle2ndDateChange(e.target.value, new Date(e.target.value))}
        className="flex w-full items-center justify-between border-[1px] border-[#ccc] px-2 py-1.5 text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-3 md:py-2"
      />
    </div>
  );
};

export default EndDuration;
