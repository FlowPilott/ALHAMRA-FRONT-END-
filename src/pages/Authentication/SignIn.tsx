import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../common/Spinner';
import { login } from '../../api/modules/Swiftsync.class';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import Toaster from '../../components/Toast/Toast';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        break;
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 4) return 'Username must be at least 4 characters';
        break;
      default:
        return '';
    }
    return '';
  };

  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const [message, setMessage] = useState<{
    error?: string;
    success?: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      setMessage({ error: 'Please fill in all required fields correctly.' });
      return;
    }
    setLoading(true);
    try {
      const res = await login({
        username: formData?.username,
        password: formData?.password,
        action: 'login',
      });

      if (res?.errorCode === '200') {
        const access = res?.tokken;

        if (access) {
          dispatch(loginSuccess({ access }));

          localStorage.setItem('access', access);
          localStorage.setItem('user-id', res?.data?.id);
          localStorage.setItem('user-name', res?.data?.fullname);
          localStorage.setItem('email', res?.data?.email);
          localStorage.setItem(
            'requiresPasswordChange',
            res?.data?.changePassword ? 'true' : 'false'
          );

          if (res?.data?.changePassword) {
            navigate('/change-password');
          } else {
            window.location.reload()
            navigate('/TaskManagement');
          }
        } else {
          setMessage({ error: 'Token not found in the response.' });
        }
      } else {
        setMessage({ error: res?.errorMessage });
      }
    } catch (error) {
      console.log(error);
      setMessage({ error: 'Login failed. Please try again.' });
    }
    setLoading(false);
  };

  const isFormValid =
    formData.username.trim().length >= 4 && formData.password.length >= 8;

  return (
    <>
      <Toaster message={message} />
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative mx-3 flex w-full max-w-4xl flex-col overflow-hidden rounded-lg shadow-xl md:flex-row">
          {/* Left Section */}
          <div className="flex hidden w-full items-center justify-center bg-[#b2282f] p-6 pb-8 text-white md:flex md:w-2/5">
            <h1 className="relative inline-block text-5xl font-bold">
              <span className="relative">
                Log
                <span className="absolute left-0 bottom-[-11px] h-[2px] w-full bg-white pt-1"></span>
              </span>
              in
            </h1>
          </div>

          {/* Circle with Arrow */}
          <div className="absolute left-[37.5%] top-1/2 hidden h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full bg-[#b2282f] md:flex">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Right Section (Form) */}
          <div className="w-full bg-white p-12 md:w-3/5">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="mb-4 block text-center text-xl font-semibold text-[#b2282f] sm:hidden">
                Login
              </div>
              <div>
                <label className="mb-2 block text-[#b2282f]">USERNAME</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border-b py-2 focus:border-[#b2282f] focus:outline-none"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-[#b2282f]">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[#b2282f]">PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className=" w-full border-b py-2 focus:border-[#b2282f] focus:outline-none"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-[#b2282f]">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full rounded py-3 transition-opacity ${
                  isFormValid && !loading
                    ? 'bg-[#b2282f] text-white hover:bg-[#d54d6d]'
                    : 'cursor-not-allowed bg-[#b2282f] text-white opacity-40'
                }`}
              >
                {loading ? <Spinner /> : 'Login'}
              </button>
            </form>

            {/* <div className="p-5">
              <span>
                Don't have an account?{' '}
                <span
                  className="cursor-pointer text-[#b2282f] underline"
                  onClick={() => {
                    navigate('/signup');
                  }}
                >
                  Register Yourself
                </span>
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
