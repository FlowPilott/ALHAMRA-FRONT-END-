import { useState } from 'react';
import {
  createReturn,
  getWorkflow,
} from '../../../api/modules/Swiftsync.class';
import Spinner from '../../../common/Spinner';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchActiveTasksCount } from '../../../redux/slices/taskSlice';

const ReturnTab = ({ inProgress, setMessage, setWorkFlow }) => {
  const [loading, setLoading] = useState(false);
  const param = useParams();
const location = useLocation();
  const item = location?.state?.item;
  
  const dispatch=useDispatch()
  const handleSubmit = async () => {
    const userId = localStorage?.getItem('user-id');

    const payload = {
      stepId: inProgress?.id,
      actionType: 'Return Step',
      performedBy: userId,
    };

    try {
      setLoading(true);
      const res = await createReturn(inProgress?.id,item?.id, payload);
     
      if (res?.status === 200) {
        setMessage({
          success: 'The Return step is successfull.',
          error: '',
        });
        dispatch(fetchActiveTasksCount())
        const resp = await getWorkflow(param?.id);
        setWorkFlow(resp?.data);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };
  return (
    <div className="flex flex-col gap-[26px] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] ">Return Step</h2>
      </div>

      <div className="mt-6  flex justify-end gap-4">
        <button
          className="bg-[#B2282F]  px-3 py-[10px] text-sm font-medium text-white"
          onClick={handleSubmit}
        >
          {loading ? <Spinner /> : 'Initiate return step'}
        </button>
      </div>
    </div>
  );
};

export default ReturnTab;
