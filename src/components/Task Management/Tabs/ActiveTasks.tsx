import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setTitle } from '../../../redux/slices/titleSlice';
import { taskViewed } from '../../../api/modules/Swiftsync.class';
import { formatDate } from '../../../utils/formatDate';

const ActiveTasks = ({ displayedRows }) => {
  const navigate = useNavigate();
  const handleNavigate = (task: any) => {
    navigate(`/workflow/system/${task?.workflowId}`, { state: { item: task } });
    setTitle('Workflow System');
  };
  const handleView = async (task) => {
    await taskViewed(task.id);
  };

  const capitalizeFirstLetter = (str) => {
    return str
      .toLowerCase() // First, convert the whole string to lowercase
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
  };
  return (
    <div className="scrollbar overflow-x-auto">
      <table className="w-full min-w-max border-separate border-spacing-y-2">
        <thead className="border-t border-b border-[#ECE9E9]">
          <tr>
            {[
              
              'IDENTIFIER',
              'Task',
              'Department',
              'Type',
              'Template',
              'Start Date',
              'End Date',
              'Ageing',
              'Status',
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
          {displayedRows?.map((task, index) => (
            <tr
              key={index}
              className={` text-sm ${
                task?.isviewed
                  ? 'bg-white font-normal'
                  : 'bg-[#e5e3e3] font-semibold'
              }`}
            >
             
              <td className="px-1.5 py-2   text-[#1C1C1C] md:px-2.5 md:py-4">
                {task.unique_Id}
              </td>
              <td
                className="cursor-pointer px-1.5 py-2  text-[#B2282F] md:px-2.5 md:py-4"
                onClick={() => {
                  handleView(task);
                  handleNavigate(task);
                }}
              >
                {task.taskType}
              </td>
              <td className="px-1.5 py-2  text-[#1C1C1C] md:px-2.5 md:py-4">
                {task.department}
              </td>
              <td className="px-1.5 py-2  text-[#1C1C1C] md:px-2.5 md:py-4">
                {task.taskType}
              </td>
              <td className="px-1.5 py-2  text-[#1C1C1C] md:px-2.5 md:py-4">
              {capitalizeFirstLetter(task.template === "Modification Request" ? "Enquiry For Modification" : task.template)}
              </td>
            
              <td className="px-1.5 py-2  text-[#1C1C1C] md:px-2.5 md:py-4">
                {formatDate(task?.receivedOn)}
              </td>
              <td className="px-1.5 py-2  text-[#1C1C1C] md:px-2.5 md:py-4">
                {formatDate(task?.dueDate)}
              </td>

              <td
                className={`${
                  task?.ageing > 1 ? 'text-red' : 'text-[#1C1C1C]'
                } px-1.5 py-2  md:px-2.5 md:py-4`}
              >
                {task.ageing}
              </td>

              <td className="px-1.5 py-2  text-[#1FCD67] md:px-2.5 md:py-4">
                {task.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveTasks;
