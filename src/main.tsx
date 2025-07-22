import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import './simple-datatables.css';
import store from './redux/store';
import { Provider } from 'react-redux';
import { loginSuccess, logout } from './redux/slices/authSlice';

const storedAccess = localStorage.getItem('access');
const storedRefresh = localStorage.getItem('refresh');
const isAuthenticated = !!storedAccess; // Check if the access token is present
  
if (isAuthenticated) {
  store.dispatch(loginSuccess({ access: storedAccess, refresh: storedRefresh }));
} else {
  store.dispatch(logout()); // Set the initial state to logout if no access token is present
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

    <Provider store={store}>
    <Router>
      <App/>
    </Router>
    </Provider>
 
);
