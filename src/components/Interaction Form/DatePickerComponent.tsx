import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const formatDateDefault = (dateValue) => {
  if (!dateValue) return '';
  const localDate = new Date(
    dateValue?.getTime() - dateValue.getTimezoneOffset() * 60000
  );
  const day = localDate.getDate().toString().padStart(2, '0');
  const month = localDate
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const year = localDate.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatForDateInput = (dateValue) => {
  
  if (!dateValue) return '';
  const localDate = new Date(
    dateValue.getTime() - dateValue.getTimezoneOffset() * 60000
  );
  const year = localDate.getFullYear();
  const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
  const day = localDate.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
};

const DatePickerComponent = ({
  date,
  className,
  name,
  style,
  textStyle,
  formatDate = formatDateDefault,
  onDateChange,
  
}) => {
  const [inputWidth, setInputWidth] = useState('auto');
  const inputRef = useRef(null);

  const handleDateChange = (e) => {
    const inputDate = new Date(e.target.value);
    inputDate.setHours(12, 0, 0, 0);
    onDateChange(formatDate(inputDate), inputDate);
  };

  useEffect(() => {
    if (inputRef.current) {
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.font = window.getComputedStyle(inputRef.current).font;
      span.textContent = formatDate(date);

      document.body.appendChild(span);
      const width = span.offsetWidth;
      document.body.removeChild(span);

      setInputWidth(`${width + 15}px`);
    }
  }, [date, formatDate]);

  const containerStyle = {
    ...style,
    display: 'flex',
    alignItems: 'center',
    width: '220px',
    padding: '8px',
  };

  const textSt = {
    ...textStyle,
    width: inputWidth,
    minWidth: '50px',
  };

  return (
    <div {...(className ? { className, name } : { style: containerStyle, name })}>
      <input
        ref={inputRef}
        type="text"
        value={formatForDateInput(date)}
        readOnly
        placeholder="Select Date"
        {...(typeof textStyle === 'object' && !Array.isArray(textStyle)
          ? { style: textSt }
          : { className: `w-auto min-w-12 focus:outline-none ${textStyle}` })}
      />
      <input
        type="date"
        name='followUpDate'
        style={{ width: 20 }}
        onChange={handleDateChange}
        value={formatForDateInput(date)} 
      />
    </div>
  );
};

export default DatePickerComponent;
