import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { useEffect } from 'react';

const PhoneInput = ({ formData, handlePhoneChange }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 450);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 450);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="flex w-full flex-col">
      <PhoneInput
        country={'us'}
        value={formData?.contractorContact}
        onChange={handlePhoneChange}
        enableSearch={true}
        inputStyle={{
          width: '100%',
          padding: '12px',
          border: '1px solid ',
          borderColor: isFocused ? 'red' : '',
          borderRadius: '4px',
          paddingLeft: isLargeScreen ? '12px' : '75px',
          marginLeft: isLargeScreen ? '100px' : '10px', // Conditional margin
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        containerStyle={{
          display: 'flex',
          alignItems: 'center',
        }}
        buttonStyle={{
          backgroundColor: 'white',
          borderColor: isFocused ? 'red' : '',
          border: '1px solid',
          borderRadius: '4px',
          borderRight: '1px solid',
          width: isLargeScreen ? '16%' : '30%',
        }}
      />
    </div>
  );
};

export default PhoneInput;
