// dateValidation.js

/**
 * Validates the start date by checking if it's at least 15 days from today.
 * @param {string | Date} selectedDate - The selected start date.
 * @returns {string | null} - Error message if validation fails, otherwise null.
 */
export const validateStartDate = (selectedDate) => {
    const today = new Date();
    const minDate = new Date(today.setDate(today.getDate() + 15)); // 15 days from today
  
    if (new Date(selectedDate) < minDate) {
      return 'Start date must be at least 15 days from today.';
    }
    return null;
  };
  
  /**
   * Validates the end date by checking if it is within 30 days of the start date.
   * @param {string | Date} startDate - The selected start date.
   * @param {string | Date} endDate - The selected end date.
   * @returns {string | null} - Error message if validation fails, otherwise null.
   */
  export const validateEndDate = (startDate, endDate) => {
    if (!startDate) {
      return 'Please select a start date first.';
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if ((end - start) / (1000 * 60 * 60 * 24) > 30) { // Convert milliseconds to days
      return 'The maximum duration between start and end date is 30 days.';
    }
  
    return null;
  };
  