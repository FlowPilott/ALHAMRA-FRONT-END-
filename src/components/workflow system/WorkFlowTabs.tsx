import React, { useEffect, useState } from "react";
import ActionTab from "./tabs/ActionTab";
import RFITab from "./tabs/RFITab";
import ReAssignTab from "./tabs/ReAssignTab";
import ReturnTab from "./tabs/ReturnTab";
import { getUsers } from "../../api/modules/Swiftsync.class";
import WorkFlowTable from "./WorkFlowTable";
import { useLocation } from "react-router-dom";

const WorkFlowTabs = ({ workFlowStep, setMessage, setWorkFlow, workflow, stepNames }) => {
  const [activeTab, setActiveTab] = useState("action");
  const userId = localStorage?.getItem("user-id");
  const [inProgress, setInProgress] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const item = location?.state?.item;


  useEffect(() => {
    if (inProgress && item) {
      try {
        const parsedDetails = JSON.parse(inProgress?.details || "[]");
        const task = parsedDetails.find((comm) => comm?.TaskId == item?.id);
        
        if (task && task.Answer) {
          setIsSubmitted(true);
        } else {
          setIsSubmitted(false);
        }

      } catch (error) {
        console.error("Error parsing inProgress details:", error);
      }
    }
  }, [inProgress, item]);
  // JSON.parse(workFlowStep?.details)?.[0]?.TaskId === item?.id


    useEffect(() => {
    if (workFlowStep?.length) {
      const step = workFlowStep.find((workFlowStep) => {
        if (workFlowStep.status !== "In Progress") {
          return false;
        }
        try {
          
          const assignedTo = JSON.parse(workFlowStep.assignedTo);
          return assignedTo.some(
            (assigned) =>
              
              assigned.Id === userId.toString() &&
              assigned.Status !== "Approved" &&
              assigned?.TaskId === item?.id &&
              (assigned.Rights === "Edit" || assigned.Rights === "RFI")
          );
        } catch (error) {
          console.error("Failed to parse assignedTo:", error);
          return false;
        }
      });
      setInProgress(step || null);
    }
  }, [workFlowStep, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res?.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  const isActionTabEnabled = !!inProgress && !isSubmitted;


  const steps = stepNames.map((name) => {
    const step = workFlowStep?.find(
      (wfStep) => wfStep?.stepName === name && wfStep?.status === "In Progress"
    );
    return Boolean(step);
  });

  const tabs =
    item?.taskType === "RFI"
      ? [{ id: "action", label: "Action", isEnabled: isActionTabEnabled }]
      : [
          { id: "action", label: "Action", isEnabled: isActionTabEnabled },
          { id: "request", label: "Request for Information", isEnabled: true },
          { id: "reassign", label: "Reassign", isEnabled: true },
          ...(steps[0] ? [] : [{ id: "return", label: "Return Step", isEnabled: true }]),
        ];

  const visibleTabs = tabs.filter((tab) => tab.isEnabled);



  return (
    <>
      {inProgress && (
        <>
          <div className="flex w-full overflow-x-auto rounded-md bg-[#abcdg] bg-white p-2">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-1 px-4 text-center text-sm font-medium sm:py-[10px] sm:px-9 ${
                  activeTab === tab.id
                    ? "border border-[#B2282F] bg-[#B2282F] text-white"
                    : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="">
            {activeTab === "action" && isActionTabEnabled && (
              <ActionTab
                workFlowStep={workFlowStep}
                isEnabled={isActionTabEnabled}
                inProgress={inProgress}
                setMessage={setMessage}
                setWorkFlow={setWorkFlow}
                workflow={workflow}
                steps={steps}
                setIsSubmitted={setIsSubmitted}
              />
            )}
            {activeTab === "request" && (
              <RFITab
                inProgress={inProgress}
                users={users}
                setUsers={setUsers}
                setMessage={setMessage}
                setWorkFlow={setWorkFlow}
              />
            )}
            {activeTab === "reassign" && (
              <ReAssignTab
                inProgress={inProgress}
                setMessage={setMessage}
                setWorkFlow={setWorkFlow}
              />
            )}
            {activeTab === "return" && (
              <ReturnTab
                inProgress={inProgress}
                setMessage={setMessage}
                setWorkFlow={setWorkFlow}
              />
            )}
          </div>
        </>
      )}

      <div className="mt-6 bg-white p-4">
        <WorkFlowTable
          workFlowStep={workFlowStep}
          inProgress={inProgress}
          users={users}
          steps={steps}
        />
      </div>
    </>
  );
};

export default WorkFlowTabs;
