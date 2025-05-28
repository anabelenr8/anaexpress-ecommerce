import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // CORRECT
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { AddressProvider } from './context/AddressContext';
import { AppProvider } from './context/AppContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AddressProvider>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </AddressProvider>
    </BrowserRouter>
  </React.StrictMode>
);
