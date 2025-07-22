'use client';

import React, { useState } from 'react';
import TermsAndConditionsModalContent from './TermsAndConditionsModalContent';

interface FormData {
  termsAndConditions: boolean;
}

interface Errors {
  termsAndConditions?: string;
}

interface TermsAndConditionProps {
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Errors;
}

const TermsAndCondition: React.FC<TermsAndConditionProps> = ({
  formData,
  handleChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-start">
        <label className="mb-1 block text-sm font-normal md:w-[30%]">
        Terms & Conditions
        </label>
      
      </div>

      <TermsAndConditionsModalContent formData={formData}
  handleChange={handleChange} 
  errors ={errors}/>
    </div>
  );
};

export default TermsAndCondition;
