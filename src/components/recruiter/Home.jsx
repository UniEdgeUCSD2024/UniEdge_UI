import React, { useContext, useRef, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../../context/AuthContext";


export default function StudentHome() {
  const navigate = useNavigate();
  const { userKeys } = useContext(AuthContext);


  return (
 <p> The Recruiter version is being developed ..!!</p>
  );
}
