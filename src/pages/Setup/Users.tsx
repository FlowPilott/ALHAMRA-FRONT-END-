import React from 'react';
import UsersTable from '../../components/UsersTable';
import UserModal from '../../components/UserModal';
const Migration = () => {
  const [user, setUser] = React.useState<Setup[]>([]);
 
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-5">
      <h2 className="text-title-md2 font-semibold text-black dark:text-[#1D2532] dark:text-white">
      Users
      </h2>
      <UserModal setUser={setUser}/>
      
    </div>

    <UsersTable setUser={setUser} user={user}/>
    </>
  );
};

export default Migration;
