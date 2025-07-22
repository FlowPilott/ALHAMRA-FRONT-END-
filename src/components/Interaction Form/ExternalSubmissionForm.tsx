import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  exFormSubmitted,
  ExternalForm,
} from '../../api/modules/Swiftsync.class';
import Toaster from '../Toast/Toast';
import { useNavigate, useParams } from 'react-router-dom';
import ContractorEmail from './External Form/ContractorEmail';
import CompanyName from './External Form/CompanyName';
import SubmitButton from './External Form/SubmitButton';
import Info from './External Form/Info';
import PropertyType from './External Form/PropertyType';
import OwnerName from './External Form/OwnerName';
import EmailAddress from './External Form/EmailAddress';
import WorkType from './External Form/WorkType';
import InternalWork from './External Form/InternalWork';
import ContractingCompName from './External Form/ContractingCompName';
import UploadContractAgreement from './External Form/UploadContractAgreement';
import UploadScopeOfWork from './External Form/UploadScopeOfWork';
import TermsAndCondition from './External Form/TermsAndConditions';
import UploadThirdPartyLiability from './External Form/UploadThirdPartyLiability';
import UploadEmiratesId from './External Form/UploadEmiratesId';
import UploadContractorTradeLicense from './External Form/UploadContractorTradeLicense';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import './style.css';
import TradeLisence from './External Form/TradeLisence';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CurrentLayoutDrawing from './External Form/CurrentLayoutDrawing';
import ProposedLayoutDrawing from './External Form/ProposedLayoutDrawing';
import OtherInternalWork from './External Form/OtherInternalWork';

const validationSchema = Yup.object({
  propertyType: Yup.string().required('Property Type is required'),
  ownerName: Yup.string().required('Owner Name is required'),
  contactNo: Yup.string().required('Contact Number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  workType: Yup.string().required('Work Type is required'),
  internalWork: Yup.array().min(
    1,
    'At least one Internal Work option must be selected'
  ),
  uploadContractAgreement: Yup.mixed().required(
    'Contract Agreement is required'
  ),
  detailedScopeofWork: Yup.mixed().required(
    'Detailed Scope of Work is required'
  ),
  contractorTradeLicense: Yup.mixed().required(
    'Contractor Trade License is required'
  ),
  contractingCompName: Yup.string().required(
    'Contracting Company Name is required'
  ),
  contractorContact: Yup.string().when(['contractingCompName'], {
    is: (contractingCompName) => contractingCompName === 'Other',
    then: () =>
      Yup.string()
        .required('Contact Number is required')
        .test('is-valid-phone', 'Invalid phone number', (value) =>
          isValidPhoneNumber(value || '')
        ),
    otherwise: () => Yup.string().notRequired(),
  }),
  contractorEmail: Yup.string().when(['contractingCompName'], {
    is: (contractingCompName) => contractingCompName === 'Other',
    then: () =>
      Yup.string()
        .email('Invalid email address')
        .required('Contractor Email is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  companyName: Yup.string().when(['contractingCompName'], {
    is: (contractingCompName) => contractingCompName === 'Other',
    then: () => Yup.string().required('Company Name is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  startDate: Yup.date().nullable().required('Start Date is required'),
  endDate: Yup.date()
    .nullable()
    .required('End Date is required')
    .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
  termsAndConditions: Yup.boolean().oneOf(
    [true],
    'PLEASE READ CAREFULLY AND ACCEPT THE Terms & Conditions BEFORE PROCEEDING'
  ),
});
const ExternalSubmissionForm = () => {
  const params = useParams();
  const [startDate, setStartDate] = useState();
  const [unitNumber, setUnitNumber] = useState("")
  const [secondDate, setSecondDate] = useState('');
  const initialFormData = {
    propertyType: '',
    ownerName: '',
    contactNo: '',
    email: '',
    workType: 'Internal Work',
    internalWork: [],
    uploadContractAgreement: '',
    otherWork: '',
    contractingCompName: '',
    contractorContact: '',
    contractorEmail: '',
    companyName: '',
    startDate: startDate,
    endDate: secondDate,
    termsAndConditions: false,
    trade_licence_no: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const api = async () => {
      setLoading(true);
      try {
        const response = await exFormSubmitted(params?.id);
        if (response?.data) {
          const responseData = {
            propertyType: '',
            ownerName: response?.data?.customerName || '',
            contactNo: response?.data?.contactNumber || '',
            email: response?.data?.emailAddress || '',
            workType: 'Internal Work',
            internalWork: [],
            uploadContractAgreement: '',
            otherWork: '',
            contractingCompName: '',
            contractorContact: '',
            contractorEmail: '',
            companyName: '',
            startDate: '',
            endDate: '',
            termsAndConditions: false,
            trade_licence_no: '',
          };

          setUnitNumber(response?.data?.unitNumber || "")
          formik.setValues(responseData);
          setFormData(responseData);
        }

        // Handle property type check
        if (response?.data?.propertyType) {
          setMessage({ success: 'Form Already Submitted' });
          setShow(false);
        } else {
          setShow(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    api();
  }, []);

  const formik = useFormik({
    initialValues: formData,
    enableReinitialize: true, // <-- This allows form to update when formData changes
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await ExternalForm(params?.id, values);
        setLoading(false);

        if (res?.interaction) {
          setMessage({
            success: 'Request received. An application reference will be sent to your email',
          });
          setTimeout(() => {
            window.location.href = 'https://alhamra.ae/';
          }, 3000);
          formik.resetForm();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Toaster message={message} />
      {show && (
        <form
          className="mx-auto max-w-3xl bg-white p-6 shadow-md"
          onSubmit={formik.handleSubmit}
        >
          <h2 className="mb-4 text-xl font-semibold text-[#1C1C1C]">
            Customer Submission Form
          </h2>
          <PropertyType
            formData={formik.values}
            handleChange={formik.handleChange}
            errors={formik.errors}
          />
          <OwnerName
            formData={formik.values}
            handleChange={formik.handleChange}
            errors={formik.errors}
          />
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
            <label className="mb-1 block text-sm font-normal  md:w-[30%]">
              Contact Number(s)
            </label>
            <div className="flex w-full flex-col">
              <PhoneInput
                name="contactNo"
                defaultCountry="AE"
                value={formik.values.contactNo}
                placeholder="Enter phone number"
                onChange={(value) => formik.setFieldValue('contactNo', value)}
                withCountryCallingCode={true}
                international={true}
                readOnly
                countryCallingCodeEditable={false}
                className="PhoneInputInput w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
              />
              <span>
                {formik.errors.contactNo && formik.touched.contactNo && (
                  <p style={{ color: 'red' }}>{formik.errors.contactNo}</p>
                )}
              </span>
            </div>
          </div>
          <EmailAddress
            formData={formik.values}
            handleChange={formik.handleChange}
            errors={formik.errors}
          />
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
          <label className="mb-1 block text-sm font-normal md:w-[30%]">
            Unit Number
          </label>
          <div className="flex w-full flex-col">
            <input
              type="text"
              value={unitNumber}
              readOnly
              className="w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal text-[#1C1C1C] bg-gray-50 focus:outline-none md:px-[12px] md:py-[10px]"
            />
          </div>
        </div>

          <WorkType
            formData={formik.values}
            handleChange={formik.handleChange}
          />
          <InternalWork
            formData={formik.values}
            setFieldValue={formik.setFieldValue}
            errors={formik.errors}
          />
          {formik.values.internalWork?.[0] === 'Others' && (
            <OtherInternalWork
              formData={formik.values}
              handleChange={formik.handleChange}
              errors={formik.errors}
            />
          )}
          <ContractingCompName
            formData={formik.values}
            handleChange={formik.handleChange}
            errors={formik.errors}
          />
          <TradeLisence
            formData={formik.values}
            handleChange={formik.handleChange}
          />
          <UploadContractAgreement
            errors={formik.errors}
            setFormData={(file) =>
              formik.setFieldValue('uploadContractAgreement', file)
            }
          />
          <div className="mb-4 border-[1px] border-[#ECE9E9] bg-[#F9F9F9] p-[16px]">
            {formik.values.contractingCompName === 'Other' && (
              <>
                <Info />
                <h2 className="mb-4 text-xl font-semibold text-[#1C1C1C]">
                  Unlisted Contractor Details
                </h2>
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-12">
                  <label className="mb-1 block text-sm font-normal  md:w-[30%]">
                    Contractor Contact
                  </label>
                  <div className="flex w-full flex-col">
                    <PhoneInput
                      name="contractorContact"
                      defaultCountry="AE"
                      value={formik.values.contractorContact}
                      placeholder="Enter phone number"
                      onChange={(value) =>
                        formik.setFieldValue('contractorContact', value)
                      }
                      withCountryCallingCode={true}
                      international={true}
                      countryCallingCodeEditable={true}
                      className="PhoneInputInput w-full border-[1px] border-[#ccc] px-[8px] py-[6px] font-normal text-[#1C1C1C] focus:outline-none focus:ring-[1px] focus:ring-[#B2282F] md:px-[12px] md:py-[10px]"
                    />
                    <span>
                      {formik.errors.contractorContact && (
                        <p style={{ color: 'red' }}>
                          {formik.errors.contractorContact}
                        </p>
                      )}
                    </span>
                  </div>
                </div>
                <ContractorEmail
                  formData={formik.values}
                  handleChange={formik.handleChange}
                  errors={formik.errors}
                />
                <CompanyName
                  formData={formik.values}
                  handleChange={formik.handleChange}
                  errors={formik.errors}
                />
              </>
            )}
            <UploadScopeOfWork
              errors={formik.errors}
              setFormData={(file) =>
                formik.setFieldValue('detailedScopeofWork', file)
              }
            />
            <UploadContractorTradeLicense
              errors={formik.errors}
              setFormData={(file) =>
                formik.setFieldValue('contractorTradeLicense', file)
              }
            />
            <UploadEmiratesId
              errors={formik.errors}
              setFormData={(file) => formik.setFieldValue('emiratesId', file)}
            />
            <UploadThirdPartyLiability
              setFormData={(file) =>
                formik.setFieldValue(
                  'thirdPartyLiabilityInsuranceCertificate',
                  file
                )
              }
              errors={formik.errors}
            />
            <CurrentLayoutDrawing
              setFormData={(file) =>
                formik.setFieldValue('CurrentLayoutDrawing', file)
              }
              errors={formik.errors}
            />
            <ProposedLayoutDrawing
              setFormData={(file) =>
                formik.setFieldValue('ProposedLayoutDrawing', file)
              }
              errors={formik.errors}
            />
          </div>

          <TermsAndCondition
            formData={formik.values}
            handleChange={formik.handleChange}
            errors={formik.errors}
          />
          <div className="flex justify-end">
            <SubmitButton isFormValid={formik.isValid} loading={loading} />
          </div>
        </form>
      )}
      {!show && (
        <h1 className="text-center text-xl font-bold text-black">
          Form Already Submitted
        </h1>
      )}
    </>
  );
};
export default ExternalSubmissionForm;
