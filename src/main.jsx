import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './css/index.css';
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx';
import { UserDetails } from "./context/UserDetails";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <UserDetails>
        <App />
      </UserDetails>
    </AuthProvider>
  </BrowserRouter>
)
