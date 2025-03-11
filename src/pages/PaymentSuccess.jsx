import styles from "../styles/paymentSuccess.module.css";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/userReducer";
import { ShoppingBagTwoTone } from "@mui/icons-material";

export default function PaymentSuccess() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const hasFetched = useRef(false);
  const navigate = useNavigate();
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
            setOrder(data.order);
            setLoading(false);
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
    <div className={styles.main}>
      <div className={styles.container}>
        {paymentStatus === "success" && <p className={styles.title}>Payment Successful!</p>}
        {paymentStatus === "failed" && <p className={styles.title}>Payment Failed.</p>}
        {errorMessage && <p>{errorMessage}</p>}
        <div className={styles.orderContainer}>
          <p className={styles.sectionTitle}>Order details</p>
          {loading ? (
            <p>Loading order...</p>
          ) : order ? (
            <>
              {order.items?.length > 0 ? (
                order.items.map((item, i) => (
                  <div key={`${item.product._id}-${i}`} className={styles.item}>
                    <p>
                      {item.product.name} <span className={styles.brand}>{item.product.brand}</span>
                    </p>
                    <p>
                      {item.quantity} x {item.product.price}€
                    </p>
                  </div>
                ))
              ) : (
                <p>Order empty</p>
              )}
              <p className={styles.totalPrice}>
                <span>Total:</span> {order.totalPrice}€
              </p>
            </>
          ) : (
            <p>Order not found</p>
          )}
        </div>
        <button className={`btn ${styles.validateBtn}`} onClick={() => navigate("/products")}>
          <ShoppingBagTwoTone style={{ fontSize: 22 }} />
          Continue shopping
        </button>
      </div>
    </div>
  );
}
