'use client'

import React, { useState, useRef, useEffect } from 'react';

interface FormData {
  termsAndConditions: boolean;
}

interface Errors {
  termsAndConditions?: string;
}

interface TermsAndConditionsModalContentProps {
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Errors;
}

const TermsAndConditionsModalContent: React.FC<TermsAndConditionsModalContentProps> = ({ formData, handleChange, errors }) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const termsBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (termsBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = termsBoxRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        setIsScrolledToBottom(isAtBottom);
      }
    };

    const termsBox = termsBoxRef.current;
    if (termsBox) {
      termsBox.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (termsBox) {
        termsBox.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="container mx-auto max-w-3xl">
      <div
        ref={termsBoxRef}
        className="terms-box border-gray-300 bg-gray-50 h-96 overflow-y-auto border p-4 mb-4"
      >
        <h3 className="text-gray-700 mt-4 text-lg font-semibold">
          Modifications & Alterations
        </h3>
        <p className="text-gray-600 mt-2">
          The following guidelines assist homeowners in understanding policies
          for making alterations or modifications to their properties.
        </p>
        <ul className="text-gray-600 mt-3 list-inside list-disc">
          <li>
            Structural changes or modifications to the internal or external
            parts of the Unit are prohibited without written approval from the
            Management.
          </li>
          <li>
            No external alterations, including changes to the exterior painting,
            are allowed without written approval from the Management.
          </li>
          <li>
            Residents must submit a written modification form detailing the
            proposed changes, including drawings and specifications.
          </li>
          <li>
            A refundable deposit of AED 5,000/- must be made to the Management,
            which may cover any damages caused by the works.
          </li>
          <li>
            Approvals for major works take up to 10 working days, while minor
            works take up to 5 working days.
          </li>
          <li>
            Modification works must not exceed three months from the approval
            date.
          </li>
          <li>
            Residents are responsible for repairs to common power and water
            lines caused by the modifications.
          </li>
          <li>Work hours are from Monday to Saturday, 9:00 AM to 6:00 PM.</li>
          <li>
            All modifications must comply with applicable laws, and residents
            must obtain all necessary permits at their own expense.
          </li>
          <li>
            Modifications must maintain the aesthetics of the property. The
            Management reserves the right to remove any unmaintained alterations
            at the resident's expense.
          </li>
        </ul>
        <h3 className="text-gray-700 mt-6 text-lg font-semibold">
          Technical Guidelines
        </h3>
        <ul className="text-gray-600 mt-3 list-inside list-disc">
          <li>
            New construction must be set back at least 1.5 meters from the
            compound wall.
          </li>
          <li>
            The maximum height of new structures cannot exceed 3.0 meters.
          </li>
          <li>All facades must adhere to the existing architectural scheme.</li>
          <li>
            Construction materials must be stored within the Unit's boundaries,
            and debris must be disposed of at the owner's expense.
          </li>
          <li>
            Any leakages arising from modifications affecting other apartments
            will be the owner's responsibility.
          </li>
          <li>
            Noise levels must be minimized to avoid inconvenience to other
            residents.
          </li>
          <li>
            Public holiday modifications are prohibited, and contractors must
            adhere to all community safety and security rules.
          </li>
          <li>
            Access permits are granted only after payment, and modifications are
            subject to inspections by the Management.
          </li>
        </ul>
      </div>
      <div className="flex flex-col">
        <div className="items-left flex gap-2">
          <input
            type="checkbox"
            name="termsAndConditions"
            checked={formData.termsAndConditions}
            onChange={handleChange}
            disabled={!isScrolledToBottom}
            className={`h-5 w-5 ${
              isScrolledToBottom ? 'accent-[#B2282F] cursor-pointer' : 'accent-gray-300 cursor-not-allowed'
            }`}
          />
          <span className="text-sm text-[#1C1C1C]">
          I agree with terms & conditions.
          </span>
        </div>
        {errors.termsAndConditions && (
          <p className="text-red-500 mt-1 text-sm">
            {errors.termsAndConditions}
          </p>
        )}
       
      </div>
    </div>
  );
};

export default TermsAndConditionsModalContent;

