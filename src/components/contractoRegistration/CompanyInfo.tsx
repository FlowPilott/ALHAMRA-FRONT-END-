import { useState, ChangeEvent } from 'react';
import ContractorName from '../../images/ContractorName.png';
import ContractorEmail from '../../images/ContractorEmail.png';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

// Define types for form data and form errors
type FormData = {
  companyName: string;
  address: string;
  landlineNo: string | undefined;
  mobile: string | undefined;
  email: string;
};

type FormErrors = {
  [K in keyof FormData]: string;
};

type TouchedFields = {
  [K in keyof FormData]: boolean;
};

// Main component function
export default function CompanyInformation({
  formData,
  setFormData,
  errors,
  handleChange,
  handleBlur,
  touchedFields
}: {
  formData: FormData;
  setFormData: any;
  errors: FormErrors;
  handleChange: any;
  handleBlur: (fieldName: keyof FormData) => void;
  touchedFields: TouchedFields;
}) {
  // Phone number validation handler
  const handlePhoneChange = (value: string | undefined, field: 'landlineNo' | 'mobile') => {
    // Update the form data with the new value
    setFormData((prevData: FormData) => ({ ...prevData, [field]: value }));
    
    // Validate phone number only if there's a value
    if (value) {
      if (!isValidPhoneNumber(value)) {
        handleChange({
          target: {
            name: field,
            value: value,
            validationError: 'Please enter a valid phone number'
          }
        });
      } else {
        handleChange({
          target: {
            name: field,
            value: value,
            validationError: '' // Clear error when valid
          }
        });
      }
    } else {
      // Handle empty value
      handleChange({
        target: {
          name: field,
          value: '',
          validationError: 'Phone number is required'
        }
      });
    }
  };


  

  return (
    <div className="">
      <div className="mx-auto max-w-3xl">
        <div className="mt-6 bg-[#F9F9F9] p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-[#111827]">
            Company Information
          </h2>

          <form className="flex flex-col gap-2">
            <div className="flex flex-col items-start gap-2 sm:grid sm:grid-cols-[200px_1fr] sm:items-center sm:gap-4">
              <label
                htmlFor="companyName"
                className="text-sm text-[#374151] sm:w-[200px]"
              >
                Company Name <span className="text-[#B2282F]">*</span>
              </label>
              <div className="relative w-full">
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('companyName')}
                  className={`w-full border bg-white px-3 py-2 pr-10 ${
                    touchedFields.companyName && errors.companyName ? 'border-red-500' : 'border-[#e5e7eb]'
                  } rounded-md focus:border-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#6b7280]`}
                  aria-invalid={touchedFields.companyName && errors.companyName ? 'true' : 'false'}
                  aria-describedby={
                    touchedFields.companyName && errors.companyName ? 'companyName-error' : undefined
                  }
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                  <img
                    src={ContractorName || '/placeholder.svg'}
                    width={18}
                    height={18}
                    alt="Company Name Icon"
                    aria-hidden="true"
                  />
                </span>
              </div>
              {touchedFields.companyName && errors.companyName && (
                <p
                  id="companyName-error"
                  className="text-sm text-[#B2282F] sm:col-start-2"
                >
                  {errors.companyName}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-2 sm:grid sm:grid-cols-[200px_1fr] sm:items-center sm:gap-4">
              <label
                htmlFor="address"
                className="mt-2 text-sm text-[#374151] sm:w-[200px]"
              >
                Address
              </label>
              <div className="relative w-full">
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                  className={`mt-2 w-full border bg-white px-3 py-2 ${
                    touchedFields.address && errors.address ? 'border-red-500' : 'border-[#e5e7eb]'
                  } rounded-md focus:border-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#6b7280]`}
                  aria-invalid={touchedFields.address && errors.address ? 'true' : 'false'}
                  aria-describedby={
                    touchedFields.address && errors.address ? 'address-error' : undefined
                  }
                />
              </div>
              {touchedFields.address && errors.address && (
                <p
                  id="address-error"
                  className="text-sm text-[#B2282F] sm:col-start-2"
                >
                  {errors.address}
                </p>
              )}
            </div>
{/* landlineNo */}
<div className="flex flex-col items-start gap-2 sm:grid sm:grid-cols-[200px_1fr] sm:items-center sm:gap-4">
              <label htmlFor="landlineNo" className="mt-2 text-sm text-[#374151] sm:w-[200px]">
                Landline No <span className="text-[#B2282F]">*</span>
              </label>
              <div className="relative w-full">
                <div className="relative">
                  <PhoneInput
                    name="landlineNo"
                    defaultCountry="AE"
                    value={formData?.landlineNo}
                    placeholder="Enter phone number"
                    onChange={(value) => handlePhoneChange(value, "landlineNo")}
                    onBlur={() => handleBlur("landlineNo")}
                    withCountryCallingCode={true}
                    international={true}
                    countryCallingCodeEditable={true}
                    disabled={formData.landlineNo && !touchedFields.landlineNo}
                    className={`PhoneInputInput w-full border-[1px] ${
                      (touchedFields.landlineNo && errors.landlineNo) ||
                      (formData.landlineNo && !isValidPhoneNumber(formData.landlineNo))
                        ? "border-red-500"
                        : formData.landlineNo && !touchedFields.landlineNo
                          ? "border-green-500"
                          : "border-[#ccc]"
                    } px-[8px] py-[6px] pr-10 font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]`}
                  />
                </div>
              </div>
              {formData.landlineNo && !touchedFields.landlineNo && (
                <p className="text-sm text-green-600 sm:col-start-2">Phone number loaded from previous submission</p>
              )}
              {((touchedFields.landlineNo && errors.landlineNo) ||
                (formData.landlineNo && !isValidPhoneNumber(formData.landlineNo))) && (
                <p id="landlineNo-error" className="text-sm text-[#B2282F] sm:col-start-2">
                  {errors.landlineNo || "Please enter a valid phone number"}
                </p>
              )}
            </div>
{/* mobile */}
<div className="flex flex-col items-start gap-2 sm:grid sm:grid-cols-[200px_1fr] sm:items-center sm:gap-4">
              <label htmlFor="mobile" className="mt-2 text-sm text-[#374151] sm:w-[200px]">
                Mobile <span className="text-[#B2282F]">*</span>
              </label>
              <div className="relative w-full">
                <div className="relative">
                  <PhoneInput
                    name="mobile"
                    defaultCountry="AE"
                    value={formData?.mobile}
                    placeholder="Enter phone number"
                    onChange={(value) => handlePhoneChange(value, "mobile")}
                    onBlur={() => handleBlur("mobile")}
                    withCountryCallingCode={true}
                    international={true}
                    countryCallingCodeEditable={true}
                    disabled={formData.mobile && !touchedFields.mobile}
                    className={`PhoneInputInput w-full border-[1px] ${
                      (touchedFields.mobile && errors.mobile) ||
                      (formData.mobile && !isValidPhoneNumber(formData.mobile))
                        ? "border-red-500"
                        : formData.mobile && !touchedFields.mobile
                          ? "border-green-500"
                          : "border-[#ccc]"
                    } px-[8px] py-[6px] pr-10 font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]`}
                  />
                </div>
              </div>
              {formData.mobile && !touchedFields.mobile && (
                <p className="text-sm text-green-600 sm:col-start-2">Mobile number loaded from previous submission</p>
              )}
              {((touchedFields.mobile && errors.mobile) ||
                (formData.mobile && !isValidPhoneNumber(formData.mobile))) && (
                <p id="mobile-error" className="text-sm text-[#B2282F] sm:col-start-2">
                  {errors.mobile || "Please enter a valid phone number"}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-2 sm:grid sm:grid-cols-[200px_1fr] sm:items-center sm:gap-4">
              <label htmlFor="email" className="mt-2 text-sm text-[#374151] sm:w-[200px]">
                Email
              </label>
              <div className="relative w-full">
                <input
                  id="email"
                  type="email"
                  name="email"
                  readOnly
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`mt-2 w-full border bg-white px-3 py-2 pr-10 ${
                    touchedFields.email && errors.email
                      ? "border-red-500"
                      : formData.email
                        ? "border-green-500"
                        : "border-[#e5e7eb]"
                  } rounded-md focus:border-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#6b7280]`}
                  aria-invalid={touchedFields.email && errors.email ? "true" : "false"}
                  aria-describedby={touchedFields.email && errors.email ? "email-error" : undefined}
                />
                <span className="pointer-events-none absolute right-3 top-[60%] -translate-y-1/2 text-[#6b7280]">
                  <img
                    src={ContractorEmail || "/placeholder.svg"}
                    width={18}
                    height={18}
                    alt="Email Icon"
                    aria-hidden="true"
                  />
                </span>
              </div>
              {touchedFields.email && errors.email && (
                <p id="email-error" className="text-sm text-[#B2282F] sm:col-start-2">
                  {errors.email}
                </p>
              )}
             
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
