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
  
    // Contact Number (required, must be valid)
    if (!formData.contactNo?.trim()) {
      Errors.contactNo = "Contact number is required.";
    } else if (!/^\d{10,15}$/.test(formData.contactNo)) {
      Errors.contactNo = "Contact number must be 10-15 digits.";
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
  
    if (!formData.internalWork?.trim()) {
      Errors.internalWork = "Work type detail is required.";
    }
    
  
    // Contracting Company Name (required)
    if (!formData.contractingCompName?.trim()) {
      Errors.contractingCompName = "Contracting company name is required.";
    }
    if (!formData.propertyType?.trim()) {
      Errors.propertyType = "propertyType is required.";
    }
  
    // Contractor Representative Name (required)
    if (!formData.contractorRepName?.trim()) {
      Errors.contractorRepName = "Contractor representative name is required.";
    }
  
    // Upload Contract Agreement (required)
    if (!formData.uploadContractAgreement) {
      Errors.uploadContractAgreement = "Contract agreement upload is required.";
    }
  
    // Start Duration and End Duration (both required, and start must be before end)
    if (!formData.date) {
      Errors.date = "Start duration is required.";
    }
    if (!formData.endDate) {
      Errors.endDate = "End duration is required.";
    } else if (formData.startDuration && formData.date > formData.endDate) {
      Errors.endDate = "End duration must be after start duration.";
    }
  
    // Terms and Conditions (must be checked)
    if (!formData.termsAndConditions) {
      Errors.agreeToTerms = "You must agree to the terms and conditions.";
    }
  
    return Errors;
  };
  