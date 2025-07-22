import { useState, ChangeEvent, useEffect, useCallback, useMemo } from 'react';
import ContractorName from '../../images/ContractorName.png';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Spinner from '../../common/Spinner';
import {
  createResaleNoc,
  getUnits,
  getUsers,
} from '../../api/modules/Swiftsync.class';
import Select, { ActionMeta } from 'react-select';
import CustomMenuList from '../Interaction Form/units/CustomMenuList';
import Toaster from '../Toast/Toast';

type FormData = {
  mastercomm: string;
  email: string;
  unitNumber: string;
  customerName: string;
  contactNumber: string;
  initiatorName: string;
};

type FormErrors = {
  [K in keyof FormData]: string;
};

type Option = {
  value: string;
  label: string;
};

type CustomStyles = {
  control: (provided: any, state: any) => any;
  menu: (provided: any) => any;
  option: (provided: any, state: any) => any;
};


export default function ResaleForm() {

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [message, setMessage] = useState({});
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for submission status
  const [formData, setFormData] = useState<FormData>({
    mastercomm: '',
    email: '',
    unitNumber: '',
    customerName: '',
    contactNumber: '',
    initiatorName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    mastercomm: '',
    email: '',
    unitNumber: '',
    customerName: '',
    contactNumber: '',
    initiatorName: '',
  });

  const [touched, setTouched] = useState<{ [K in keyof FormData]?: boolean }>(
    {}
  );

  const initialFormData = useMemo(() => ({
    mastercomm: '',
    email: '',
    unitNumber: '',  // This is correctly set to empty string
    customerName: '',
    contactNumber: '',
    initiatorName: '',
  }), []);

  const validateField = useCallback(
    (name: keyof FormData, value: string): string => {
      switch (name) {
        case 'mastercomm':
          return value.trim() === '' ? 'Master Community is required' : '';
        case 'unitNumber':
          return value.trim() === '' ? 'Unit Number is required' : '';
        case 'email':
          return value.trim() === '' ? 'Email is required' : '';
        case 'customerName':
          return value.trim() === '' ? 'Customer Name is required' : '';
        case 'contactNumber':
          return value && !isValidPhoneNumber(value)
            ? 'Please enter a valid phone number'
            : '';
        default:
          return '';
      }
    },
    []
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name as keyof FormData, value),
      }));
    },
    [validateField]
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        contactNumber: value || '',
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactNumber: validateField('contactNumber', value || ''),
      }));
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newErrors: FormErrors = {} as FormErrors;

      (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      });

      setErrors(newErrors);
      setTouched(
        Object.fromEntries(
          Object.keys(formData).map((field) => [field, true])
        ) as typeof touched
      );

      if (Object.values(newErrors).some((error) => error)) return;

      setLoading(true);

      const formDataPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataPayload.append(key, value);
      });
      formDataPayload.append('projectName', formData.unitNumber);

      const res = await createResaleNoc(formDataPayload);

      if (res.status == 200) {
        setMessage({ success: 'Resale NOC created successfully!' });
        setIsSubmitted(true); // Set submission status to true
      
      }
      setLoading(false);
    },
    [formData, validateField]
  );

  const customStyles: CustomStyles = useMemo(
    () => ({
      control: (provided, state) => ({
        ...provided,
        borderColor: '#ccc',
        padding: '6px 8px',
        fontSize: '14px',
        fontWeight: '400',
        color: isSubmitted ? '#6b7280' : '#1C1C1C',
        backgroundColor: isSubmitted ? '#f9fafb' : provided.backgroundColor,
        '&:hover': {
          borderColor: isSubmitted ? '#ccc' : '#B2282F',
        },
        '&:focus': {
          borderColor: isSubmitted ? '#ccc' : '#B2282F',
        },
      }),
      menu: (provided) => ({
        ...provided,
        fontSize: '14px',
        fontWeight: '400',
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#B2282F' : 'white',
        color: state.isSelected
          ? 'white'
          : state.data.value === 'addInteraction'
          ? '#B2282F'
          : '#1C1C1C',
        fontWeight:
          state.data.value === 'addInteraction' ? 'bold' : provided.fontWeight,
        cursor:
          state.data.value === 'addInteraction' ? 'pointer' : provided.cursor,
        '&:hover': {
          backgroundColor:
            state.data.value === 'addInteraction' ? '#F0F0F0' : 'grey',
        },
      }),
    }),
    [isSubmitted]
  );

  const handleInputChange = useCallback(
    (inputValue: string, actionMeta: ActionMeta) => {
      if (actionMeta.action === 'input-change') {
        setSearchTerm(inputValue);
      }
      return inputValue;
    },
    []
  );

  const fetchOptions = useCallback(
    async (append = true) => {
      try {
        const response = await getUnits({ searchTerm, page, pageSize });
        if (!response.statusText === 'OK') {
          throw new Error('Network response was not ok');
        }
        const newData = await response.data;

        if (!newData || newData.length === 0) {
          setHasMoreData(false);
          return;
        }

        const newOptions = newData.map((unit) => ({
          value: `${unit.slno}-${unit.sapno} `,
          label: `${unit.slno} - ${unit.sapno} `,
        }));

        setOptions((prevOptions) =>
          append ? [...prevOptions, ...newOptions] : newOptions
        );
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error('Failed to fetch units:', error);
      }
    },
    [page, pageSize, searchTerm]
  );

  useEffect(() => {
    setPage(1);
    setOptions([]);
    setHasMoreData(true);
  }, [searchTerm]);

  useEffect(() => {
    if (page === 1 && hasMoreData) {
      fetchOptions(false);
    }
  }, [page, hasMoreData, fetchOptions]);

  const isFormDataEmpty = useCallback((data: FormData) => {
    return Object.values(data).some((value) => {
      if (typeof value === 'string') {
        return value.trim() === '';
      }
      return !value;
    });
  }, []);

  const fields = useMemo(() => ['mastercomm', 'customerName', 'email'], []);

  const handleUnitChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value?.value || '' }));
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setTouched({});
    setErrors({
      mastercomm: '',
      email: '',
      unitNumber: '',
      customerName: '',
      contactNumber: '',
      initiatorName: '',
    });
    setIsSubmitted(false);
  }, [initialFormData]);

  useEffect(() => {
    const api = async () => {
      const res = await getUsers();
      if (res.status == 200) {
        const newData = await res.data;
        const salesUsers = newData.filter(
          (user) => user.department === 'Sales'
        );
        setUsers(salesUsers);
      }
    };
    api();
  }, []);

  return (
    <>
      <Toaster message={message} />
      <div className="mx-auto max-w-3xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-[#333333]">
          Resale NOC
        </h2>
        
        {/* Clear Button - Only shown when form has data */}
        {!isFormDataEmpty(formData) && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
            >
              Clear Form
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div
              key={field}
              className="flex flex-col gap-2 sm:flex-row sm:items-center"
            >
              <label className="min-w-[140px] text-sm text-[#666666]">
                {field === 'mastercomm'
                  ? 'Master Community'
                  : field
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  name={field}
                  value={formData[field as keyof FormData]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitted}
                  className={`w-full border p-2 ${
                    errors[field as keyof FormErrors] ? '' : 'border-[#E5E7EB]'
                  } ${
                    isSubmitted ? 'bg-gray-50 text-gray-500' : 'bg-white'
                  } rounded focus:outline-none focus:ring-1 focus:ring-[#D1D5DB]`}
                />
                {field === 'customerName' && (
                  <span className="absolute right-3 top-2.5">
                    <img
                      src={ContractorName}
                      width={18}
                      height={18}
                      alt=""
                      aria-hidden="true"
                    />
                  </span>
                )}

                {errors[field as keyof FormData] &&
                  touched[field as keyof FormData] && (
                    <p className="mt-1 text-xs text-red">
                      {errors[field as keyof FormErrors]}
                    </p>
                  )}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="min-w-[140px] text-sm text-[#666666]">
              Initiator Name
            </label>
            <div className="relative w-full">
              <Select
                name="initiatorName"
                className="w-full"
                value={
                  users?.find(
                    (user) => user.username === formData.initiatorName
                  )
                    ? {
                        value: formData.initiatorName,
                        label: formData.initiatorName,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  handleUnitChange('initiatorName', selectedOption)
                }
                options={users.map((user) => ({
                  value: user.username,
                  label: user.username,
                }))}
                isClearable
                styles={customStyles}
                isSearchable
                placeholder="Select initiator..."
                isDisabled={isSubmitted}
              />
              {errors.initiatorName && touched.initiatorName && (
                <p className="mt-1 text-xs text-red">{errors.initiatorName}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="min-w-[140px] text-sm text-[#666666]">
              Unit Number
            </label>
            <div className="relative w-full">
            <Select
  name="unitNumber"
  className="w-full"
  value={options.find(option => option.value === formData.unitNumber) || null}
  onChange={(value) => handleUnitChange('unitNumber', value)}
  options={options}
  isClearable
  onInputChange={handleInputChange}
  components={{
    MenuList: (props) => (
      <CustomMenuList
        {...props}
        hasMoreData={hasMoreData}
        fetchOptions={fetchOptions}
      />
    ),
  }}
  styles={customStyles}
  isSearchable
  placeholder="Search units..."
  isDisabled={isSubmitted}
/>
              {errors.unitNumber && touched.unitNumber && (
                <p className="mt-1 text-xs text-red">{errors.unitNumber}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="min-w-[140px] text-sm text-[#666666]">
              Project Name
            </label>
            <div className="relative w-full">
              <input
                type="text"
                name="projectName"
                value={formData.unitNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitted}
                className={`w-full rounded border border-[#E5E7EB] p-2 focus:outline-none focus:ring-1 focus:ring-[#D1D5DB] ${
                  isSubmitted ? 'bg-gray-50 text-gray-500' : 'bg-white'
                }`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="min-w-[140px] text-sm text-[#666666]">
              Contact Number
            </label>
            <div className="relative w-full">
              <PhoneInput
                name="contactNumber"
                defaultCountry="AE"
                value={formData.contactNumber}
                placeholder="Enter phone number"
                onChange={handlePhoneChange}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, contactNumber: true }))
                }
                withCountryCallingCode
                international
                countryCallingCodeEditable
                disabled={isSubmitted}
                className={`PhoneInputInput w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px] ${
                  isSubmitted ? 'bg-gray-50 text-gray-500' : 'text-[#1C1C1C] bg-white'
                }`}
              />
              {errors.contactNumber && touched.contactNumber && (
                <p className="mt-1 text-xs text-red">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={
                isFormDataEmpty(formData) ||
                Object.values(errors).some((error) => error !== '') ||
                isSubmitted
              }
              className={`mt-5 flex items-center gap-3 px-[12px] py-[10px] font-normal text-white ${
                isFormDataEmpty(formData) ||
                Object.values(errors).some((error) => error !== '') ||
                isSubmitted
                  ? 'cursor-not-allowed bg-[#B2282F]/30'
                  : 'bg-[#B2282F]'
              }`}
            >
              {loading ? <Spinner /> : isSubmitted ? 'Submitted' : 'Submit Form'}
              {!loading && !isSubmitted && (
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
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}