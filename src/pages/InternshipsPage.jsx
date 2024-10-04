import React from "react";
import InternshipListings from "../components/internshipsListing/InternshipListings";
import JobsListingNavbar from "../components/Navbars/JobListingNavbar";

const InternshipsPage = () => {
  return (
    <>
      <JobsListingNavbar />
      {/* <InternshipListings /> */}
      <InternshipListings />
      
    </>
  );
};
export default InternshipsPage;
