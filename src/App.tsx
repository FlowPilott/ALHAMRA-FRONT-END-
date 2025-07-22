import { lazy, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import TaskManagement from './components/Task Management/TaskManagement';
import InternalSubmissionForm from './components/Interaction Form/InternalSubmissionForm.tsx';
import ExternalSubmissionForm from './components/Interaction Form/ExternalSubmissionForm';
import WorkflowSystem from './components/workflow system/WorkflowSystem';
import Login from './pages/Authentication/SignIn';
import Reports from './components/Reports/Reports.tsx';
import ContractorForm from './components/contractoRegistration/ContractorRegistrationForm.tsx';
import ResaleForm from './components/contractoRegistration/ResaleNOC.tsx';
import ContractorList from './components/contractorList/ContractorList.tsx';
import ContactUs from './components/ContactUs.tsx';
import { AppDispatch } from './redux/store.ts';
import { fetchActiveTasksCount } from './redux/slices/taskSlice.ts';
import ChangePassword from './components/ChangePassword.tsx';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const user = localStorage.getItem('user-name');
  const requiresPasswordChange = localStorage.getItem('requiresPasswordChange') === 'true';

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchActiveTasksCount());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        {isAuthenticated ? (
          <>
            {/* Force password change if required */}
            {requiresPasswordChange ? (
              <Route
                path="/change-password"
                element={
                  <>
                    <PageTitle title="Change Password" />
                    <ChangePassword />
                  </>
                }
              />
            ) : (
              <>
                <Route
                  path="/Interaction/form"
                  element={
                    !(user === 'dilin' || user === 'abubaker') ? (
                      <>
                        <PageTitle title="Interaction Form" />
                        <InternalSubmissionForm />
                      </>
                    ) : (
                      <Navigate to="/TaskManagement" replace />
                    )
                  }
                />

                <Route
                  path="/change-password"
                  element={
                    <>
                      <PageTitle title="Change Password" />
                      <ChangePassword />
                    </>
                  }
                />
                <Route
                  path="/TaskManagement"
                  element={
                    <>
                      <PageTitle title="Task Management" />
                      <TaskManagement />
                    </>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <>
                      <PageTitle title="Reports" />
                      <Reports />
                    </>
                  }
                />
                <Route
                  path="/contractorList"
                  element={
                    <>
                      <PageTitle title="Contractor List" />
                      <ContractorList />
                    </>
                  }
                />
                <Route
                  path="/ticket"
                  element={
                    <>
                      <PageTitle title="Contact Us" />
                      <ContactUs />
                    </>
                  }
                />
                <Route
                  path="/workflow/system/:id"
                  element={
                    <>
                      <PageTitle title="Workflow System" />
                      <WorkflowSystem />
                    </>
                  }
                />
              </>
            )}
            {/* Redirect to change password if required */}
            {requiresPasswordChange && (
              <Route path="*" element={<Navigate to="/change-password" replace />} />
            )}
          </>
        ) : (
          <>
            <Route
              path="/resaleNoc"
              element={
                <>
                  <PageTitle title="Resale NOC" />
                  <ResaleForm />
                </>
              }
            />
            <Route
              path="/Interaction/form/ExternalSubmissionForm/:id"
              element={
                <>
                  <PageTitle title="External Submission Form" />
                  <ExternalSubmissionForm />
                </>
              }
            />
            <Route
              path="/Interaction/form/ContractorRegistration/:id"
              element={
                <>
                  <PageTitle title="Contractor Registration Form" />
                  <ContractorForm />
                </>
              }
            />
            
            <Route
              path="/signin"
              element={
                <>
                  <PageTitle title="Signin" />
                  <Login />
                </>
              }
            />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        )}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              requiresPasswordChange ? (
                <Navigate to="/change-password" replace />
              ) : (
                <Navigate to="/TaskManagement" replace />
              )
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Route>
    </Routes>
  );
}

export default App;