import { downloadFile } from '../../api/modules/Swiftsync.class';

const ActionDetails = ({ task, users }) => {
  let detailsList = [];

  try {
    const parsed = JSON.parse(task?.actiondetails || '[]');
    detailsList = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const downloadDocument = async (item) => {
    try {
      const res = await downloadFile(item?.Id);
      if (res?.data?.fileUrl) {
        const response = await fetch(res.data.fileUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', item?.Name || 'downloaded_file');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert(res.message || 'Failed to retrieve the download URL.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while downloading the file.');
    }
  };

  const getAssignedUsernames = (
    assignedTo: string | undefined,
    users: any[]
  ) => {
    if (!assignedTo || !users || users?.length === 0) {
      return 'No assigned users';
    }

    try {
      // Use a Set to store unique usernames

      const user = users?.find(
        (user) => String(user.id) === String(assignedTo)
      );

      if (user) {
        return user.fullname; // Return username if conditions match
      }
      return ''; // Return null for unmatched users
    } catch (error) {
      console.error('Error parsing assignedTo:', error);
      return 'Error retrieving assigned users';
    }
  };

  return (
    <>
      {detailsList.map(
        (details, index) =>
          details?.StepAction?.ActionType === 'Submit' && (
            <div
              key={index}
              className="mb-6 rounded-md border border-[#ECE9E9] p-4 shadow-md"
            >
              <h2 className="text-gray-800 mb-4 text-lg font-bold">
                Step Action Details
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {task?.stepName === 'INSPECT PROPERTY' && (
                  <div className="flex gap-1 sm:col-span-3">
                    <p className="text-gray-600 min-w-[120px] text-sm font-medium">
                      Rejection Reason:
                    </p>
                    <div className="text-gray-800 flex-1 space-y-1.5 text-sm">
                      {details?.StepAction?.Checkboxes?.filter((c) => c?.trim())
                        .length > 0 ? (
                        details?.StepAction?.Checkboxes?.filter((c) =>
                          c?.trim()
                        ).map((checkbox, i) => (
                          <div
                            key={i}
                            className="bg-gray-50 hover:bg-gray-100 flex items-start gap-1.5 rounded-md transition-colors"
                          >
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span className="text-gray-700 leading-tight">
                              {checkbox.trim()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-1">
                  <p className="text-gray-600 text-sm font-medium">Action:</p>
                  <p className="text-gray-800 text-sm">
                    {details?.StepAction?.ActionType === 'Submit'
                      ? 'Approved'
                      : details?.StepAction?.ActionType || 'N/A'}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="text-gray-600 text-sm font-medium">Status:</p>
                  <p className="text-gray-800 text-sm">
                    {task?.status || 'N/A'}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="text-gray-600 text-sm font-medium">
                    Received On:
                  </p>
                  <p className="text-gray-800 text-sm">
                    {formatDate(task?.receivedOn)}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="text-gray-600 text-sm font-medium">Due On:</p>
                  <p className="text-gray-800 text-sm">
                    {formatDate(task?.dueOn)}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="text-gray-600 text-sm font-medium">
                    Performed By:
                  </p>
                  <p className="text-gray-800 text-sm">
                    {' '}
                    {getAssignedUsernames(
                      details?.StepAction?.PerformedBy,
                      users
                    )}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="text-gray-600 text-sm font-medium">
                    Actioned On:
                  </p>
                  <p className="text-gray-800 text-sm">
                    {formatDate(task?.executedOn)}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="text-gray-600 text-sm font-medium">Comments:</p>
                  <p className="text-gray-800 text-sm">
                    {details?.StepAction?.Comments || 'N/A'}
                  </p>
                </div>

                {task?.stepName === 'Review Scope and Site Requirements' && (
                  <>
                    <div className="flex gap-1">
                      <p className="text-gray-600 text-sm font-medium">
                        Category:
                      </p>
                      <p className="text-gray-800 text-sm">
                        {details?.StepAction?.Category || ''}
                      </p>
                    </div>
                    {details?.StepAction?.Category === 'Minor Work' && (
                      <div className="flex gap-1">
                        <p className="text-gray-600 text-sm font-medium">
                          Sub Category:
                        </p>
                        <p className="text-gray-800 text-sm">
                          {details?.StepAction?.SubCat || ''}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1C1C1C]">
                  Attached Files
                </h3>
                {details?.Files?.length > 0 ? (
                  <ul className="text-gray-800 mt-2 cursor-pointer list-disc text-sm">
                    {details?.Files.map((file, i) => (
                      <div
                        key={i}
                        className="mb-2 flex cursor-pointer items-center gap-4 rounded-md bg-[#ECEFF1] p-3"
                      >
                        <a
                          onClick={() => downloadDocument(file)}
                          className="text-blue-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm font-medium">
                            {file.Name || 'Unnamed File'}
                          </span>
                        </a>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-800 text-sm">No files attached.</p>
                )}
              </div>
            </div>
          )
      )}
    </>
  );
};

export default ActionDetails;
