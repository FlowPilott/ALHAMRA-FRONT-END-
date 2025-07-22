import React, { useEffect, useState } from 'react';
import backArrow from '../../images/workflow/back-arrow.png';
import PersonalInfo from './PersonalInfo';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WorkFlowTabs from './WorkFlowTabs';
import { getWorkflow } from '../../api/modules/Swiftsync.class';
import Loader from '../../common/Loader';
import Toaster from '../Toast/Toast';
import WorkFlowDetails from './WorkFlowDetails';

const WorkflowSystem = () => {
  const location = useLocation();
  const item = location?.state?.item;
  const [workflow, setWorkFlow] = useState();
  const [message, setMessage] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Define stepNames for different workflows
  const stepNamesForWorkflow1 = [
    'Review Scope and Site Requirements',
    'Review Scope',
    'Review Scope2',
    'Review Scope and Fees Calculation',
    'Upload the Invoice',
    'Confirm Payment Received',
  ];

  const stepNamesForWorkflow2 = [
    'REVIEW DOCS',
    'APPROVE',
    'UPLOAD INVOICE',
    'FILE CLOSURE',
  ];
  const stepNamesForWorkflow3 = ['INSPECT PROPERTY','APPROVE'];

  // Determine which stepNames to use based on the workflow or task type
  const stepNames =
    item?.template === 'CONTRACTOR REGISTRATION'
      ? stepNamesForWorkflow2
      : item?.template === "Resale NOC"
      ? stepNamesForWorkflow3
      : stepNamesForWorkflow1;

  useEffect(() => {
    try {
      const api = async () => {
        setLoading(true);
        const res = await getWorkflow(item?.workflowId);
        setWorkFlow(res?.data);
        setLoading(false);
      };
      api();
    } catch (error) {
      console.log(error);
    }
  }, [item?.workflowId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster message={message} />
      <div className="ml-12 flex flex-col gap-6 lg:ml-0">
        <div
          className="flex cursor-pointer items-center justify-start gap-2"
          onClick={() => navigate(-1)}
        >
          <img src={backArrow} alt="" />
          <span className="text-sm font-normal text-[#B2282F]">
            {item?.taskType}
          </span>
        </div>
        <PersonalInfo workflow={workflow} />

        {/* Pass stepNames as a prop to WorkFlowTabs */}
        <WorkFlowTabs
          workFlowStep={workflow?.workFlowStepVMs}
          workflow={workflow}
          setMessage={setMessage}
          setWorkFlow={setWorkFlow}
          stepNames={stepNames} // Pass the stepNames here
        />
      </div>
    </>
  );
};

export default WorkflowSystem;
