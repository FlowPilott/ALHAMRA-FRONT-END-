import React from 'react';
import { MultiSelect } from 'react-multi-select-component';
import internalWorks from '../../../utils/internalWorks.json';
import externalWorks from '../../../utils/externalWorks.json';

const WorkSelector = ({ formData, setFieldValue, errors }) => {
  // Determine options based on workType (internal or external)
  const options =
    formData.workType === 'Internal Work'
      ? internalWorks.internalWorks
      : externalWorks.externalWorks;

  // Format options for MultiSelect
  const formattedOptions =
    options?.map(({ label, value }) => ({ label, value })) || [];

  // Initialize selectedValues by matching formData.internalWork with formattedOptions
  const selectedValues = formattedOptions.filter((option) =>
    formData.internalWork?.includes(option.label)
  );

  const handleMultiSelectChange = (selected) => {
    const selectedLabels = selected.map((item) => item.label);

    // Always store selected values in internalWork, regardless of the workType
    setFieldValue('internalWork', selectedLabels);
  };

  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
      <label className="mb-1 block text-sm font-normal md:w-[30%]">
        {formData.workType === 'Internal Work'
          ? 'Select Internal Work '
          : 'Select External Work '}
        <span className="text-[#B2282F]">*</span>
      </label>
      <div className="flex w-full max-w-[72%] flex-col">
        <MultiSelect
          options={formattedOptions}
          value={selectedValues}
          onChange={handleMultiSelectChange}
          labelledBy="Select"
          className="w-full"
          hasSelectAll={false} // This hides the "Select All" option
        />

        {formData.workType === 'Internal Work' && (
          <p style={{ color: 'red' }}>{errors?.internalWork}</p>
        )}
      </div>
    </div>
  );
};

export default WorkSelector;
