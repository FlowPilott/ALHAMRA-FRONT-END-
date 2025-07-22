
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DefaultLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //const isAuthenticated = false;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      {/* {!userIsLoggedIn && <SignIn/>} */}

      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="bg-grey-100 flex h-screen overflow-hidden ">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {isAuthenticated && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#F2F2F2] ">
          {/* <!-- ===== Header Start ===== --> */}
          {isAuthenticated && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto  p-3.5  2xl:p-8">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
