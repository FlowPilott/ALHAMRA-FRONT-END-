import { formatDate } from '../../utils/formatDate';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber'; // Import the utility

const WorkFlowDetails = ({ workflow }) => {
  const parsedDetails = JSON.parse(workflow?.details || '{}');
  const isExternalWork = parsedDetails.workType === 'External Work';
  const modifiedDetails = { ...parsedDetails };

  if (modifiedDetails.internalWork === 'Others' && modifiedDetails.otherWork) {
    modifiedDetails.internalWork = `Others - ${modifiedDetails.otherWork}`;
  }

  delete modifiedDetails.otherWork; // Remove `otherWork` from the object
  delete modifiedDetails.type;       // Remove `type` from the object
  delete modifiedDetails.Id; // Remove `interactionId` from the object
  
  if (isExternalWork) {
    modifiedDetails.externalWork = modifiedDetails.internalWork;
    delete modifiedDetails.internalWork; // Remove internalWork to avoid duplication
  }
  



  // Mapping keys to custom labels
  const keyLabels = {
    color: 'Vehicle Color',
    mobile: 'Mobile Number',
    landlineNo: 'Landline Number',
    Contactno: 'Contact Number', // Add this if needed
    contactNo: 'Contact Number', // Add this if needed
    paymentOption: 'Payment Frequency',
    placeOfIssuance: 'Emirates',
    typeOfVehicle: 'Vehicle Modal / Brand',
    plateNo: 'Plate Number',
    plateType: 'Plate Code',
    applicationType: 'Application Type',
    Intiatorname: 'Initiator Name',
  };

  // Function to render work details as bullets
  const renderWorkDetails = (value) => (
    <ul className="list-disc pl-5">
      {value.split(',').map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  );

  // Function to format values
  const formatValue = (key, value) => {
    if (key === 'startDate' || key === 'endDate') {
      return formatDate(value) || 'N/A';
    }
    if (key === 'contractingCompName') {
      return value === 'Other' ? 'Unlisted Contractor' : value;
    }
    if (key === 'companyName') {
      return parsedDetails.contractingCompName === 'Other'
        ? value
        : parsedDetails.contractingCompName
        ? parsedDetails.contractingCompName
        : parsedDetails.companyName;
    }
    // Format phone numbers
    if (key === 'mobile' || key === 'landlineNo' || key === 'Contactno' || key === 'contactNumber' || key === 'contactNo') {
      return formatPhoneNumber(value, parsedDetails.countryCode); // Pass country code if available
    }
    return value || 'N/A';
  };

  // Define the desired order of specific keys
  const desiredOrder = [
    'companyName',
    'address',
    'email',
    'applicationType',
    'paymentOption',
    'mobile',
    'landlineNo',
    'contactNumber', // Add this if needed
    'plateNo',
    'plateType',
    'typeOfVehicle',
    'placeOfIssuance',
    'color',
  ];

  // Get all keys from modifiedDetails
  const allKeys = Object.keys(modifiedDetails);

  // Separate keys into two groups:
  // 1. Keys in the desired order
  // 2. Remaining keys
  const orderedKeys = desiredOrder.filter((key) => allKeys.includes(key));
  const remainingKeys = allKeys
    .filter((key) => !desiredOrder.includes(key) && key !== 'termsAndConditions')
    .sort((a, b) => {
      if (a === 'startDate' || a === 'endDate') return -1; // Ensure startDate and endDate come first
      if (b === 'startDate' || b === 'endDate') return 1;
      return 0;
    });

  // Combine the ordered keys and remaining keys
  const finalOrderedKeys = [...orderedKeys, ...remainingKeys];

  // Ensure `internalWork` is last if it exists
  if (finalOrderedKeys.includes('internalWork')) {
    finalOrderedKeys.splice(finalOrderedKeys.indexOf('internalWork'), 1); // Remove it from its current position
    finalOrderedKeys.push('internalWork'); // Add it to the end
  }

  return (
    <div className="mt-6 mb-4 grid grid-cols-1 gap-4 rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
      {finalOrderedKeys.map((key, index) => {
        const value = modifiedDetails[key];
        if (!value || value === 'N/A') return null;

        const formattedValue = formatValue(key, value);
        const label = keyLabels[key] || key.replace(/_/g, ' '); // Use mapped label or default key formatting

        return (
          <div key={index} className="flex items-center gap-1">
            <span className="text-sm font-normal capitalize">{label}</span>
            :
            <span
              className={`text-sm font-normal text-[#1F2937] ${
                key === 'subject' || key === 'startedOn' ? 'text-lg' : ''
              }`}
              title={formattedValue}
            >
              {key === 'externalWork' || key === 'internalWork'
                ? renderWorkDetails(formattedValue)
                : formattedValue}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default WorkFlowDetails;