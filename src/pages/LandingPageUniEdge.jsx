import React from "react";
import IndexNavbar from "../components/Navbars/IndexNavbar";
import Home from "../components/Home";

const LandingPageUniEdge = () => {
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
        <Home />
        <div className="main"></div>
      </div>
    </>
  );
};
export default LandingPageUniEdge;
