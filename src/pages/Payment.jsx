import styles from "../styles/payment.module.css";
import { useState, useEffect } from "react";

export default function Payment() {
  const [sessionUrl, setSessionUrl] = useState(null);

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/payments/", {
          method: "POST",
        });
      } catch (error) {
        console.error("Error getting payment:", error);
      }
    };
  });

  return <div className={styles.main}>Payment Page</div>;
}
