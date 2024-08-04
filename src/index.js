import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Adjust the path as necessary
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/nucleo-icons.css';
import './assets/css/blk-design-system-react.css';
import './assets/css/app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      {/* Wrap App with AuthProvider at the root level */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
