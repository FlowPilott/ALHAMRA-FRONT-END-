import { useState } from 'react';
import ContractorCompany from '../images/ContractorCompany.png'
import PreviousPermit from './filesUpload/PreviousPermit';

export default function VehicleInformation({ formData, errors, setErrors, handleChange, setFormData }) {


  const validateField = (name: string) => {
    if (!formData[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} is required.`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#f9fafb] mt-6 shadow-sm p-6">
        <h2 className="text-[#111827] text-lg font-semibold mb-6">Vehicle Information</h2>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start md:items-center gap-2 md:gap-4">
            <label className="text-[#374151] text-sm">Plate Number</label>
            <div className="relative">
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b7280] focus:border-[#6b7280]"
                onBlur={() => validateField('plateNumber')}
              />
              {errors.plateNumber && <p className="text-[#B2282F] text-sm mt-1">{errors.plateNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start md:items-center gap-2 md:gap-4">
            <label className="text-[#374151] text-sm">Plate Code</label>
            <div className="relative">
              <input
                type="text"
                name="plateType"
                value={formData.plateType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b7280] focus:border-[#6b7280]"
                onBlur={() => validateField('plateType')}
              />
              {errors.plateType && <p className="text-[#B2282F] text-sm mt-1">{errors.plateType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start md:items-center gap-2 md:gap-4">
            <label className="text-[#374151] text-sm">Emirate</label>
            <div className="relative">
              <input
                type="text"
                name="placeOfIssuance"
                value={formData.placeOfIssuance}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b7280] focus:border-[#6b7280]"
                onBlur={() => validateField('placeOfIssuance')}
              />
              {errors.placeOfIssuance && <p className="text-[#B2282F] text-sm mt-1">{errors.placeOfIssuance}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start md:items-center gap-2 md:gap-4">
            <label className="text-[#374151] text-sm">Vehicle Model / Brand</label>
            <div className="relative">
              <input
                type="text"
                name="typeOfVehicle"
                placeholder='Toyota / Honda'
                value={formData.typeOfVehicle}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b7280] focus:border-[#6b7280]"
                onBlur={() => validateField('typeOfVehicle')}
              />
              {errors.typeOfVehicle && <p className="text-[#B2282F] text-sm mt-1">{errors.typeOfVehicle}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start md:items-center gap-2 md:gap-4">
            <label className="text-[#374151] text-sm">Color</label>
            <div className="relative">
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only letters and spaces
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b7280] focus:border-[#6b7280]"
                onBlur={() => validateField('color')}
              />
              {errors.color && <p className="text-[#B2282F] text-sm mt-1">{errors.color}</p>}
            </div>
          </div>


          <PreviousPermit errors={errors} setFormData={setFormData} />
        </form>
      </div>
    </div>
  );
}
