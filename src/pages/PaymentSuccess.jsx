import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/userReducer";

export default function PaymentSuccess() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const hasFetched = useRef(false);
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyPaymentStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get("session_id");

      if (sessionId) {
        try {
          const res = await fetch(`http://localhost:3000/payments/verify-session/${sessionId}`, {
            method: "GET",
            credentials: "include",
          });

          const data = await res.json();

          if (data.status === "paid") {
            setPaymentStatus("success");
            dispatch(clearCart());
          } else {
            setPaymentStatus("failed");
          }
        } catch (error) {
          setErrorMessage("There was an error verifying the payment.");
          console.error("Error fetching payment status:", error);
        }
      }
    };

    verifyPaymentStatus();
  }, [location, dispatch]);

  return (
    <div>
      {paymentStatus === "success" && <p>Payment Successful!</p>}
      {paymentStatus === "failed" && <p>Payment Failed.</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
