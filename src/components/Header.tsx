import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import LogoIcon from '../images/logo/logo-icon.svg';
// import DarkModeSwitcher from './DarkModeSwitcher';
// import DropdownMessage from './DropdownMessage';
// import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../redux/slices/titleSlice';
import { RootState, AppDispatch } from '../redux/store';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  // Declare state variable for viewportWidth
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const title = useSelector((state: RootState) => state.title.title);

  const dispatch: AppDispatch = useDispatch();

  // Map your pathnames to the titles you want
  const getTitleFromPathname = (pathname: string) => {

    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/Interaction/form':
        return 'Interaction Form';
      case '/TaskManagement':
        return 'Task Management';
      case '/workflow/system':
        return 'Workflow System';
      case '/reports':
        return 'Reports';
      case '/resaleNoc':
        return 'Resale NOC';
      case '/ticket':
        return 'Open A Ticket';
      
      default:
        return  'Task Management';

    }
  };
  

  // Set the title based on the current pathname on initial load
  useEffect(() => {
    const currentPath = window.location.pathname;
    const pageTitle = getTitleFromPathname(currentPath);
    dispatch(setTitle(pageTitle));
  }, [dispatch]);

  // Function to update the viewport width when the window is resized
  const updateViewportWidth = () => {
    setViewportWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateViewportWidth);

    return () => {
      window.removeEventListener('resize', updateViewportWidth);
    };
  }, []);

  return (
    <header className="sticky top-0 z-999 flex w-full border-b  border-[#EDEDED] bg-white ">
      <div className="flex flex-grow items-center justify-between py-[24px] px-4 shadow-2 md:px-6 2xl:px-11 ">
        {/* <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}

        {/* <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block items-center rounded-sm  border p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white  ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white  ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white  ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300  duration-200 ease-in-out dark:bg-white  ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white  ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button> */}

        {/* <h4 className=" block text-lg text-[24px] font-semibold leading-[32px] text-[#1D2532] lg:hidden">
          {title}
        </h4> */}

        <div className="inline-flex items-center gap-3">
          <h4 className="ml-[64px] text-[14px] font-bold leading-[32px] text-[#1C1C1C] md:text-[24px] lg:ml-0 lg:block">
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
