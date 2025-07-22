import { useState } from 'react';
import axios from 'axios';
import { postBpNumber } from '../../api/modules/Swiftsync.class';

interface UpdateBPNumberModalProps {
  setModalOpen: (open: boolean) => void;
  setMessage: (message: any) => void;
  fetchTasks: () => void;
}

interface UpdateBPNumberModalProps {
  setModalOpen: (open: boolean) => void;
  selectedContractorId: any;
}

const UpdateBPNumberModal = ({ setModalOpen, selectedContractorId, setMessage, fetchTasks }: UpdateBPNumberModalProps) => {
    const [newBpNumber, setNewBpNumber] = useState(selectedContractorId?.bpnumber    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!newBpNumber.trim()) {
    setError('Please enter a BP number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await postBpNumber(Number(selectedContractorId?.id), newBpNumber);
      if (response.message) {
        setModalOpen(false);
        setMessage({success:response?.message});
        fetchTasks();
      } else {
        setError(response.message || 'Failed to update BP number');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Update BP Number</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            BP Number
          </label>
          <input
            type="text"
            value={newBpNumber}
            onChange={(e) => setNewBpNumber(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-[#B2282F] focus:outline-none"
            placeholder="Enter BP number"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-[#B2282F] px-4 py-2 text-white hover:bg-[#991f25] disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBPNumberModal;
