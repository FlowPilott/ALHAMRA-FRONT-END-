import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { setTitle } from '../redux/slices/titleSlice';
import user from '../images/user.png';
import dropwdown from '../images/dropdown.png';
import ChangePassword from './ChangePassword';
import { changePassword } from '../api/modules/Swiftsync.class';
import { CloseButton } from '@headlessui/react';
import Toaster from './Toast/Toast';
import { useNavigate } from 'react-router-dom';
const DropdownUser = () => {
  const name = localStorage.getItem('user-name');
  const email = localStorage.getItem('email');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const dispatch = useAppDispatch();

  // Close dropdown on outside click
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close on Escape key
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const navigate = useNavigate();

  return (
    <>
      <div className="relative">
        <button
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src={user}
            alt="User"
            className="h-[38px] w-[38px] rounded-full"
          />
          <div className="flex flex-col text-left">
            <span className="hidden text-sm font-semibold capitalize text-[#1C1C1C] sm:block">
              {name}
            </span>
            <span className="hidden text-xs text-[#6E6D6D] sm:block">
              {email}
            </span>
          </div>
          <img src={dropwdown} className="text-gray-600 text-sm" />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div
            ref={dropdown}
            className="absolute right-0 z-50 mt-2 w-full rounded border bg-white p-1 shadow-lg"
          >
            <button
              onClick={() => {
                navigate('/change-password');
              }}
              className="text-gray-700 hover:bg-gray-100 block w-full px-4 py-2 text-left text-sm"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DropdownUser;
