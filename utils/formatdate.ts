export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    // If the date is invalid, return an empty string
    return '';
  }

  const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two digits
  const year = d.getFullYear();

  return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
};
