import React, { useState, useEffect, useCallback } from 'react';
import DatePickerComponent from './DatePickerComponent';
import {
  getInteractionList,
  getUnits,
  InternalForm,
  postInteractionList,
} from '../../api/modules/Swiftsync.class';
import Toaster from '../../components/Toast/Toast';
import Spinner from '../../common/Spinner';
import Select from 'react-select';
import CustomMenuList from './units/CustomMenuList';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import AddInteractionModal from './AddInteractionModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import formConfig from '../../utils/formConfig.json';
import { formatDate } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';
interface CustomStyles {
  control: (provided: any) => any;
  menu: (provided: any) => any;
  option: (provided: any, state: any) => any;
}
interface HandleDateChangeParams {
  formatted: string;
  unformatted: string;
  field: string;
}
interface SelectOption {
  value: string;
  label: string;
}
const customStyles: CustomStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#ccc',
    padding: '6px 8px',
    fontSize: '14px',
    fontWeight: '400',
    color: '#1C1C1C',
    '&:hover': {
      borderColor: '#B2282F',
    },
    '&:focus': {
      borderColor: '#B2282F',
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
    cursor: state.data.value === 'addInteraction' ? 'pointer' : provided.cursor, // Add cursor: pointer
    '&:hover': {
      backgroundColor:
        state.data.value === 'addInteraction' ? '#F0F0F0' : 'grey',
    },
  }),
};
const InternalSubmissionForm = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  interface InteractionType {
    name: string;
  }

  const [interactionTypes, setInteractionTypes] = useState<InteractionType[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const navigate = useNavigate();

  const initialFormData = {
    date: formatDate(new Date().toISOString()),
    customerType: 'External',
    typeSel: 'Service Provider',
    // paymentOption: '',
    projectName: '',
    customerName: '',
    unitNumber: '',
    emailAddress: '',
    contactNumber: '',
    typeOfInteraction: '',
    purposeOfInteraction: '',
    followUp: 'true',
    followUpDate: '',
    remarks: '',
  };

  const validationSchema = Yup.object().shape({
    customerName: Yup.string().when('typeSel', {
      is: (val) => val === 'Tenant' || val === 'Owner',
      then: (schema) => schema.required('Owner Name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    emailAddress: Yup.string()
      .email('Invalid email')
      .required('Email Address is required'),

      contactNumber: Yup.string()
      .test('is-valid-phone', 'Invalid phone number', (value) =>
        value ? isValidPhoneNumber(value) : false
      )
      .required('Contact Number is required'),
    

    typeOfInteraction: Yup.string().required('Type of Interaction is required'),
    purposeOfInteraction: Yup.string().required(
      'Purpose of Interaction is required'
    ),

    unitNumber: Yup.string().when('typeSel', {
      is: (val) => val !== 'Third-Party Contractor',
      then: (schema) => schema.required('Unit Number is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    // paymentOption: Yup.string().when('typeSel', {
    //   is: (val) => val === 'Third-Party Contractor',
    //   then: (schema) => schema.required('Payment options is required'),
    //   otherwise: (schema) => schema.notRequired(),
    // }),

    typeSel: Yup.string().required('Type is required'),

    // followUpDate: Yup.date()
    //   .nullable()
    //   .when('followUp', {
    //     is: 'true',
    //     then: (schema) =>
    //       schema
    //         .min(new Date(), 'Follow-up date cannot be in the past')
    //         .required('Follow-up Date is required'),
    //     otherwise: (schema) => schema.notRequired(), // If "No", followUpDate is not required
    //   }),
  });

  const formik = useFormik({
    initialValues: initialFormData,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formatDate = (dateStr: string) => {
          if (!dateStr) return null;
          const parts = dateStr.split('-'); // Split "21-FEB-2025"
          const day = parts[0];
          const month = new Date(`${parts[1]} 1, 2000`).getMonth() + 1; // Convert "FEB" to 2
          const year = parts[2];

          return `${year}-${month.toString().padStart(2, '0')}-${day}`; // Format "2025-02-21"
        };

        const submissionData = {
          ...values,
          date: formatDate(values.date),
          followUpDate: values.followUpDate
            ? formatDate(values.followUpDate)
            : null,
            
        };

        const res = await InternalForm(submissionData);
        if (res?.status === 201) {
          setMessage({ success: 'Form submitted successfully!' });
          formik.resetForm();
          navigate('/reports');
        }
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

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
          value: `${unit.slno}-${unit.sapno}`,
          label: `${unit.slno} - ${unit.sapno}`,
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
    // Reset options and page when searchTerm changes
    if (searchTerm) {
      setOptions([]); // Clear existing options
      setPage(1); // Reset to the first page
      setHasMoreData(true); // Reset hasMoreData for the new search
      fetchOptions(false); // Fetch new data without appending
    }
  }, [searchTerm]);

  useEffect(() => {
    if (page === 1 && hasMoreData) {
      fetchOptions(false);
    }
  }, [page, hasMoreData, fetchOptions]);

  const handleDateChange = (
    formatted: string,
    unformatted: Date | null,
    field: string
  ) => {
    if (unformatted) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

      if (unformatted < today) {
        formik.setFieldError(field, 'Follow-up date cannot be in the past.');
      } else {
        formik.setFieldValue(field, formatted);
        formik.setFieldError(field, ''); // Clear any previous error
      }
    } else {
      formik.setFieldValue(field, ''); // Clear the field if no date is selected
    }
  };

  const handleSelectChange = (
    selectedOption: SelectOption | null,
    fieldName: string
  ) => {
    formik.setFieldValue(fieldName, selectedOption?.value || '');
  };
  const handleAddInteraction = async () => {
    if (!newInteraction.trim()) return;

    setLoading(true);
    try {
      const res = await postInteractionList(newInteraction);

      if (res?.status === 200) {
        await fetchInteractionList(); // Ensure the new value is available in options

        // Find the new interaction from the updated list
        formik.setFieldValue('purposeOfInteraction', newInteraction);

        setNewInteraction('');
        setIsModalOpen(false);
      } else {
        console.error('Error adding interaction:', res);
      }
      setLoading(false);
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const fetchInteractionList = async () => {
    const res = await getInteractionList();
    setInteractionTypes(res?.data);
  };

  useEffect(() => {
    fetchInteractionList();
  }, []);

  const getTypeSelOptions = () => {
    const customerType = formik.values.customerType;
    return formConfig?.formFields?.typeSel.options[customerType] || [];
  };
  useEffect(() => {
    if (formik.values.unitNumber) {
      const selectedUnit = options.find(
        (o) => o.value === formik.values.unitNumber
      );
      if (selectedUnit) {
        formik.setFieldValue('projectName', selectedUnit.label);
      }
    }
  }, [formik.values.unitNumber, options]);
  useEffect(() => {
    if (formik.values.followUp === 'false') {
      formik.setFieldValue('followUpDate', null);
    }
  }, [formik.values.followUp]);


  return (
    <>
      <Toaster message={message} />
      <form
        className="mx-auto ml-12 max-w-3xl bg-white p-6 shadow-md md:ml-auto"
        onSubmit={formik.handleSubmit}
      >
        <h2 className="mb-4 text-xl font-semibold text-[#1C1C1C]">
          Interaction Form
        </h2>

        {Object?.entries(formConfig.formFields)?.map(
          ([fieldName, fieldConfig]) => {
            if (
              fieldName === 'followUpDate' &&
              formik.values.followUp !== 'true'
            ) {
              return null;
            }
            if (
              fieldName === 'customerName' &&
              formik.values.typeSel !== 'Tenant' &&
              formik.values.typeSel !== 'Owner'
            ) {
              return null;
            }
            return (
              <div
                key={fieldName}
                className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12"
              >
                {fieldName !== 'paymentOption' ||
                formik.values.typeSel === 'Third-Party Contractor' ? (
                  <label className="mb-1 block text-sm font-normal text-[#6E6D6D] md:w-[30%]">
                    {fieldConfig?.label}
                    {'required' in fieldConfig && fieldConfig.required && (
                      <span className="text-[#B2282F]">*</span>
                    )}
                  </label>
                ) : null}

                <div className="flex w-full flex-col">
                  {fieldConfig.type === 'select' ? (
                    <div className="flex w-full">
                      {fieldName === 'purposeOfInteraction' ? (
                        <div className="flex w-full items-center space-x-2">
                          <div className="w-full">
                            <Select
                              name={fieldName}
                              value={(() => {
                                const fieldValue = formik.values[fieldName];
                                if (!fieldValue) return null;
                                return (
                                  interactionTypes
                                    ?.map((type) => ({
                                      value: type.name,
                                      label: type.name,
                                    }))
                                    .find(
                                      (option) => option.value === fieldValue
                                    ) || null
                                );
                              })()}
                              onChange={(selectedOption) => {
                                if (selectedOption.value === 'addInteraction') {
                                  setIsModalOpen(true);
                                } else {
                                  handleSelectChange(selectedOption, fieldName);
                                }
                              }}
                              options={[
                                ...interactionTypes
                                  ?.filter((type) => {
                                    if (
                                      type.name === 'Enquiry for Modification'
                                    ) {
                                      return (
                                        formik.values.typeSel === 'Owner' ||
                                        formik.values.typeSel === 'Tenant'
                                      );
                                    }
                                    return true;
                                  })
                                  .map((type) => ({
                                    value: type.name,
                                    label: type.name,
                                  })),
                                {
                                  value: 'addInteraction',
                                  label: 'Add Interaction',
                                },
                              ]}
                              styles={customStyles}
                              isSearchable
                              placeholder="Select Purpose..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full">
                          <Select
                            name={fieldName}
                            value={(() => {
                              const fieldValue = formik.values[fieldName];
                              if (!fieldValue) return null;

                              if (fieldName === 'unitNumber') {
                                return (
                                  options?.find(
                                    (o) => o.value === fieldValue
                                  ) || null
                                );
                              }

                              if (fieldName === 'typeSel') {
                                return (
                                  getTypeSelOptions().find(
                                    (o) => o.value === fieldValue
                                  ) || null
                                );
                              }

                              return (
                                formConfig.formFields[fieldName]?.options?.find(
                                  (o) => o.value === fieldValue
                                ) || null
                              );
                            })()}
                            components={
                              fieldName === 'unitNumber'
                                ? {
                                    MenuList: (props) => (
                                      <CustomMenuList
                                        {...props}
                                        hasMoreData={hasMoreData}
                                        fetchOptions={fetchOptions}
                                      />
                                    ),
                                  }
                                : undefined // Apply default MenuList for other fields
                            }
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, fieldName)
                            }
                            onInputChange={(newValue) => {
                              if (fieldName === 'unitNumber') {
                                setSearchTerm(newValue);
                              }
                            }}
                            options={
                              fieldName === 'unitNumber'
                                ? options
                                : fieldName === 'typeSel'
                                ? getTypeSelOptions()
                                : formConfig.formFields[fieldName]?.options
                            }
                            styles={customStyles}
                            isSearchable
                            placeholder={`Search ${fieldConfig.label}...`}
                          />
                        </div>
                      )}
                    </div>
                  ) : fieldConfig.type === 'radio' ? (
                    (fieldName !== 'paymentOption' ||
                      formik.values.typeSel === 'Third-Party Contractor') && (
                      <div className="flex space-x-4">
                        {fieldConfig?.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex text-[#1C1C1C] md:items-center"
                          >
                            <input
                              type="radio"
                              name={fieldName}
                              value={option.value}
                              checked={
                                formik.values[fieldName] === option.value
                              }
                              onChange={formik.handleChange}
                              className="mr-2 h-5 w-5 cursor-pointer font-normal accent-[#B2282F]"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    )
                  ) : fieldConfig.type === 'date' ? (
                    fieldName === 'date' ? (
                      <input
                        type="text"
                        value={formatDate(new Date())}
                        readOnly
                        className="flex w-full items-center justify-between border-[1px] border-[#ccc] px-2 py-1.5 text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-3 md:py-2"
                      />
                    ) : (
                      <DatePickerComponent
                        name="followUpDate"
                        date={
                          formik.values.followUpDate
                            ? new Date(formik.values.followUpDate)
                            : null
                        }
                        minDate={new Date()} // Disable past dates
                        onDateChange={(formatted, unformatted) =>
                          handleDateChange(
                            formatted,
                            unformatted,
                            'followUpDate'
                          )
                        }
                        className="flex w-full items-center justify-between border-[1px] border-[#ccc] px-2 py-1.5 text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-3 md:py-2"
                      />
                    )
                  ) : fieldConfig.type === 'phone' ? (
                    <PhoneInput
                      name="contactNumber"
                      defaultCountry="AE"
                      value={formik.values.contactNumber}
                      placeholder="Enter phone number"
                      onChange={(value) =>
                        formik.setFieldValue('contactNumber', value)
                      }
                      withCountryCallingCode={true}
                      international={true}
                      countryCallingCodeEditable={true}
                      className="PhoneInputInput w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
                    />
                  ) : fieldConfig.type === 'textarea' ? (
                    <textarea
                      name={fieldName}
                      value={formik.values[fieldName]}
                      onChange={formik.handleChange}
                      placeholder={`Write ${fieldConfig.label} Here...`}
                      className="w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
                    />
                  ) : (
                    <input
                      type={fieldConfig.type}
                      name={fieldName}
                      value={formik.values[fieldName]}
                      onChange={formik.handleChange}
                      className="w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
                    />
                  )}
                  {(fieldName !== 'paymentOption' ||
                    formik.values.typeSel === 'Third-Party Contractor') &&
                    formik.errors[fieldName] && (
                      <span className="text-red">
                        {formik.errors[fieldName]}
                      </span>
                    )}
                </div>
              </div>
            );
          }
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!formik.isValid || loading}
            className={`inline-flex items-center justify-center gap-3 bg-[#B2282F] px-[12px] py-[10px] font-normal text-white ${
              !formik.isValid && 'cursor-not-allowed opacity-50'
            }`}
          >
            {loading ? <Spinner /> : 'Submit Form'}
            {!loading && (
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
      <AddInteractionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newInteraction={newInteraction}
        setNewInteraction={setNewInteraction}
        onSubmit={handleAddInteraction}
        loading={loading}
      />
    </>
  );
};

export default InternalSubmissionForm;
