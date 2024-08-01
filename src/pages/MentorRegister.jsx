import React from 'react'
import MentorRegister from '../components/MentorRegister'
import { AuthProvider } from '../context/AuthContext'
import IndexNavbar from '../components/Navbars/IndexNavbar'
const MentorRegisterPage = () => {
  return (
    <AuthProvider>
      <IndexNavbar/>
      <MentorRegister/>
    </AuthProvider>  
  )
}
export default MentorRegisterPage; 