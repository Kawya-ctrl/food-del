import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      navigate("/"); // fallback redirect
    }
  };

  useEffect(() => {
    if (orderId && success) {
      verifyPayment();
    } else {
      navigate("/"); // no valid query params, redirect
    }
  }, []);

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};



export default Verify;
