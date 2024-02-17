import React from 'react'
import Register from '../components/Register'
import { AuthProvider } from '../context/AuthContext'
import IndexNavbar from '../components/Navbars/IndexNavbar'
const RegisterPage = () => {
  return (
    <AuthProvider>
      <IndexNavbar/>
      <Register/>
    </AuthProvider>  
  )
}
export default RegisterPage; 