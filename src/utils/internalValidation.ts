import { isValidPhoneNumber } from 'react-phone-number-input';

export const internalValidation = ({ formData, setErrors }): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.projectName) {
    newErrors.projectName = 'Project Name is required';
  }

  if (!formData.customerName) {
    newErrors.customerName = 'Customer Name is required';
  }

  if (!formData.unitNumber) {
    newErrors.unitNumber = 'Unit Number is required';
  }

  if (!formData.emailAddress || !/\S+@\S+\.\S+/.test(formData.emailAddress)) {
    newErrors.emailAddress = 'Valid Email Address is required';
  }

  // Check for an empty contact number and for invalid phone number
  if (!formData.contactNumber) {
    newErrors.contactNumber = 'Contact number is required';
  } else if (!isValidPhoneNumber(formData.contactNumber)) {
    newErrors.contactNumber = 'Please enter a valid phone number';
  }

  if (!formData.typeOfInteraction) {
    newErrors.typeOfInteraction = 'Type of Interaction is required';
  }

  if (!formData.purposeOfInteraction) {
    newErrors.purposeOfInteraction = 'Purpose of interaction is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
