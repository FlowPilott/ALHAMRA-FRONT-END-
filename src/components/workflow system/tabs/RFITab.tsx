import React, { useEffect, useState } from 'react';
import {
  createRFI,
  getUsers,
  getWorkflow,
} from '../../../api/modules/Swiftsync.class';
import Spinner from '../../../common/Spinner';
import { useParams } from 'react-router-dom';
import FileUpload from '../../Interaction Form/FileUpload';
import Step2 from './steps/Step2';
import FileUploadRFI from './FileUploadRFI';

const RFITab = ({ inProgress, users, setUsers, setMessage, setWorkFlow }) => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const param = useParams();
  const [comments, setComments] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle clear action
  const handleClear = () => {
    setSelectedUser(''); // Reset to default user
    setComments(''); // Clear comments
    setSelectedFiles([]); // Clear selected files
  };

  // Handle submit
  const handleSubmit = async () => {
    const userId = localStorage?.getItem('user-id');
    const formData = new FormData();
  
    // Append primitive fields
    formData.append('stepId', inProgress?.id);
    formData.append('actionType', 'RFI');
    formData.append('performedBy', userId);
    formData.append('performedOn', new Date().toISOString());
    formData.append('comments', comments);
    formData.append('invNumber', '');
    formData.append('assignTo', selectedUser);
  
    // Append files
    selectedFiles.forEach((file, index) => {
      formData.append('files', file); // 'files' should match what backend expects
    });
  
    try {
      setLoading(true);
      const res = await createRFI(inProgress?.id, formData); // Make sure createRFI handles FormData
      if (res?.status === 200) {
        setMessage({
          success: 'The request for information was submitted successfully.',
          error: '',
        });
        const resp = await getWorkflow(param?.id);
        setWorkFlow(resp?.data);
      }
      setSelectedUser('');
      setComments('');
      setSelectedFiles([]);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting RFI:', error);
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-[26px] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#1C1C1C]">
          RFI (Request for Information)
        </h2>
      </div>
      <div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <span className="w-full text-[#6E6D6D] sm:w-[20%]">
              Select User
            </span>
            <select
              required
              name="userselect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user?.fullname}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex flex-wrap justify-between">
            <label
              htmlFor="comments"
              className="mb-2 block text-sm font-medium text-[#6E6D6D]"
            >
              Add Comments
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Type your comments here..."
              className="w-full border border-[#ECE9E9] p-2 text-sm text-[#1C1C1C] sm:w-[80%]"
              rows="2"
            ></textarea>
          </div>
          <div className="mb-4 flex flex-wrap justify-between">
            <label
              htmlFor="comments"
              className="mb-2 block text-sm font-medium text-[#6E6D6D]"
            >
              Upload Files
            </label>
            <div className="w-full sm:w-[80%]">
              <FileUploadRFI
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          className="border border-[#B2282F] px-3 py-[10px] text-sm font-medium text-[#B2282F]"
          onClick={handleClear}
        >
          CLEAR
        </button>
        <button
          className={`bg-[#B2282F] px-3 py-[10px] text-sm font-medium text-white ${
            selectedUser || loading ? '' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleSubmit}
          disabled={!selectedUser || loading} // Disable if no user selected
        >
          {loading ? <Spinner /> : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default RFITab;
