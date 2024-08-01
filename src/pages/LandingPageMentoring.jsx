import React from "react";
import IndexNavbar from "../components/Navbars/IndexNavbar";
import MentoringHome from "../components/MentoringHome.jsx"

const LandingPageMentoring = () => {
  React.useEffect(() => {
    document.body.classList.toggle("index-page");
    return function cleanup() {
      document.body.classList.toggle("index-page");
    };
  }, []);

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <MentoringHome />
        <div className="main"></div>
      </div>
    </>
  );
};
export default LandingPageMentoring;