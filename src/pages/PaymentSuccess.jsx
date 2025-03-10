import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const hasFetched = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyPaymentStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get("session_id");

      if (sessionId) {
        console.log("Fetching payment verification for session:", sessionId);

        // Vérifier la session Stripe pour obtenir son statut
        try {
          const res = await fetch(`http://localhost:3000/payments/verify-session/${sessionId}`, {
            method: "GET",
            credentials: "include",
          });

          const data = await res.json();

          if (data.status === "paid") {
            setPaymentStatus("success");
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
  }, [location]);

  return (
    <div>
      {paymentStatus === "success" && <p>Payment Successful!</p>}
      {paymentStatus === "failed" && <p>Payment Failed.</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
