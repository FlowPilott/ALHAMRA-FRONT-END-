// utils/formatPhoneNumber.js
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const formatPhoneNumber = (phoneNumber, countryCode = 'US') => {
  if (!phoneNumber) return 'N/A';

  // Parse the phone number
  const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, countryCode);

  // Check if the phone number is valid
  if (!phoneNumberObj || !phoneNumberObj.isValid()) {
    return phoneNumber; // Return original if invalid
  }

  // Format the phone number in international format
  const formattedNumber = phoneNumberObj.formatInternational();
  return formattedNumber;
};