import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Step1 = ({
  modificationType,
  setModificationType,
  subCategory,
  setSubCategory,
  formData,
  setFormData,
}) => {
  const location = useLocation();
  const item = location?.state?.item;

  return (
    <div>
      {!(item?.taskType === 'RFI') && (
        <div className="w-full">
          <div className="w-full sm:w-[80%]">
            <label className="mb-1 block text-sm font-medium text-[#6E6D6D]">
              Modification Request
            </label>
            <select
              value={modificationType}
              onChange={(e) => setModificationType(e.target.value)}
              className="w-full rounded-md border p-2 text-sm"
            >
              <option value="Minor Work">Minor Work</option>
              <option value="Major Work">Major Work</option>
            </select>
          </div>

          {modificationType === 'Minor Work' && (
            <div className="mt-2 w-full sm:w-[80%]">
              <label className="mb-1 block text-sm font-medium text-[#6E6D6D]">
                Sub Category
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full rounded-md border p-2 text-sm"
              >
                <option value="With Charges">With Charges</option>
                <option value="Without Charges">Without Charges</option>
              </select>
            </div>
          )}
          <div className="w-full sm:w-[80%]">
            <label className="mt-1 mb-1 block text-sm font-medium text-[#6E6D6D]">
              Type of work to be displayed on the work permit
            </label>
            <input
              value={formData?.typeofWork}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, typeofWork: e.target.value })
              }
              className="w-full rounded-md border p-2 text-sm"
            />
          </div>
        </div>
      )}
     
    </div>
  );
};

export default Step1;
