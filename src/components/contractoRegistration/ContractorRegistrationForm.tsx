import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import CompanyInformation from './CompanyInfo';
import VehicleInformation from './VehicleInfo';
import Spinner from '../../common/Spinner';
import CompanyTradeLicense from './filesUpload/CompanyTradeLicense';
import PassportVisa from './filesUpload/PassportVisa';
import StampedAuthorization from './filesUpload/StampedAuthorization';
import VehicleRegistration from './filesUpload/VehicleRegistration';
import ManagerPassport from './filesUpload/ManagerPassport';
import BrandedVehicle from './filesUpload/BrandedVehicle';
import { exCcFormSubmitted, postContractorRegistrationEmail } from '../../api/modules/Swiftsync.class';
import { useParams, useSearchParams } from 'react-router-dom';
import Toaster from '../Toast/Toast';
import PreviousPermit from './filesUpload/PreviousPermit';

interface ApiResponse {
  data?: {
    companyName?: string;
  };
  status?: number;
}

type FormData = {
  companyName: string;
  name: string;
  address: string;
  email: string;
  landlineNo: string;
  contact: string;
  mobile: string;
  paymentOption: string;
  applicationType: string;
  plateNumber: string;
  plateType: string;
  placeOfIssuance: string;
  typeOfVehicle: string;
  color: string;
  previousPermit: string;
  type: any;
  companyTradeLicense: string;
  passportVisa: string;
  stampedAuthorization: string;
  vehicleRegistration: string;
  brandedVehicle: string;
  managerPassport: string;
};

type FormErrors = {
  [K in keyof FormData]: string;
};

type TouchedFields = {
  [K in keyof FormData]: boolean;
};

export default function ContractorForm() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const id = typeParam || 'renew';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    name: '',
    address: '',
    landlineNo: '',
    contact: '',
    mobile: '',
    email: '',
    applicationType: 'renew',
    paymentOption: 'monthly',
    plateNumber: '',
    plateType: '',
    placeOfIssuance: '',
    typeOfVehicle: '',
    color: '',
    previousPermit: '',
    type: id,
    companyTradeLicense: '',
    passportVisa: '',
    stampedAuthorization: '',
    vehicleRegistration: '',
    brandedVehicle: '',
    managerPassport: '',
  });

  useEffect(() => {
    setFormData(prevData => ({ ...prevData, applicationType: id }));
  }, [id]);

  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({} as TouchedFields);
  const [message, setMessage] = useState({});
  const params = useParams();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await exCcFormSubmitted(Number(params?.id || 0))
        setFormData((prevData) => ({
          ...prevData,
          paymentOption: response?.data?.paymentoption || "",
          email: response?.data?.email || "", // Add this line to set the email
        }))

        if (response?.data?.companyName) {
          setMessage({ success: "Form Already Submitted" })
          setShow(false)
        } else {
          setShow(true)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params?.id])

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'companyName':
        return value.trim() === '' ? 'Company name is required' : '';
      case 'address':
        return value.trim() === '' ? 'Address is required' : '';
      case 'email':
        return value.trim() === '' ? 'Email is required' : 
               !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email address' : '';
      case 'landlineNo':
        return value === '' ? 'Landline number is required' : 
               value === 'invalid' ? 'Invalid landline number' : '';
      case 'mobile':
        return value === '' ? 'Mobile number is required' : 
               value === 'invalid' ? 'Invalid mobile number' : '';
      case 'plateNumber':
        return value.trim() === '' ? 'Plate number is required' : '';
      case 'plateType':
        return value.trim() === '' ? 'Plate type is required' : '';
      case 'placeOfIssuance':
        return value.trim() === '' ? 'Place of issuance is required' : '';
      case 'typeOfVehicle':
        return value.trim() === '' ? 'Vehicle type is required' : '';
      case 'color':
        return value.trim() === '' ? 'Vehicle color is required' : '';
      case 'companyTradeLicense':
        return value.trim() === '' ? 'Company Trade License is required' : '';
      case 'passportVisa':
        return value.trim() === '' ? 'Passport Visa is required' : '';
      case 'stampedAuthorization':
        return value.trim() === '' ? 'Stamped Authorization is required' : '';
      case 'vehicleRegistration':
        return value.trim() === '' ? 'Vehicle Registration is required' : '';
      case 'brandedVehicle':
        return value.trim() === '' ? 'Branded Vehicle is required' : '';
      case 'managerPassport':
        return value.trim() === '' ? 'Manager Passport is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name as keyof FormData, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleBlur = (fieldName: keyof FormData) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    const error = validateField(fieldName, formData[fieldName]?.toString() || '');
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const isFormValid = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      'companyName',
      'address',
      'email',
      'landlineNo',
      'mobile',
      'plateNumber',
      'plateType',
      'placeOfIssuance',
      'typeOfVehicle',
      'color',
      'companyTradeLicense',
      'passportVisa',
      'stampedAuthorization',
      'vehicleRegistration',
      'managerPassport'
    ];

    return requiredFields.every(field => {
      const value = formData[field]?.toString() || '';
      return value.trim() !== '' && !errors[field];
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    // Create a new object without the "error" key and Error instances
    const cleanFormData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key, value]) => key !== "errors" && !(value instanceof Error))
    );
  
    const formDataObj = new FormData();
    Object.entries(cleanFormData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });
  
    try {
      const res = await postContractorRegistrationEmail(formDataObj, Number(params?.id));
      if (res?.status === 200) {
        setMessage({ success: 'Form submitted successfully!' });
        setTimeout(() => {
          window.location.href = 'https://alhamra.ae/';
        }, 3000);
      }
    } catch (error) {
      setMessage({ error: 'Failed to submit form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster message={message} />
      {show ? (
      <div className="mx-auto ml-12 max-w-3xl bg-white p-6 shadow-md md:ml-auto">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-xl font-semibold text-[#1a1a1a]">Contractor Registration Form</h1>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="mb-1 block text-sm font-normal text-[#111827]">Type of Application</label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="applicationType"
                    value="renew"
                    checked={formData.applicationType === 'renew'}
                    onChange={handleChange}
                    disabled={id === 'new'}
                    className="h-5 w-5 border border-[#e5e5e5] accent-[#B2282F]"
                  />
                  <span>Renewal</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="applicationType"
                    value="new"
                    readOnly
                    checked={formData.applicationType === 'new'}
                    disabled={id === 'renew'}
                    className="h-5 w-5 border border-[#e5e5e5] accent-[#B2282F]"
                  />
                  <span>New Registration</span>
                </label>
              </div>
            </div> */}
            {id === 'renew' && (
              <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-[200px_1fr] md:items-center md:gap-4 bg-[#F9F9F9] p-6 shadow-sm">
                <label className="mb-1 block text-sm font-normal text-[#111827]">Payment Option</label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="monthly"
                      checked={formData.paymentOption === 'monthly'}
                      onChange={handleChange}
                      className="h-5 w-5 border border-[#e5e5e5] accent-[#B2282F]"
                    />
                    <span>Monthly</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="yearly"
                      checked={formData.paymentOption === 'yearly'}
                      onChange={handleChange}
                      className="h-5 w-5 border border-[#e5e5e5] accent-[#B2282F]"
                    />
                    <span>Yearly</span>
                  </label>
                </div>
              </div>
            )}
            <CompanyInformation 
              formData={formData} 
              errors={errors} 
              setFormData={setFormData} 
              handleChange={handleChange}
              handleBlur={handleBlur}
              touchedFields={touchedFields}
            />
            <VehicleInformation 
              formData={formData} 
              errors={errors} 
              setErrors={setErrors} 
              handleChange={handleChange}
              handleBlur={handleBlur}
              touchedFields={touchedFields}
              setFormData={setFormData}
            />
            <div className="bg-[#f9fafb] p-6 shadow-sm md:mr-11">
              <div className="mb-6 text-lg font-semibold text-[#111827]">Upload Documents</div>
              <CompanyTradeLicense errors={errors} setFormData={setFormData} />
              <PassportVisa errors={errors} setFormData={setFormData} touched={touchedFields} onBlur={handleBlur} />
              <StampedAuthorization errors={errors} setFormData={setFormData} touched={touchedFields} onBlur={handleBlur} />
              <VehicleRegistration errors={errors} setFormData={setFormData} touched={touchedFields} onBlur={handleBlur} />
              <BrandedVehicle errors={errors} setFormData={setFormData} />
              <ManagerPassport errors={errors} setFormData={setFormData} touched={touchedFields} onBlur={handleBlur} />
              
              {Object.entries(errors).map(([key, error]) => {
                if (key.toLowerCase().includes('file') && error) {
                  return (
                    <p key={key} className="mt-2 text-sm text-red-500">
                      {error}
                    </p>
                  );
                }
                return null;
              })}

              {/* <div className="mt-4 flex items-center gap-3 border-l-4 border-l-[#B2282F] bg-[#FEF2F2] py-3 pl-4">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-[#B2282F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-normal text-[#111827]">
                  Instructing the contractor to visit the cashier with a unique reference number (generated with each form submission) for payment processing.
                </p>
              </div> */}
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className={`mt-5 flex items-center gap-3 px-[12px] py-[10px] font-normal text-white md:mr-10 ${
                  !isFormValid() || loading
                    ? 'cursor-not-allowed bg-[#B2282F] opacity-50'
                    : ' bg-[#a02229]'
                }`}
                disabled={!isFormValid() || loading}
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
        </div>
      </div>
      ) : (
        <div className="mx-auto ml-12 max-w-3xl bg-white p-6 shadow-md md:ml-auto">
          <h1 className="mb-6 text-xl font-semibold text-[#1a1a1a]">Contractor Registration Form</h1>
          <p>Form Already Submitted</p>
        </div>
      )}
    </>
  );
}