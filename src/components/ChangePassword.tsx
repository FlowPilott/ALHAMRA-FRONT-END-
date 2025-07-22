'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { changePassword, logOut } from '../api/modules/Swiftsync.class';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{ success?: string; error?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const refresh = useSelector((state: any) => state.auth.refresh);
  const requiresPasswordChange = localStorage.getItem('requiresPasswordChange') === 'true';

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setErrorMsg('');
    handlePasswordSubmit();
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword) {
      setError('New password is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(newPassword);

      if (response?.status === 200) {
        setMessage({ success: response?.data?.result });
        setNewPassword('');
        logOut({ refresh });
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        dispatch(logout());
        navigate('/signin');
      } else {
        setMessage({ error: 'Error changing password.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ error: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };
  const handleCancle=()=>{
if (requiresPasswordChange){
  logOut({ refresh });
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  dispatch(logout());
  navigate('/signin');
}
  }

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-[#b2282f]">
            Change Password
          </h1>
          <p className="text-gray-600 text-sm">Enter your new password below</p>
        </div>

        {(error || errorMsg) && (
          <div className="bg-red-50 border-red-200 mb-4 rounded-md border p-3">
            <p className="text-red-600 text-sm">{error || errorMsg}</p>
          </div>
        )}

        {message.success && (
          <div className="bg-green-50 border-green-200 mb-4 rounded-md border p-3">
            <p className="text-green-600 text-sm">{message.success}</p>
          </div>
        )}

        {message.error && (
          <div className="bg-red-50 border-red-200 mb-4 rounded-md border p-3">
            <p className="text-red-600 text-sm">{message.error}</p>
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="password"
            className="text-gray-700 mb-2 block text-sm font-medium"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full rounded-md border-2 px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                errorMsg || error
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 focus:ring-[#b2282f]/50'
              }`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex w-full items-center justify-center rounded-md bg-[#b2282f] px-4 py-2 text-white transition-colors hover:bg-[#b2282f]/90 ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </button>

          <button
            onClick={handleCancle}
            className="w-full rounded-md border-2 border-[#b2282f] bg-white px-4 py-2 text-[#b2282f] transition-colors hover:bg-[#b2282f]/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
