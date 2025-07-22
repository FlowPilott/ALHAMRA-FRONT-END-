import { isValidPhoneNumber } from 'react-phone-number-input';

export const validateFormData = (formData) => {
  const Errors = {};

  // Property Type (required)
  if (!formData.propertyType?.trim()) {
    Errors.propertyType = "Property type is required.";
  }

  // Owner Name (required)
  if (!formData.ownerName?.trim()) {
    Errors.ownerName = "Owner name is required.";
  }

  // Contact Number (valid phone number)
  if (formData.contactNo && !isValidPhoneNumber(formData.contactNo)) {
    Errors.contactNo = 'Please enter a valid phone number';
  }
  
  
  // Email Address (required, must be valid)
  if (!formData.email?.trim()) {
    Errors.email = "Email address is required.";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
  ) {
    Errors.email = "Valid email address is required.";
  }

  // Work Type (required)
  if (!formData.workType?.trim()) {
    Errors.workType = "Work type is required.";
  }

  // Work Type Details (internalWork is an array of objects)
  if (formData.workType === 'Internal Work' && (!formData.internalWork || formData.internalWork.length === 0)) {
    Errors.internalWork = "At least one internal work type must be selected.";
  } else if (formData.workType === 'External Work' && (!formData.internalWork || formData.internalWork.length === 0)) {
    Errors.externalWork = "At least one external work type must be selected.";
  }

  // Contracting Company Name (required)
  if (!formData.contractingCompName?.trim()) {
    Errors.contractingCompName = "Contracting company name is required.";
  }

  // Company Name (required if 'Other' is selected)
  if (formData.contactingCompanyName === "Other" && !formData.companyName?.trim()) {
    Errors.companyName = "Company name is required.";
  }

  // Contractor Representative Name (required)
  // if (!formData.contractorRepName?.trim()) {
  //   Errors.contractorRepName = "Contractor representative name is required.";
  // }

  // Upload Contract Agreement (required)
  if (!formData.uploadContractAgreement) {
    Errors.uploadContractAgreement = "Contract agreement upload is required.";
  }
 

  // Terms and Conditions (must be checked)
  if (!formData.termsAndConditions) {
    Errors.agreeToTerms = "You must agree to the terms and conditions.";
  }

  if (!formData.detailedScopeofWork) {
    Errors.detailedScopeofWork = "Detailed Scope of Work   is required.";
  }
  if (!formData.contractorTradeLicense) {
    Errors.contractorTradeLicense = "Contractor Trade License  is required.";
  }

  // if (!formData.emiratesId) {
  //   Errors.emiratesId = "Emirates Id of Eployee  is required.";
  // }
  // if (!formData.thirdPartyLiabilityInsuranceCertificate) {
  //   Errors.thirdPartyLiabilityInsuranceCertificate = "Third Party Liability Insurance Certificate  is required.";
  // }
  if (!formData.CurrentLayoutDrawing) { 
    Errors.CurrentLayoutDrawing = "Current Layout Drawing  is required.";
  }
  if (!formData.ProposedLayoutDrawing) {
    Errors.ProposedLayoutDrawing = "Proposed Layout Drawing  is required.";
  }
if (formData.contractingCompName === "Other"){

  if (formData.contractorContact && !isValidPhoneNumber(formData.contractorContact)) {
    Errors.contractorContact = 'Please enter a valid phone number';
  }

  if (!formData.contractorEmail?.trim()) {
    Errors.contractorEmail = "Email address is required.";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.contractorEmail)
  ) {
    Errors.email = "Valid email address is required.";
  }
  if (!formData.companyName?.trim()) {
    Errors.companyName = "Company name is required.";
  }


  
}
  return Errors;
};
