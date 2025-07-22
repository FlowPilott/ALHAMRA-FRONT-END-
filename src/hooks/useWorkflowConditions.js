// hooks/useWorkflowConditions.js
import { useState, useEffect } from 'react';

export const useWorkflowConditions = (workflow) => {
  const [workflowConditions, setWorkflowConditions] = useState({
    isMinorWorkWithoutCharges: false,
    isMajorWork: false,
    category: '',
    subCategory: ''
  });

  useEffect(() => {
    if (workflow?.workFlowStepVMs?.[0]?.actiondetails) {
      try {
        const actionDetails = JSON.parse(workflow.workFlowStepVMs[0].actiondetails);
        const stepAction = actionDetails?.StepAction || {};
        
        setWorkflowConditions({
          isMinorWorkWithoutCharges: 
            stepAction.Category === "Minor Work" && 
            stepAction.SubCat === "Without Charges",
          isMajorWork: stepAction.Category === "Major Work",
          category: stepAction.Category || '',
          subCategory: stepAction.subCat || ''
        });
      } catch (error) {
        console.error("Error parsing workflow action details:", error);
      }
    }
  }, [workflow]);

  return workflowConditions;
};