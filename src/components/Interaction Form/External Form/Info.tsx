import React from 'react';
import info from '../../../images/info.png';

const Info = () => {
  return (
    <>
      <h4 className="flex items-center justify-center gap-[16px] border-l-[4px] bg-[#FBF4F5] p-[16px] font-normal text-[#B2282F]">
        <img src={info} alt="" />
        Any external contractor not registered with the management will incur one time charge of AED 525
      </h4>
    </>
  );
};

export default Info;
