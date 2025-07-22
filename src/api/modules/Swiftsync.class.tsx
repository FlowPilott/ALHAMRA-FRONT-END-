import axios from '../axiosConfig/Axios';
import endpoints from '../endpoints/ApiEndpoints';
type payload = any; // You can specify a more specific type
interface ApiResponse {
  success: boolean;
  message: string;
}

//login
export const login = async (queryParams) => {
  try {
    const response = await axios.post(
      endpoints.login, // API endpoint
      {}, // Empty body since we are using query params
      {
        params: queryParams, // Pass query parameters here
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // Return actual response data
  } catch (error: any) {
    return { success: false, message: error.message || 'An error occurred' };
  }
};

// Log Out
export const logOut = async (payload: payload): Promise<ApiResponse> => {
  try {
    const response = await axios.post(endpoints.logOut, payload);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};
//change password
export const changePassword = async ( password:string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${endpoints.chnagePassword}?password=${password}`);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// internal form
export const InternalForm = async (payload: payload): Promise<ApiResponse> => {
  try {
    const response = await axios.post(endpoints?.internalForm, payload);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// external form
export const ExternalForm = async (
  id: number,
  payload: payload
): Promise<ApiResponse> => {
  try {
    // Create a new FormData instance
    const formData = new FormData();

    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        formData.append(key, payload[key]);
      }
    }

    // Send the FormData in the POST request
    const response = await axios.post(
      `${endpoints.externalForm}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

//exFormSubmiited
export const exFormSubmitted = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${endpoints.ExFormSubmitted}/${id}`);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

//exCcFormSubmiited
export const exCcFormSubmitted = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${endpoints.exCcFormSubmitted}/${id}`);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};
// get Tasks
export const getTask = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${endpoints.getTask}?userid=${id}`);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// Task Viewed
export const taskViewed = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${endpoints.taskViewed}?taskid=${id}`);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

export const downloadFile = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${endpoints.downloadFile}${id}`);
    return response as ApiResponse;
  } catch (error: any) {
    console.error('Error downloading file:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while downloading the file.',
    } as ApiResponse;
  }
};

export const downloadAll = async (queryParams) => {
  try {
    const response = await axios.get(
      `${endpoints.downloadAll}/${queryParams?.workflowId}/${queryParams?.id}`,
      {
        responseType: 'blob',
      }
    );
    return response as ApiResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while downloading the file.',
    } as ApiResponse;
  }
};

export const downloadInteraction = async (id: number, docname: string) => {
  try {
    const response = await axios.get(
      `${endpoints.downloadInteraction}/${id}/${docname}`
    );
    return response as ApiResponse;
  } catch (error: any) {
    console.error('Error downloading file:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while downloading the file.',
    } as ApiResponse;
  }
};

export const downloadContractorFile = async (id: number, docname: string) => {
  try {
    const response = await axios.get(
      `${endpoints.downloadContractorFile}/${id}/${docname}`
    );
    return response as ApiResponse;
  } catch (error: any) {
    console.error('Error downloading file:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while downloading the file.',
    } as ApiResponse;
  }
};


// get workflow
export const getWorkflow = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${endpoints.getWorkflow}?workflowid=${id}`
    );
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// Create Action
export const createAction = async (
  id: number,
  payload: payload
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${endpoints.createAction}${id}`,
      payload
    );
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// Create RFI
export const createRFI = async (
  id: number,
  payload: payload
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${endpoints.createRFi}${id}`, payload);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// Create Reassign
export const createAssign = async (
  id: number,
  payload: payload
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${endpoints.createReassign}${id}`,
      payload
    );
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};
// Create Return
export const createReturn = async (
  id: number,
  ctaskid:string,
  payload: payload
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${endpoints.createReturn}${id}&ctaskid=${ctaskid}`,
      payload
    );
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// Get Users
export const getUsers = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(endpoints.getUsers);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};
// Get Units
export const getUnits = async ({
  searchTerm,
  page,
  pageSize,
}): Promise<ApiResponse> => {
  try {
    const response = await axios.get(
      `${endpoints.getUnits}?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`
    );
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};
//get interaction data
export const getInteractionList = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(endpoints.getInteractionList);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};
//get interaction data
export const postInteractionList = async (
  name: string
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${endpoints.postInteractionList}/${name}`
    );
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};
// generate interactions report

export const generateReport = async (params: {
  interactionType: string;
  customerName: string;
  unitNumber: string;
  typeOfInteraction: string;
  page: number;
  pageSize: number;
}): Promise<ApiResponse> => {
  try {
    const {
      interactionType,
      customerName,
      unitNumber,
      typeOfInteraction,
      page,
      pageSize,
    } = params;

    const response = await axios.get(
      `${endpoints?.generateReport}?interactionType=${interactionType}&customerName=${customerName}&unitNumber=${unitNumber}&typeOfInteraction=${typeOfInteraction}&page=${page}&pageSize=${pageSize}`
    );

    return response.data as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error.message || 'An error occurred' };
  }
};

//resaleNoc reports

export const generateResaleNocReports = async (params: {
  interactionType: string;
  customerName: string;
  unitNumber: string;
  typeOfInteraction: string;
  page: number;
  pageSize: number;
}): Promise<ApiResponse> => {
  try {
    const {
      interactionType,
      customerName,
      unitNumber,
      typeOfInteraction,
      page,
      pageSize,
    } = params;

    const response = await axios.get(
      `${endpoints?.generateResaleNoc}?interactionType=${interactionType}&customername=${customerName}&unitno=${unitNumber}&typeOfInteraction=${typeOfInteraction}&page=${page}&pageSize=${pageSize}`
    );

    return response.data as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error.message || 'An error occurred' };
  }
};

//post Contractor registration email
export const postEmailToContractor = async (
  email: string
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(
      `${endpoints.postEmailToContractor}/${email}`
    );
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

//post resale
export const createResaleNoc = async (
  payload: payload
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(endpoints.createResaleNoc, payload);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error };
  }
};

// post contractor registration form
export const postContractorRegistrationEmail = async (
  payload: payload,
  id: number
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${endpoints.postContractorRegistrationEmail}/${id}`,
      payload
    );
    return response as ApiResponse;
  } catch (error: any) {
    return { success: false, message: error };
  }
};

// get contractor list
export const getContractorList = async (params: {
  page: number;
  pageSize: number;
  searchTerm: string;
}): Promise<ApiResponse> => {
  try {
    const { page, pageSize, searchTerm } = params;

    const response = await axios.get(
      `${endpoints?.getContractorList}?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm} `
    );

    return response.data as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error.message || 'An error occurred' };
  }
};

// get contractor list
export const postBpNumber = async (id: number, newBpNumber: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${endpoints?.postBpNumber}/${id}/${newBpNumber}`,);
    return response.data as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error.message || 'An error occurred' };
  }
};

//get contracting comp name
export const getContractingCompName = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(endpoints.getContractingCompName);
    return response as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access');
      window.location.href = '/signin';
    }
    return { success: false, message: error.message || 'An error occurred' };
  }
};
// open a ticket
export const ticket = async (email: string, payload: any): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("customername", payload.name);
    formData.append("subject", payload.subject);
    formData.append("issue", payload.issue);
    formData.append("email", email);

    if (payload.file) {
      formData.append("attachmentFile", payload.file);
    }

    const response = await axios.post(`${endpoints?.ticket}/${email}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data as ApiResponse;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access");
      window.location.href = "/signin";
    }
    return { success: false, message: error.message || "An error occurred" };
  }
};