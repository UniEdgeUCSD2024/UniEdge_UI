import React from "react";
import StudentProfile from "../components/student/StudentProfile";
import StudentProfileNavbar from "../components/Navbars/StudentProfileNavbar";


const StudentProfilePage = () => {
    return (
        <>  
            <StudentProfileNavbar />
            <StudentProfile />
        </>
    );
};
export default StudentProfilePage;
