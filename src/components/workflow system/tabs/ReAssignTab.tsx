import React, { useState, useEffect } from 'react';
import {
  createAssign,
  getUsers,
  getWorkflow,
} from '../../../api/modules/Swiftsync.class';
import { useParams } from 'react-router-dom';
import Spinner from '../../../common/Spinner';
import FileUploadRFI from './FileUploadRFI';

const ReAssignTab = ({ inProgress, setMessage, setWorkFlow }) => {
  // State for selected user and user list
  const [selectedUser, setSelectedUser] = useState('');
  const [comments, setComment] = useState('');
  const [users, setUsers] = useState([]); // To store users fetched from the API
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle clear action
  const handleClear = () => {
    setSelectedUser(''); 
    setComment('');
    setSelectedFiles([]);
  };

  const handleSubmit = async () => {
    const userId = localStorage?.getItem('user-id');
  
    const formData = new FormData();
    formData.append('stepId', inProgress?.id);
    formData.append('actionType', 'Reassign');
    formData.append('performedBy', userId);
    formData.append('performedOn', new Date().toISOString());
    formData.append('assignTo', selectedUser);
    formData.append('comments', comments);
  
    selectedFiles.forEach((file) => {
      formData.append('files', file); // name 'files' must match backend expectation
    });
  
    try {
      setLoading(true);
  
      const res = await createAssign(inProgress?.id, formData); // make sure createAssign handles FormData
      if (res?.status === 200) {
        setMessage({
          success: 'The Reassign step is successful.',
          error: '',
        });
        const resp = await getWorkflow(param?.id);
        setWorkFlow(resp?.data);
      }
      setSelectedUser('');
      setComment('');
      setSelectedFiles([]);
      setLoading(false);
    } catch (error) {
      console.error('Error during submission:', error);
      setLoading(false);
    }
  };
  

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res?.data || []); // Populate the user list
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col gap-[26px] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#1C1C1C]">Reassign</h2>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between">
          <span className="w-full text-[#6E6D6D] sm:w-[20%]">Select User</span>
          <select
            name="userselect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
          >
            <option value="" disabled>
              Select a user
            </option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullname}
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
            name="comments"
            className="w-full border border-[#ECE9E9] p-2 text-sm text-[#1C1C1C] sm:w-[80%]"
            rows="2"
            placeholder="Type your comments here..."

            value={comments}
            onChange={(e) => setComment(e.target.value)}
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

      <div className="mt-6 flex justify-end gap-4">
        <button
          className="border border-[#B2282F] px-3 py-[10px] text-sm font-medium text-[#B2282F]"
          onClick={handleClear}
        >
          CLEAR
        </button>
        <button
          className={`bg-[#B2282F] px-3 py-[10px] text-sm font-medium text-white ${
            selectedUser || loading
              ? ' cursor-pointer'
              : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleSubmit}
          disabled={!selectedUser || loading}
        >
          {loading ? <Spinner /> : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default ReAssignTab;
