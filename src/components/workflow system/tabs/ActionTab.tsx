import { useCallback, useEffect, useState } from 'react';
import WorkFlowTable from '../WorkFlowTable';
import {
  createAction,
  getUsers,
  getWorkflow,
} from '../../../api/modules/Swiftsync.class';
import Spinner from '../../../common/Spinner';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step5 from './steps/Step5';
import { useLocation, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Check } from 'lucide-react';
import ContractorStep from './steps/ContractorStep';
import { useRefreshTaskCount } from '../../../hooks/useRefreshTaskCount';
import ModificationFeesSection, { FeesData } from './ModificationFeesSection';

interface InProgress {
  assignedTo: string;
  details: string;
  id: string;
}

const ActionTab = ({
  steps,
  inProgress,
  setMessage,
  setWorkFlow,
  workflow,
  setIsSubmitted,
}: {
  steps: any;
  inProgress: InProgress;
  setMessage: (message: { success: string; error: string }) => void;
  setWorkFlow: (workflow: any) => void;
  workflow: any;
  setIsSubmitted: (isSubmitted: boolean) => void;
}) => {
  const [phoneError, setPhoneError] = useState('');
  const [step1, step2, step3, step4, step5, step6] = steps;
  const location = useLocation();
  const item = location?.state?.item;
  const [approvalStatus, setApprovalStatus] = useState('');
  const [paid, setPaid] = useState('');

  const [checkboxes, setCheckboxes] = useState({
    unauthorizedGarageDoor: false,
    unauthorizedAreaExtension: false,
    unauthorizedStructureEquipment: false,
    other: '',
  });

  useEffect(() => {
    if (inProgress?.actiondetails) {
      const parsedData = JSON.parse(inProgress.actiondetails);
      setFormData((prevData) => ({
        ...prevData,
        paidBy: parsedData?.StepAction?.paidBy,
      }));
    }
  }, [inProgress]);
  const userId = localStorage.getItem('user-id');
  let assignedTo;
  let actionType = '';

  try {
    assignedTo = JSON.parse(inProgress.assignedTo);
  } catch (error) {
    console.error('Error parsing assignedTo data:', error);
  }

  if (assignedTo) {
    if (
      assignedTo?.find(
        (items: any) =>
          items?.Id === userId &&
          items?.IterationType === 'Reassigned' &&
          items?.id == item?.TaskId &&
          items?.Rights === 'Edit'
      )
    ) {
      actionType = 'Submit';
    } else {
      const right = assignedTo.find(
        (assigned: any) =>
          assigned.Id === userId && item?.id === assigned.TaskId
      );

      if (right) {
        if (right.Rights === 'RFI') {
          actionType = 'RFI';
        } else if (right.Rights === 'Edit') {
          actionType = 'Submit';
        } 
      } else {
        actionType = 'Submit';
      }
    }
  } else {
    console.warn('assignedTo data is not available. actionType remains empty.');
  }
  

  const comment = JSON.parse(inProgress.details);
  const lastComment = comment?.find((comm: any) => comm?.TaskId == item?.id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    comments: '',
    total: 0,
    name: JSON.parse(workflow?.details)?.ownerName,
    email: JSON.parse(workflow?.details)?.email,
    paidBy: workflow?.paidBy || paid, // <-- lowercase here
    VendorName: '',
    contact: JSON.parse(workflow?.details)?.contactNo,
    approvalStartDate:
      workflow.approvalStartDate || JSON.parse(workflow?.details)?.startDate,
    approvalEndDate:
      workflow.approvalEndDate || JSON.parse(workflow?.details)?.endDate,
    bpNumber: workflow?.interationData[0]?.bpnumber,
    paymentMethod: workflow?.interationData[0]?.paymentoption || '',
    typeofWork: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [users, setUsers] = useState();
  const [modificationType, setModificationType] = useState('Minor Work');
  const [subCategory, setSubCategory] = useState('With Charges');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      ...formData,
      comments: '',
      total: 0,
      paidBy: '',
      bpNumber: '',
      paymentMethod: '',
    });
    setSelectedFiles([]);
    setFeesData({
      layoutChangeFee: '',
      securityDeposit: '',
      unregisteredContractorFee: '',
      areaChangeSqft: '',
      areaChangeTotal: 0,
      total: 0,
    });
  };

  const params = useParams();
  const refreshCount = useRefreshTaskCount();

  // Add state for the new fees section
  const [feesData, setFeesData] = useState<FeesData>({
    layoutChangeFee: '',
    securityDeposit: '',
    unregisteredContractorFee: '',
    areaChangeSqft: '',
    areaChangeTotal: 0,
    total: 0,
  });

  // Sync the total from feesData to formData.total
  useEffect(() => {
    setFormData((prev) => ({ ...prev, total: feesData.total }));
  }, [feesData.total]);

  console.log(formData)
  const handleSubmit = async () => {
   

    try {
      setLoading(true);
      const userId = localStorage?.getItem('user-id');
      const formDatanew = new FormData();

      formDatanew.append('checkboxes', JSON.stringify(checkboxes));
      formDatanew.append('stepId', inProgress?.id);
      formDatanew.append('question', comment ? comment[0]?.Comment : '');
      formDatanew.append('actionType', actionType);
      if (userId) formDatanew.append('performedBy', userId);
      formDatanew.append('performedOn', new Date().toISOString());
      formDatanew.append('comments', formData.comments || '');
      formDatanew.append('category', modificationType || '');
      formDatanew.append('TaskId', item?.id);
      formDatanew.append('subCat', subCategory || '');
      formDatanew.append('total', formData?.total.toString());
      formDatanew.append('modificationFee', '525');
      formDatanew.append('layoutChangeFee', feesData.layoutChangeFee);
      formDatanew.append('securityDeposit', feesData.securityDeposit);
      formDatanew.append('unregisteredContractorFee', feesData.unregisteredContractorFee);
      formDatanew.append('areaChangeSqft', feesData.areaChangeSqft);
      formDatanew.append('areaChangeTotal', feesData.areaChangeTotal.toString());
      formDatanew.append('invNuumber', '');
      formDatanew.append('name', formData?.name);
      formDatanew.append('email', formData?.email);
      formDatanew.append('contactNumber', formData?.contact);
      formDatanew.append('approvalStartDate', formData?.approvalStartDate);
      formDatanew.append('approvalEndDate', formData?.approvalEndDate);
      if (userId) formDatanew.append('approverid', userId);
      formDatanew.append('paidBy', formData?.paidBy);
      formDatanew.append('paymentMethod', formData?.paymentMethod);
      formDatanew.append('PrevStepId', lastComment?.StepId);
      formDatanew.append('approvalStatus', approvalStatus);
      formDatanew.append('bpNumber', formData?.bpNumber);
      formDatanew.append('typeofWork', formData?.typeofWork);

      selectedFiles.forEach((file, index) => {
        formDatanew.append(`Files[${index}]`, file);
      });

      const res = await createAction(inProgress?.id, formDatanew);

      if (res?.data?.result === 'Success') {
        setMessage({
          success: 'The Action was submitted successfully.',
          error: '',
        });
        setIsSubmitted(true);

        const resp = await getWorkflow(params?.id);

        setWorkFlow(resp?.data);
        refreshCount()
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  const handleStartDateChange = (date) => {
    if (formData.approvalEndDate && date > formData.approvalEndDate) {
      alert('Start Date cannot be later than End Date.');
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      approvalStartDate: date,
    }));
  };

  const handleEndDateChange = (date) => {
    if (formData.approvalStartDate && date < formData.approvalStartDate) {
      alert('End Date cannot be earlier than Start Date.');
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      approvalEndDate: date,
    }));
  };

  const isOtherChecked = checkboxes.other !== '';

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'other') {
      setCheckboxes((prev) => ({
        ...prev,
        other: checked ? prev.other || ' ' : '', // Set to space if empty, or clear
      }));
    } else {
      setCheckboxes((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleOtherInputChange = (e) => {
    setCheckboxes((prev) => ({
      ...prev,
      other: e.target.value,
    }));
  };

  useEffect(() => {
    try {
      const api = async () => {
        const res = await getUsers();
        setUsers(res?.data);
      };
      api();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getUsernameById = (id: string): string => {
    const idString = String(id);
    const user = users?.find((user) => String(user.id) === idString);
    return user ? user.fullname : 'Unknown';
  };

  console.log((inProgress?.stepName==="UPLOAD INVOICE" || inProgress?.stepName==="Upload the Invoice" ))

  return (
    <>
      <div className="bg-white p-4 ">
        <div className="mb-4 flex flex-wrap items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#1C1C1C]">Action</h2>
        </div>
        {step1 &&
          item?.template === 'Resale NOC' &&
          item?.taskType !== 'RFI' &&
          item?.taskType !== 'Reassign' && (
            <div className="flex flex-col gap-4 py-2 sm:flex-row">
              <h3 className="mb-2 text-base font-medium  text-black sm:mb-0 sm:mr-4 sm:self-center">
                Approval Status:
              </h3>
              <div className="flex gap-6">
                <label className="group relative flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="approve"
                    checked={approvalStatus === 'approve'}
                    onChange={() => setApprovalStatus('approve')}
                    className="peer sr-only"
                  />
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ease-in-out peer-checked:border-4"
                    style={{
                      borderColor:
                        approvalStatus === 'approve' ? '#10B981' : '#D1D5DB',
                    }}
                  >
                    <div
                      className="h-2 w-2 rounded-full opacity-0 transition-opacity peer-checked:opacity-100"
                      style={{ backgroundColor: '#10B981' }}
                    ></div>
                  </div>
                  <span
                    className="transition-colors peer-checked:font-medium"
                    style={{
                      color:
                        approvalStatus === 'approve' ? '#059669' : '#374151',
                    }}
                  >
                    Approve
                  </span>
                </label>

                <label className="group relative flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="reject"
                    checked={approvalStatus === 'reject'}
                    onChange={() => setApprovalStatus('reject')}
                    className="peer sr-only"
                  />
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ease-in-out peer-checked:border-4"
                    style={{
                      borderColor:
                        approvalStatus === 'reject' ? '#EF4444' : '#D1D5DB',
                    }}
                  >
                    <div
                      className="h-2 w-2 rounded-full opacity-0 transition-opacity peer-checked:opacity-100"
                      style={{ backgroundColor: '#EF4444' }}
                    ></div>
                  </div>
                  <span
                    className="transition-colors peer-checked:font-medium"
                    style={{
                      color:
                        approvalStatus === 'reject' ? '#DC2626' : '#374151',
                    }}
                  >
                    Reject
                  </span>
                </label>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
          <div>
            {(item?.taskType === 'RFI' || item?.taskType === 'Reassigned') && (
              <>
                <div className="mb-1 flex flex-wrap items-center justify-start gap-1">
                  <label
                    htmlFor="comments"
                    className=" block text-sm  font-medium text-[#6E6D6D]"
                  >
                    Requested Information:
                  </label>
                  {comment?.length > 0 && (
                    <span className="text-left">{lastComment?.Comment}</span>
                  )}
                </div>
                <div className="mb-1 flex flex-wrap items-center justify-start gap-1">
                  <label
                    htmlFor="comments"
                    className=" block text-sm font-medium capitalize text-[#6E6D6D]"
                  >
                    Requested By:
                  </label>
                  {lastComment?.RequestedBy && users && (
                    <span className="text-left capitalize">
                      {getUsernameById(lastComment.RequestedBy)}
                    </span>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="comments"
                className="mb-2 block text-sm font-medium text-[#6E6D6D]"
              >
                Add Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                className="w-full border border-[#ECE9E9] p-2 text-sm text-[#1C1C1C] sm:w-[80%]"
                rows="3"
                value={formData.comments}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* {((
            (step1 || step4)
             &&
            item?.template === 'CONTRACTOR REGISTRATION') 
              )
               && (
              <FileUpload
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            )} */}

            {step3 &&
              item?.template === 'CONTRACTOR REGISTRATION' &&
              item?.taskType !== 'RFI' && (
                <>
                  <ContractorStep
                    formData={formData}
                    setFormData={setFormData}
                  />
                </>
              )}

            {(step1 || step6) &&
              item?.taskType !== 'RFI' &&
              item?.template === 'Modification Request' && (
                <div>
                  <div className="mt-2 w-full gap-3">
                    {/* Approval Start Date */}
                    <div className="w-full">
                      {' '}
                      {/* Removed sm:w-[80%] */}
                      <label className="mb-1 block text-sm font-medium text-[#6E6D6D]">
                        Approval Start Date
                      </label>
                      <div className="w-full">
                        <DatePicker
                          selected={formData.approvalStartDate}
                          onChange={handleStartDateChange}
                          dateFormat="dd-MM-yyyy"
                          className="w-full rounded-md border p-2 text-sm"
                          placeholderText="Select start date"
                        />
                      </div>
                    </div>

                    {/* Approval End Date */}
                    <div className="mt-2 w-full">
                      {' '}
                      {/* Removed sm:w-[80%] */}
                      <label className="mb-1 block text-sm font-medium text-[#6E6D6D]">
                        Approval End Date
                      </label>
                      <div className="w-full">
                        <DatePicker
                          selected={formData.approvalEndDate}
                          onChange={handleEndDateChange}
                          dateFormat="dd-MM-yyyy"
                          minDate={formData.approvalStartDate} // Ensure end date is not earlier than start date
                          className="w-full rounded-md border p-2 text-sm"
                          placeholderText="Select end date"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {step4 &&
            !(item?.taskType === 'RFI') &&
            item?.template === 'Modification Request' && (
              <ModificationFeesSection feesData={feesData} setFeesData={setFeesData} />
            )}
          {step1 && item?.template === 'Modification Request' && (
            <Step1
              modificationType={modificationType}
              setModificationType={setModificationType}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {(step2 ||
            step1 ||
            step3 ||
            step6 ||
            (step4 && item?.template === 'CONTRACTOR REGISTRATION') ||
            item?.taskType === 'RFI') && (
            <>
              <Step2
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </>
          )}

          {step5 && (
            <Step5
              formData={formData}
              setFormData={setFormData}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              phoneError={phoneError}
              setPhoneError={setPhoneError}
              workflow={workflow}
            />
          )}

          {/* resale noc */}
          {step1 && item?.template === 'Resale NOC' && (
            <>
              {step1 && (
                <>
                  <div className="space-y-3">
                    {approvalStatus === 'reject' && (
                      <div className="space-y-3">
                        <CheckboxItem
                          name="unauthorizedGarageDoor"
                          checked={checkboxes.unauthorizedGarageDoor}
                          onChange={handleCheckboxChange}
                          disabled={isOtherChecked}
                          label="Unauthorized garage door installation"
                        />

                        <CheckboxItem
                          name="unauthorizedAreaExtension"
                          checked={checkboxes.unauthorizedAreaExtension}
                          onChange={handleCheckboxChange}
                          disabled={isOtherChecked}
                          label="Unauthorized area extension"
                        />

                        <CheckboxItem
                          name="unauthorizedStructureEquipment"
                          checked={checkboxes.unauthorizedStructureEquipment}
                          onChange={handleCheckboxChange}
                          disabled={isOtherChecked}
                          label="Unauthorized installation of structure / equipment within the unit"
                        />

                        <CheckboxItem
                          name="other"
                          checked={isOtherChecked}
                          onChange={handleCheckboxChange}
                          label="Other"
                        />

                        {isOtherChecked && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={checkboxes.other}
                              onChange={handleOtherInputChange}
                              placeholder="Please specify"
                              className="border-gray-300 focus:ring-blue-500 w-full rounded-md border px-3 py-2 transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                              aria-label="Specify other unauthorized modification"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="border border-[#B2282F] px-3 py-[10px] text-sm font-medium text-[#B2282F]"
            onClick={handleClear}
          >
            CLEAR
          </button>
          <button
            className={`bg-[#B2282F] px-3 py-[10px] text-sm font-medium text-white ${(inProgress?.stepName==="UPLOAD INVOICE" || inProgress?.stepName==="Upload the Invoice" ) && !selectedFiles?.length > 0 ? "cursor-not-allowed opacity-50" :''}`}
            onClick={handleSubmit}
            disabled={(inProgress?.stepName==="UPLOAD INVOICE" || inProgress?.stepName==="Upload the Invoice" ) && !selectedFiles?.length > 0}
          >
            {loading ? <Spinner /> : 'Submit'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ActionTab;

function CheckboxItem({ name, checked, onChange, disabled, label }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-2 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <div className="relative mt-0.5 flex items-center justify-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <div className="border-gray-300 peer-checked:border-blue-600 peer-focus:ring-blue-500 h-5 w-5 rounded border-2 transition-colors peer-checked:bg-white peer-focus:ring-2 peer-focus:ring-offset-2"></div>
        {checked && (
          <Check className="pointer-events-none absolute h-4 w-4 stroke-[3] text-primary" />
        )}
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );
}
