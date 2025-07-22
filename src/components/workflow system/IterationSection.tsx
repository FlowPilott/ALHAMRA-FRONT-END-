import React from 'react';
import { downloadFile } from '../../api/modules/Swiftsync.class';

interface User {
  id: string;
  username: string;
}

interface IterationItem {
  RequestedBy: string;
  Id: string;
  IterationType: string;
  PerformedOn: string;
  Comment: string;
}

interface Task {
  actiondetails: string;
  details: string;
}

interface IterationSectionProps {
  task: Task;
  steps: any[]; // Update this type if you have a more specific type for steps
  users: User[];
}

const GridItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="mb-4 w-full sm:w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
    <span className="text-muted-foreground mb-1 text-xs font-medium uppercase">
      {label}
    </span>
    <span className="text-foreground ml-3 text-sm font-semibold">
      {value || 'N/A'}
    </span>
  </div>
);

const IterationSection: React.FC<IterationSectionProps> = ({ task, users }) => {
  let iteration: IterationItem[] = [];
  try {
    iteration = Array.isArray(JSON.parse(task?.details || '[]'))
      ? JSON.parse(task?.details || '[]')
      : [];
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getUsernameById = (id: string): string => {
    const idString = String(id);
    const user = users.find((user) => String(user.id) === idString);
    return user ? user.fullname : 'Unknown';
  };
  // Filter iterations based on allowed types
  const allowedTypes = ['RFI', 'Reassigned', 'Return Step'];
  const filteredIterations = iteration?.filter((item) => {
    return allowedTypes.includes(item.IterationType?.trim());
  });

  if (!filteredIterations?.length) {
    return (
      <div className="p-4 text-sm text-[#6E6D6D]">
        No iterations available for this task.
      </div>
    );
  }
  const downloadDocument = async (item: any) => {
    try {
      // Assuming downloadFile returns an object with `url` for the document
      const res = await downloadFile(item?.Id);

      if (res?.data?.fileUrl) {
        const fileUrl = res?.data?.fileUrl;
        const link = document.createElement('a');

        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        link.href = blobUrl; // Set the blob URL
        link.setAttribute('download', item?.Name || 'downloaded_file'); // Optional filename
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
  return (
    <>
      {filteredIterations.map((item, index) => {
        // Parse the Files array from the current iteration
        let files: any[] = [];
        try {
          files = item?.Files || '[]'
          if (!Array.isArray(files)) files = [];
        } catch {
          files = [];
        }
        ;
        return (
          <React.Fragment key={index}>
            <div className="mb-4 flex flex-col gap-4 border-2 border-[#edeb6a] bg-[#f9f9f9] p-4">
              <h2 className="text-[16px] font-bold text-[#1C1C1C]">
                Iteration - {index + 1}
              </h2>
              <div className="-mx-2 flex capitalize flex-wrap justify-between">
                <GridItem
                  label="Requested By:"
                  value={getUsernameById(item.RequestedBy) || ''}
                />
                
                <GridItem label="Action:" value={item.IterationType || ''} />
                <GridItem
                  label="Performed on:"
                  value={formatDate(item.PerformedOn) || ''}
                />

                {item?.IterationType !== 'Return Step' && (
                  <>
                  <GridItem
                  
                  label="Requested To:"
                  value={getUsernameById(item.Id) || ''}
                />
                    <GridItem label="Query:" value={item.Comment} />
                    <GridItem label="Response:" value={item?.Answer || ''} />
                  </>
                )}
              </div>
              <h3 className="text-[14px] font-semibold text-[#1C1C1C]">
                Attached Files
              </h3>

              {files.length > 0 ? (
                files.map((file, fileIndex) => (
                  <div
                    key={fileIndex}
                    onClick={() => downloadDocument(file)}
                    className="mb-2 flex cursor-pointer items-center gap-4 rounded-md bg-[#ECEFF1] p-3"
                  >
                    <span className="text-sm font-medium">
                      {file.Name || 'Unnamed File'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6E6D6D]">
                  No files attached to this iteration.
                </p>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default IterationSection;
