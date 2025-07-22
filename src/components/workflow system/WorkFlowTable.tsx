import React, { useState } from 'react';
import dropdown from '../../images/dropdown.png';
import IterationSection from './IterationSection';
import { formatDate } from '../../utils/formatDate';
import ActionDetails from './ActionDetails';

interface WorkFlowStep {
  id: string;
  actiondetails?: string;
  stepName?: string;
  type?: string;
  assignedTo?: string;
  status?: string;
  receivedOn?: string;
  dueOn?: string;
  details?: boolean;
  executedOn: string;
}

const WorkFlowTable = ({
  workFlowStep = [] as WorkFlowStep[],
  users,
  steps,
  inProgress,
}: {
  workFlowStep: WorkFlowStep[];
  users: any[];
  steps: any[];
  inProgress: boolean;
}) => {
  const safeWorkFlowStep = Array.isArray(workFlowStep) ? workFlowStep : [];

  const getFirstStepDetails = () => {
    if (!safeWorkFlowStep.length) return null;
    try {
      return safeWorkFlowStep[0]?.actiondetails
        ? JSON.parse(safeWorkFlowStep[0].actiondetails)
        : null;
    } catch (e) {
      console.error('Error parsing action details:', e);
      return null;
    }
  };
  
  const firstStepActionDetails = getFirstStepDetails();
  // Determine if we should show only first step
  const shouldShowOnlyFirstStep = firstStepActionDetails?.length > 0 
  ? (firstStepActionDetails[0]?.StepAction?.Category === 'Minor Work' &&
    firstStepActionDetails[0]?.StepAction?.SubCat === 'Without Charges')  || safeWorkFlowStep[0]?.status==="Rejected"
  : false;

  // Get steps to display
  const stepsToDisplay =
    shouldShowOnlyFirstStep && safeWorkFlowStep.length > 0
      ? [safeWorkFlowStep[0]]
      : safeWorkFlowStep;

  const [activeDropdowns, setActiveDropdowns] = useState(() => {
    const initialState = {};
    stepsToDisplay.forEach((task) => {
      if (task?.details) {
        initialState[task.id] = { details: true, action: false };
      }
    });
    return initialState;
  });

  const handleDropdownClick = (taskId: string, dropdownType: string) => {
    setActiveDropdowns((prevState) => {
      const currentTaskState = prevState[taskId] || {};
      const isSameDropdownActive = currentTaskState[dropdownType];

      return {
        ...prevState,
        [taskId]: {
          details:
            dropdownType === 'details'
              ? !isSameDropdownActive
              : currentTaskState.details,
          action:
            dropdownType === 'action'
              ? !isSameDropdownActive
              : currentTaskState.action,
        },
      };
    });
  };

  const getAssignedUsernames = (
    assignedTo: string | undefined,
    users: any[]
  ) => {
    if (!assignedTo || !users || users?.length === 0) {
      return 'No assigned users';
    }

    try {
      const assignedToArray = JSON.parse(assignedTo);
      // Use a Set to store unique usernames
      const usernamesSet = new Set(
        assignedToArray
          .map((assigned) => {
            const user = users.find(
              (user) => String(user.id) === String(assigned.Id)
            );

            if (user && assigned?.Rights === 'Edit') {
              return user.fullname; // Return username if conditions match
            }
            return null; // Return null for unmatched users
          })
          .filter(Boolean) // Remove null values
      );
      // Convert the Set back to an array and join with commas
      const uniqueUsernames = Array.from(usernamesSet).join(', ');

      return uniqueUsernames || 'No assigned users with edit rights';
    } catch (error) {
      console.error('Error parsing assignedTo:', error);
      return 'Error retrieving assigned users';
    }
  };

  const getApprovedUsernames = (
    assignedTo: string | undefined,
    users: any[]
  ) => {
    if (!assignedTo || !users || users?.length === 0) {
      return 'No approved users';
    }

    try {
      const assignedToArray = JSON.parse(assignedTo);

      // Use a Set to store unique usernames
      const usernamesSet = new Set(
        assignedToArray
          .map((assigned) => {
            const user = users.find(
              (user) => String(user.id) === String(assigned.Id)
            );

            if (
              user &&
              assigned?.Rights === 'Edit' &&
              assigned?.Status === 'Approved'
            ) {
              return user.fullname; // Return username if conditions match
            }
            return null; // Return null for unmatched users
          })
          .filter(Boolean) // Remove null values
      );
      const uniqueUsernames = Array.from(usernamesSet).join(', ');

      return uniqueUsernames || '';
    } catch (error) {
      console.error('Error parsing assignedTo:', error);
      return 'Error retrieving assigned users';
    }
  };

  // NEW FUNCTION: Get next users who need to approve (only for type "All")
  const getNextApproverUsernames = (
    assignedTo: string | undefined,
    users: any[],
    taskType: string | undefined
  ) => {
    // Only show next approver for "All" type tasks
    if (taskType !== 'All' || !assignedTo || !users || users?.length === 0) {
      return '';
    }

    try {
      const assignedToArray = JSON.parse(assignedTo);

      // Get users who have edit rights but haven't approved yet
      const pendingApprovers = assignedToArray
        .filter((assigned) => 
          assigned?.Rights === 'Edit' && 
          assigned?.Status !== 'Approved'
        )
        .map((assigned) => {
          const user = users.find(
            (user) => String(user.id) === String(assigned.Id)
          );
          return user ? user.fullname : null;
        })
        .filter(Boolean); // Remove null values

      // Remove duplicates and join with commas
      const uniquePendingApprovers = [...new Set(pendingApprovers)].join(', ');

      return uniquePendingApprovers || '';
    } catch (error) {
      console.error('Error parsing assignedTo:', error);
      return 'Error retrieving pending approvers';
    }
  };

  // NEW FUNCTION: Get approval status info (only relevant for type "All")
  const getApprovalStatus = (
    assignedTo: string | undefined,
    users: any[],
    taskType: string | undefined
  ) => {
    // Only calculate detailed approval status for "All" type tasks
    if (taskType !== 'All' || !assignedTo || !users || users?.length === 0) {
      return { approved: 0, total: 0, isFullyApproved: false, isAllType: false };
    }

    try {
      const assignedToArray = JSON.parse(assignedTo);
      const editUsers = assignedToArray.filter(assigned => assigned?.Rights === 'Edit');
      const approvedUsers = editUsers.filter(assigned => assigned?.Status === 'Approved');
      
      return {
        approved: approvedUsers.length,
        total: editUsers.length,
        isFullyApproved: approvedUsers.length === editUsers.length && editUsers.length > 0,
        isAllType: true
      };
    } catch (error) {
      console.error('Error parsing assignedTo:', error);
      return { approved: 0, total: 0, isFullyApproved: false, isAllType: true };
    }
  };

  return (
    <>
      <div className="scrollbar overflow-x-auto">
        <h1 className="mb-4 text-base font-bold text-[#1C1C1C]">Workflow</h1>
        <table className="w-full min-w-max">
          <thead className="border-t border-b border-[#ECE9E9]">
            <tr>
              {[
                'Step Number',
                'Step Name',
                'Type',
                'Assigned To',
                'Approved By',
                'Next Approver', // NEW COLUMN
               
                'Received',
                'Due On',
                'Action',
                'Actioned On',
                'Comments',
              ].map((header) => (
                <th
                  key={header}
                  className=" px-2.5 py-4 text-left text-xs font-normal text-[#6E6D6D]"
                >
                  <div className="flex gap-1">
                    {header}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M5.25005 7.58333C5.08477 7.58333 4.94623 7.52743 4.83442 7.41562C4.72262 7.30382 4.66672 7.16528 4.66672 7V3.39791L3.57297 4.49166C3.46602 4.59861 3.33234 4.65208 3.17192 4.65208C3.01151 4.65208 2.87297 4.59861 2.7563 4.49166C2.63963 4.375 2.5813 4.23646 2.5813 4.07604C2.5813 3.91562 2.63963 3.77708 2.7563 3.66041L4.84172 1.575C4.90005 1.51666 4.96324 1.47535 5.0313 1.45104C5.09935 1.42673 5.17227 1.41458 5.25005 1.41458C5.32783 1.41458 5.40074 1.42673 5.4688 1.45104C5.53685 1.47535 5.60005 1.51666 5.65838 1.575L7.75838 3.675C7.87505 3.79166 7.93095 3.92778 7.92609 4.08333C7.92123 4.23889 7.86047 4.375 7.7438 4.49166C7.62713 4.59861 7.49102 4.65451 7.33547 4.65937C7.17991 4.66423 7.0438 4.60833 6.92713 4.49166L5.83338 3.39791V7C5.83338 7.16528 5.77748 7.30382 5.66567 7.41562C5.55387 7.52743 5.41533 7.58333 5.25005 7.58333ZM8.75005 12.5854C8.67227 12.5854 8.59935 12.5733 8.5313 12.549C8.46324 12.5247 8.40005 12.4833 8.34172 12.425L6.24172 10.325C6.12505 10.2083 6.06915 10.0722 6.07401 9.91667C6.07887 9.76111 6.13963 9.625 6.2563 9.50833C6.37297 9.40139 6.50908 9.34548 6.66463 9.34062C6.82019 9.33576 6.9563 9.39166 7.07297 9.50833L8.16672 10.6021V7C8.16672 6.83472 8.22262 6.69618 8.33442 6.58437C8.44623 6.47257 8.58477 6.41666 8.75005 6.41666C8.91533 6.41666 9.05387 6.47257 9.16567 6.58437C9.27748 6.69618 9.33338 6.83472 9.33338 7V10.6021L10.4271 9.50833C10.5341 9.40139 10.6678 9.34791 10.8282 9.34791C10.9886 9.34791 11.1271 9.40139 11.2438 9.50833C11.3605 9.625 11.4188 9.76354 11.4188 9.92396C11.4188 10.0844 11.3605 10.2229 11.2438 10.3396L9.15838 12.425C9.10005 12.4833 9.03685 12.5247 8.9688 12.549C8.90074 12.5733 8.82783 12.5854 8.75005 12.5854Z"
                        fill="#6E6D6D"
                      />
                    </svg>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stepsToDisplay?.map((task, index) => {
              const approvalStatus = getApprovalStatus(task?.assignedTo, users, task?.type);
              const nextApprover = getNextApproverUsernames(task?.assignedTo, users, task?.type);
              
              return (
                <>
                  <tr
                    key={index}
                    className={`border-b border-stroke ${
                      task?.status === 'In Progress' ? 'bg-[#f5d4d9]' : ''
                    }`}
                  >
                    <td className="px-1.5 py-2 text-sm font-normal text-[#1C1C1C] sm:px-2.5 sm:py-4">
                      {index + 1}
                    </td>
                    <td className="px-1.5 py-2 text-sm font-normal text-[#1C1C1C] sm:px-2.5 sm:py-4">
                      {task?.stepName}
                    </td>
                    <td className="cursor-pointer px-1.5 py-2 text-sm font-normal text-[#B2282F] sm:px-2.5 sm:py-4">
                      {task?.type}
                    </td>
                    <td className="flex px-1.5 py-2 text-sm font-normal capitalize text-[#1C1C1C] sm:px-2.5 sm:py-4">
                      {getAssignedUsernames(task?.assignedTo, users)}
                      {/* CONDITION OF GRAY ICON */}
                      {task?.details && (
                        <img
                          src={dropdown}
                          alt=""
                          className={`cursor-pointer ${
                            activeDropdowns[task?.id]?.details ? 'active' : ''
                          }`}
                          onClick={() => handleDropdownClick(task?.id, 'details')}
                        />
                      )}

                      {/* CONDITION OF RED ICON */}
                      {(task?.status === 'Approved' ||
                        task?.status === 'Rejected') && (
                        <svg
                          className={`cursor-pointer fill-red ${
                            activeDropdowns[task?.id]?.action ? 'active' : ''
                          }`}
                          onClick={() => handleDropdownClick(task?.id, 'action')}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="cursor-pointer fill-red"
                            d="M9.99996 12.4792C9.88885 12.4792 9.78468 12.4618 9.68746 12.4271C9.59024 12.3924 9.49996 12.3333 9.41663 12.25L5.58329 8.41668C5.43051 8.2639 5.35413 8.06945 5.35413 7.83334C5.35413 7.59723 5.43051 7.40279 5.58329 7.25001C5.73607 7.09723 5.93051 7.02084 6.16663 7.02084C6.40274 7.02084 6.59718 7.09723 6.74996 7.25001L9.99996 10.5L13.25 7.25001C13.4027 7.09723 13.5972 7.02084 13.8333 7.02084C14.0694 7.02084 14.2638 7.09723 14.4166 7.25001C14.5694 7.40279 14.6458 7.59723 14.6458 7.83334C14.6458 8.06945 14.5694 8.2639 14.4166 8.41668L10.5833 12.25C10.5 12.3333 10.4097 12.3924 10.3125 12.4271C10.2152 12.4618 10.1111 12.4792 9.99996 12.4792Z"
                            fill="#6E6D6D"
                          />
                        </svg>
                      )}
                    </td>
                    <td className="cursor-pointer px-1.5 py-2 text-sm font-normal capitalize text-[#B2282F] sm:px-2.5 sm:py-4">
                      {getApprovedUsernames(task?.assignedTo, users)}
                    </td>

                    {/* NEW COLUMN: Next Approver - Only for type "All" */}
                    <td className="px-1.5 py-2 text-sm font-normal capitalize text-[#FF8C00] sm:px-2.5 sm:py-4">
                      {task?.type === 'All' ? (
                        nextApprover || (approvalStatus.isFullyApproved ? 'All Approved' : 'N/A')
                      ) : (
                        <span className="text-gray-400 text-xs"></span>
                      )}
                    </td>

                

                    <td className="px-1.5 py-2 text-sm font-normal text-[#1C1C1C] sm:px-2.5 sm:py-4">
                      {formatDate(task?.receivedOn)}
                    </td>
                    <td className="px-2.5 py-4 text-sm font-normal text-[#1C1C1C] sm:px-2.5 sm:py-4">
                      {formatDate(task?.dueOn)}
                    </td>
                    <td
                      className={`px-1.5 py-2 text-sm font-normal ${
                        task?.status === 'Rejected'
                          ? 'text-red'
                          : 'text-[#1FCD67]'
                      } sm:px-2.5 sm:py-4`}
                    >
                      {task?.status}
                    </td>
                    <td className="px-1.5 py-2 text-sm font-normal text-[#1C1C1C] sm:px-2.5 sm:py-4">
                      {formatDate(task?.executedOn)}
                    </td>

                    <td className="px-1.5 py-2 text-sm font-normal text-black sm:px-2.5 sm:py-4">
                      {(() => {
                        const parsed = JSON.parse(task?.actiondetails || '{}');

                        if (Array.isArray(parsed)) {
                          const latest = parsed[parsed.length - 1];
                          return <div>{latest?.StepAction?.Comments}</div>;
                        } else {
                          return <div>{parsed?.StepAction?.Comments}</div>;
                        }
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={12}>
                      {activeDropdowns[task.id]?.details && (
                        <IterationSection
                          task={task}
                          steps={steps}
                          users={users}
                        />
                      )}
                      {activeDropdowns[task.id]?.action && (
                        <ActionDetails users={users} task={task} steps={steps} />
                      )}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WorkFlowTable;