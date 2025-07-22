export interface ApiEndpoints {
  signUp: string;
  login: string;
  chnagePassword: string;
  internalForm: string;
  externalForm: string;
  getTask: string;
  getWorkflow: string;
  createAction: string;
  createRFi: string;
  createReassign: string;
  createReturn: string;
  getUsers: string;
  getUnits: string;
  ExFormSubmitted: string;
  taskViewed: string;
  downloadFile:string;
  downloadAll:string;
  downloadInteraction:string;
  getInteractionList:string;
  postInteractionList:string;
  generateReport:string;
  generateResaleNoc:string
  postEmailToContractor:string;
  createResaleNoc:string;
  postContractorRegistrationEmail:string;
  getContractorList:string;
  postBpNumber:string;
  exCcFormSubmitted:string;
  downloadContractorFile:string;
  getContractingCompName:string;
  ticket:string;
}

const endpoints: ApiEndpoints = {
  signUp: 'user/register/',
  login: 'Securrity/Login/',
  chnagePassword: 'Securrity/ChangePassword',
  internalForm: 'Forms/create',
  externalForm: 'Forms/SubmitExternalForm',
  getTask:'/Workflow/GetTaks',
  getWorkflow:'/Workflow/GetWorkFlow',
  createAction: '/Workflow/CreateWorkFlowStepAction?WorkflowStepId=',
  createRFi: '/Workflow/CreateWorkFlowStepActionRFI?WorkflowStepId=',
  createReassign:'/Workflow/CreateWorkFlowStepActionReassign?WorkflowStepId=',
  createReturn:'/Workflow/ReturnWorkFlowStepAction?WorkflowStepId=',
  getUsers:'/Workflow/GetUsers',
  getUnits:'/Setup/units',
  ExFormSubmitted:"/Forms/ExFormSubmitted",
  taskViewed:'Workflow/TaskViewed',
  downloadFile:"/Workflow/download/",
  downloadAll:"/Workflow/downloadall",
  downloadInteraction:"/Workflow/downloadinteractionfile",
  getInteractionList:"/Setup/GetInteractionTypes",
  postInteractionList:"/Setup/AddInteractionType",
  generateReport:"/Report/interactions",
  generateResaleNoc:"/Report/resalenocs",
  postEmailToContractor:"/Forms/SendContractorRegistrationEmail",
  createResaleNoc:"/Forms/CreateResaleNoc",
  postContractorRegistrationEmail:"/Forms/ContractorRegistration",
  getContractorList:"/Setup/contractors",
  postBpNumber:"/Setup/UpdateContractorBpNumber",
  exCcFormSubmitted:"/Forms/ExCcFormSubmitted",
  downloadContractorFile:"/Workflow/DownloadContractorFile",
  getContractingCompName:'/Setup/GetAllContractors',
  ticket:'/Forms/SendServiceRequestEmailAsync'
};


export default endpoints;
