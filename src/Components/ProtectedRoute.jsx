import { useNavigate } from "react-router-dom";
import React,{ useEffect } from "react";
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token =  localStorage.getItem('golden-beit-dashboard-token');
  useEffect(() => {
    if (!token) {
      navigate('/login', {replace: true});
    }
  }, [token, navigate]);
  return token ? children : console.log("Login Failed") 
};
export default ProtectedRoute;
