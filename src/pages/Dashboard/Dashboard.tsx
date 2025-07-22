import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import TaskManagement from '../../components/Task Management/TaskManagement';
const Dashboard: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-end">
        <div className="flex cursor-pointer gap-[6px] rounded-md border-[1px] p-[8px] dark:border-[#333B48] dark:bg-[#242E3E]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="fill-black dark:fill-white"
              d="M10.084 18.3333C9.82425 18.3333 9.60655 18.2455 9.43085 18.0698C9.25516 17.8941 9.16731 17.6764 9.16731 17.4167V11.9167L3.85064 5.13334C3.62148 4.82778 3.5871 4.50695 3.74752 4.17084C3.90794 3.83473 4.18675 3.66667 4.58398 3.66667H17.4173C17.8145 3.66667 18.0934 3.83473 18.2538 4.17084C18.4142 4.50695 18.3798 4.82778 18.1506 5.13334L12.834 11.9167V17.4167C12.834 17.6764 12.7461 17.8941 12.5704 18.0698C12.3947 18.2455 12.177 18.3333 11.9173 18.3333H10.084ZM11.0006 11.275L15.5381 5.50001H6.46314L11.0006 11.275Z"
              fill="#D6D6D5"
            />
          </svg>

          <span className="text-sm font-normal text-[#1D2532] dark:text-[#D6D6D5]">
            Day
          </span>
        </div>
      </div>
      {/* <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Overall Call Volume"
          total="15"
          rate="0.43%"
          val="+72.85"
          levelUp
        ></CardDataStats>
        <CardDataStats
          title="Overall Call Count"
          total="38"
          rate="4.35%"
          val="+5.98"
          levelUp
        ></CardDataStats>
        <CardDataStats
          title="Overall Expenditure"
          total="$15.30"
          rate="2.59%"
          val="+98.85"
          levelUp
        ></CardDataStats>
        <CardDataStats
          title="Mean Cost per Call"
          total="$0.89"
          rate="0.95%"
          val="-0.15"
          levelDown
        ></CardDataStats>
      </div> */}
    </>
  );
};

export default Dashboard;
