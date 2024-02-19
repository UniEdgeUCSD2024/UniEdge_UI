import React from "react";
import InternshipListings from "../components/InternshipListings";
import StudentNavbar from "../components/Navbars/StudentNavbar";

const InternshipsPage = () => {
  return (
    <>
      <StudentNavbar />
      <InternshipListings />
    </>
  );
};
export default InternshipsPage;
