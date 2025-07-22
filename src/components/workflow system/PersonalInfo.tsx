import { useState, useEffect } from 'react';
import WorkFlowDetails from './WorkFlowDetails';
import { formatDate } from '../../utils/formatDate';
import {
  downloadContractorFile,
  downloadFile,
  downloadInteraction,
  getUsers,
} from '../../api/modules/Swiftsync.class';
import { useLocation } from 'react-router-dom';
import { useWorkflowConditions } from '../../hooks/useWorkflowConditions';
const formatTextToTitleCase = (text) => {
  if (!text) return text;

  return text
    .toString()
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
const PersonalInfo = ({ workflow }) => {
  const state = workflow?.workFlowStepVMs[0]?.actiondetails
    ? JSON.parse(workflow?.workFlowStepVMs[0]?.actiondetails)
    : '';
  const { isMinorWorkWithoutCharges, isMajorWork, category, subCategory } =
    useWorkflowConditions(workflow);

  
  const shouldShowLimitedInfo = isMinorWorkWithoutCharges;
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const downloadDocument = async (item: any) => {
    try {
      // Assuming downloadFile returns an object with `url` for the document
      const res = await downloadFile(item?.id);

      if (res?.data?.fileUrl) {
        const fileUrl = res?.data?.fileUrl;
        const link = document.createElement('a');

        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        link.href = blobUrl; // Set the blob URL
        link.setAttribute('download', item?.documentName || 'downloaded_file'); // Optional filename
        document.body.appendChild(link);
        link.click();
        link.remove(); // Clean up the DOM
        window.URL.revokeObjectURL(blobUrl); // Release memory
      } else {
        alert(res.message || 'Failed to retrieve the download URL.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while downloading the file.');
    }
  };
  const handleDownloadedInteraction = async (docname: string) => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('access'); // Adjust key based on your storage key

      if (!token) {
        console.error('No authentication token found.');
        alert('Authentication token is missing. Please log in again.');
        return;
      }

      let res;

      // Call the appropriate API based on the workflow subject
      if (workflow?.subject === 'CONTRACTOR REGISTRATION') {
        res = await downloadContractorFile(workflow?.interactionId, docname);
      } else {
        res = await downloadInteraction(workflow?.interactionId, docname);
      }

      // Check if the API response contains the file URL
      if (!res?.data) {
        console.error('No file URL available in response.');
        alert('Failed to retrieve file URL. Please try again.');
        return;
      }

      const fileUrl = res.data; // Extract the actual file URL from the response

      // Fetch the actual file from the extracted URL with authentication
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Convert response to Blob
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Extract file extension from the document name
      const fileExtension = docname.split('.').pop() || 'file';

      // Create and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${docname}`); // Use the original filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('Failed to download the file. Please try again.');
    }
  };

  const shouldShowContentPanel = (workflow) => {
    return !!(
      workflow?.receiptNo ||
      workflow?.receiptDate ||
      workflow?.amount ||
      workflow?.receiptBy ||
      workflow?.vendorName ||
      workflow?.paidBy ||
      workflow?.approvalStartDate ||
      workflow?.approvalEndDate ||
      (workflow?.documents && workflow?.documents.length > 0)
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res?.data || []); // Set the fetched users or default to an empty array
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className=" mx-auto  w-full rounded-lg bg-transparent">
        <h2 className="mb-2 text-lg font-semibold text-[#111827]">
          Information Panel
        </h2>
        <div className="mb-4 rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              ...(workflow?.subject !== 'Resale NOC'
                ? [{ label: 'Initiator Name', value: workflow?.initiatorName }]
                : []),
              { label: 'Department', value: 'Property Management' },
              ...(workflow?.subject !== 'CONTRACTOR REGISTRATION' &&
              workflow?.subject !== 'Resale NOC'
                ? [
                    {
                      label: 'Type of interaction',
                      value: workflow?.interationData?.[0]?.typeOfInteraction,
                    },
                  ]
                : []),
              {
                label: 'Template',
                value:
                  workflow?.subject === 'Interaction Recording Form'
                    ? 'Enquiry for Modification'
                    : workflow?.subject,
              },
              { label: 'Subject', value: workflow?.subject },
              { label: 'Identifier', value: workflow?.identifier },
              ...(workflow?.subject !== 'CONTRACTOR REGISTRATION'
                ? [
                    {
                      label: 'Project Name',
                      value: workflow?.interationData?.[0]?.projectName,
                    },
                    {
                      label: 'Unit Number',
                      value: workflow?.interationData?.[0]?.unitNumber,
                    },
                  ]
                : []),
              {
                label: 'Workflow Started On',
                value: workflow?.startedOn
                  ? formatDate(workflow?.startedOn)
                  : '',
              },
              {
                label: 'Progress',
                value: `${
                  shouldShowLimitedInfo
                    ? '100%'
                    : workflow?.status === 'Rejected'
                    ? ''
                    : `${workflow?.progress}%`
                } - ${
                  shouldShowLimitedInfo
                    ? 'Completed'
                    : workflow?.status === 'Rejected'
                    ? 'Rejected'
                    : workflow?.progress === '100'
                    ? 'Completed'
                    : 'InProgress'
                }`,
                status:
                  workflow?.status === 'Rejected'
                    ? 'Rejected'
                    : workflow?.progress === '100'
                    ? 'Completed'
                    : 'InProgress',
              },
              { label: 'Process Owner', value: 'Dilin varkey' },

              // Include Category & Sub Category conditionally
              ...(workflow?.subject === 'Interaction Recording Form'
                ? [
                    {
                      label: 'Category',
                      value: state[0]?.StepAction?.Category || '',
                    },
                    {
                      label: 'Sub Category',
                      value: state[0]?.StepAction?.SubCat || '',
                    },
                  ]
                : []),
            ].map((field, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="text-sm font-normal text-[#6E6D6D]">
                  {field.label}:
                </span>
                <span
                  className={`text-sm font-normal ${
                    field.label === 'Department' &&
                    field.value === 'Maintenance'
                      ? 'text-[#FF5F1F]'
                      : field.label === 'Type' && field.value === 'Urgent'
                      ? 'text-[#FF0000]'
                      : field.label === 'Progress'
                      ? shouldShowLimitedInfo
                        ? 'text-[#008000]'
                        : field.status === 'InProgress'
                        ? 'text-[#FFA500]'
                        : field.status === 'Completed'
                        ? 'text-[#008000]'
                        : 'text-[#FF0000]'
                      : 'text-[#1C1C1C]'
                  }`}
                  title={String(field.value)}
                >
                  {field.value
                    ? field.label === 'Identifier'
                      ? field.value
                      : formatTextToTitleCase(field.value)
                    : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <WorkFlowDetails workflow={workflow} />

        <h2 className="mb-2 text-lg font-semibold text-[#111827]">
          Content Panel
        </h2>
        {workflow && shouldShowContentPanel(workflow) && (
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {workflow?.subject !== 'Resale NOC' && (
                <>
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-sm font-normal text-[#6E6D6D]">
                      Receipt Date
                    </p>{' '}
                    :
                    <p className="text-sm  text-[#111827]">
                      {workflow.receiptDate
                        ? formatDate(workflow.receiptDate)
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-sm text-[#6B7280]">Receipted By</p> :
                    <p className="text-sm text-[#111827]">
                      {users?.find((user) => user?.id == workflow?.receiptBy)
                        ?.username || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-sm text-[#6B7280]">Amount</p> :
                    <p className="text-sm text-[#111827]">
                      {workflow.amount ? `${workflow.amount} AED` : 'N/A'}
                    </p>
                  </div>
                </>
              )}
              {workflow?.typeofWork && (
                <div className="flex items-center justify-start gap-2">
                  <p className="text-sm text-[#6B7280]">Work Permit Type</p> :
                  <p className="text-sm text-[#111827]">
                    {workflow.typeofWork ? workflow.typeofWork : 'N/A'}
                  </p>
                </div>
              )}

              {/* Conditionally hide these fields for 'CONTRACTOR REGISTRATION' */}
              {workflow.subject !== 'CONTRACTOR REGISTRATION' &&
                workflow.subject !== 'Resale NOC' && (
                  <>
                    <div className="flex items-center justify-start gap-2">
                      <p className="text-sm text-[#6B7280]">Receipt Number</p> :
                      <p className="text-sm text-[#111827]">
                        {workflow.receiptNo ? workflow.receiptNo : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                      <p className="text-sm text-[#6B7280]">Vendor Name</p> :
                      <p className="text-sm text-[#111827]">
                        {workflow?.vendorName ? workflow?.vendorName : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                      <p className="text-sm text-[#6B7280]">Paid By</p> :
                      <p className="text-sm text-[#111827]">
                        {workflow.paidBy ? workflow.paidBy : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                      <p className="text-sm text-[#6B7280]">
                        Approval Start Date
                      </p>{' '}
                      :
                      <p className="text-sm text-[#111827]">
                        {workflow.approvalStartDate
                          ? formatDate(workflow.approvalStartDate)
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                      <p className="text-sm text-[#6B7280]">
                        Approval End Date
                      </p>{' '}
                      :
                      <p className="text-sm text-[#111827]">
                        {workflow.approvalEndDate
                          ? `  ${formatDate(workflow.approvalEndDate)}`
                          : 'N/A'}
                      </p>
                    </div>
                  </>
                )}
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-semibold text-[#111827]">
                Documents
              </h3>
              {workflow?.documents && workflow?.documents?.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {workflow.documents.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 shadow-sm hover:shadow-md"
                    >
                      <p className="text-sm font-medium text-[#111827]">
                        {item?.documentName}
                      </p>
                      <button
                        className="rounded bg-[#2563EB] px-3 py-1.5 text-sm text-white hover:bg-[#1D4ED8]"
                        onClick={() => downloadDocument(item)}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                'No Documents Found'
              )}
            </div>
          </div>
        )}

        {workflow?.interationData && (
          <div className="mt-4 bg-white p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {workflow?.interationData?.map((item, index) => {
                const keysToShow = [
                  'contractAgreement',
                  'proposedLayout',
                  'currentLayout',
                  'emirateId',
                  'scopeOfWork',
                  'tradeLicence',
                  'thirdPartyLiabilityCert',
                  'authorization',
                  'emirateid',
                  'companytradelicence',
                  'passportid',
                  'previouspermit',
                  'vehiclePic',
                  'vehicleReg',
                ];
                const keyLabels = {
                  emirateid: 'Color Copies of Passport/Visa/Emirates Id',
                  companytradelicence: 'Trade License',
                  passportid: 'Company Owner/Manager Passport and ID Copy',
                  vehiclePic: 'Branded Vehicle Photos',
                  vehicleReg: 'Color Copy of Vehicle’s Registration',
                  previouspermit: 'Previous Permit',
                };

                return keysToShow.map(
                  (key) =>
                    item[key] && (
                      <div
                        key={`${index}-${key}`}
                        className="flex items-center justify-between rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 shadow-sm hover:shadow-md"
                      >
                        <p className="text-sm font-medium text-[#111827]">
                          {keyLabels[key] || key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <button
                          className="rounded bg-[#2563EB] px-3 py-1.5 text-sm text-white hover:bg-[#1D4ED8]"
                          onClick={() => handleDownloadedInteraction(key)}
                        >
                          Download
                        </button>
                      </div>
                    )
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PersonalInfo;
