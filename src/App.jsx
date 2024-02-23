import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage"
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React from "react"
import ServicesPage from "./pages/ServicesPage";
import InternshipsPage from "./pages/InternshipsPage";
import StudentHomePage from "./pages/StudentHomePage";
import RecruiterHomePage from "./pages/RecruiterHomePage";
import StudentProfilePage from "./pages/StudentProfilePage";

function App() {
  return (
    
      <div>
        <Router basename={process.env.PUBLIC_URL}>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<LandingPage/>} />
              <Route exact path="/student" element={<StudentHomePage/>} />
              <Route exact path="/recruiter" element={<RecruiterHomePage/>} />
              <Route exact path="/login" element={<LoginPage/>} />
              <Route exact path="/register" element={<RegisterPage/>} />
              <Route exact path="/internships" element={<InternshipsPage/>} />
              <Route exact path="/services" element={<ServicesPage/>} />
              <Route exact path="/studentprofile" element={<StudentProfilePage/>} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
  )
}

export default App
