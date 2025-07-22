import React from 'react';
import Spinner from '../../../common/Spinner';

const SubmitButton = ({ isFormValid, loading }) => {
  return (
    <>
      <button
        type="submit"

        className={`inline-flex items-center justify-center gap-3 bg-[#B2282F] px-[12px] py-[10px] font-normal text-white ${
          !isFormValid ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={!isFormValid}
        >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <span> Submit Form</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
            >
              <path
                d="M3.50001 5.00002L0.25001 1.75002C0.0972324 1.59724 0.0208435 1.4028 0.0208435 1.16669C0.0208435 0.930576 0.0972324 0.736131 0.25001 0.583354C0.402788 0.430576 0.597232 0.354187 0.833344 0.354187C1.06945 0.354187 1.2639 0.430576 1.41668 0.583354L5.25001 4.41669C5.33334 4.50002 5.39237 4.5903 5.42709 4.68752C5.46182 4.78474 5.47918 4.88891 5.47918 5.00002C5.47918 5.11113 5.46182 5.2153 5.42709 5.31252C5.39237 5.40974 5.33334 5.50002 5.25001 5.58335L1.41668 9.41669C1.2639 9.56946 1.06945 9.64585 0.833344 9.64585C0.597232 9.64585 0.402788 9.56946 0.25001 9.41669C0.0972324 9.26391 0.0208435 9.06946 0.0208435 8.83335C0.0208435 8.59724 0.0972324 8.4028 0.25001 8.25002L3.50001 5.00002Z"
                fill="white"
              />
            </svg>
          </>
        )}
      </button>
    </>
  );
};

export default SubmitButton;
