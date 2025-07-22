const OtherInternalWork = ({ formData ,handleChange }) => {
  
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal md:w-[30%]">
        Other work
      </label>
      <div className="flex flex-col w-full max-w-[72%]">
        <input
          type="text"
          name="otherWork"
          className="w-full border-[1px] border-[#ccc] px-[8px] py-[6px] text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
          value={formData?.otherWork} // Display only the entered value without "Other-"
          onChange={handleChange} // Corrected onChange handler
        />
      </div>
    </div>
  );
};

export default OtherInternalWork;
