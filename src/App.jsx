import RegisterPage from "./pages/RegisterPage";
import LandingPageUniEdge from "./pages/LandingPageUniEdge";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import ServicesPage from "./pages/ServicesPage";
import InternshipsPage from "./pages/InternshipsPage";
import StudentHomePage from "./pages/StudentHomePage";
import RecruiterHomePage from "./pages/RecruiterHomePage";
import StudentProfilePage from "./pages/StudentProfilePage";
import LandingPage from "./pages/LandingPage";
import VolunteerPage from "./pages/VolunteerPage";

function App() {
  return (
    
      <div>
        <Router basename={process.env.PUBLIC_URL}>
          <AuthProvider>
            <Routes>
              <Route  path="/" element={<LandingPage/>} />
              <Route  path="/uniedge" element={<LandingPageUniEdge/>} />
              <Route  path="/student" element={<StudentHomePage/>} />
              <Route  path="/recruiter" element={<RecruiterHomePage/>} />
              <Route  path="/login" element={<LoginPage/>} />
              <Route  path="/register" element={<RegisterPage/>} />
              <Route  path="/internships" element={<InternshipsPage/>} />
              <Route  path="/services" element={<ServicesPage/>} />
              <Route  path="/studentprofile" element={<StudentProfilePage/>} />
              <Route  path="/volunteer" element={<VolunteerPage/>} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
  )
}

export default App