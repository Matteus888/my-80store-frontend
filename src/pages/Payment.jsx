import styles from "../styles/payment.module.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Payment() {
  const [sessionId, setSessionId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderIdFromUrl = queryParams.get("orderId");
    setOrderId(orderIdFromUrl);
  }, [location]);

  useEffect(() => {
    const createCheckoutSession = async () => {
      if (!orderId) return;

      try {
        const res = await fetch("http://localhost:3000/payments/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (data.id) {
          setSessionId(data.id);
        }
      } catch (error) {
        console.error("Error getting payment:", error);
      }
    };

    createCheckoutSession();
  }, [orderId]);

  const handleCheckout = () => {
    if (sessionId) {
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      stripe.redirectToCheckout({ sessionId }).then((result) => {
        if (result.error) {
          console.error("Error during checkout:", result.error);
        }
      });
    }
  };

  return (
    <div className={styles.main}>
      <h2>Payment Page</h2>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}
