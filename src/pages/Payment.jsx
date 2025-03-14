import styles from "@styles/payment.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeTwoTone, CreditCardTwoTone } from "@mui/icons-material";
import Alert from "../components/Alert";

export default function Payment() {
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderIdFromUrl = queryParams.get("orderId");
    setOrderId(orderIdFromUrl);
  }, [location]);

  useEffect(() => {
    setAlertMessage(
      "This is an exercice website which doesn't really sell products. If you click on Payment, you can go to Stripe platform but don't use real credit card number. You can use this test credit card number 4242 4242 4242 4242 to complete a fake payment."
    );

    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const res = await fetch(`https://my-80store-backend.vercel.app/orders/${orderId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
          setCustomerInfo(data.customerInfo);
        } else {
          console.error("Error fetching order:", await res.json());
        }
      } catch (error) {
        console.error("Error getting order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCheckout = async () => {
    if (!orderId) return;

    try {
      const res = await fetch("https://my-80store-backend.vercel.app/payments/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.id) {
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        stripe.redirectToCheckout({ sessionId: data.id }).then((result) => {
          if (result.error) {
            console.error("Error during checkout:", result.error);
          }
        });
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.title}>My Payment</p>
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
        <div className={styles.userContainer}>
          <p className={styles.sectionTitle}>User details</p>
          {customerInfo ? (
            <>
              <p>{customerInfo.name}</p>
              <p>{customerInfo.address.street}</p>
              <p>
                {customerInfo.address.city}, {customerInfo.address.postalCode}
              </p>
              <p>{customerInfo.address.country}</p>
            </>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>
        <div className={styles.line}></div>
        <div className={styles.validateContainer}>
          <button className={`btn ${styles.validateBtn}`} onClick={() => navigate("/order")}>
            <HomeTwoTone style={{ fontSize: 22 }} />
            Go back to order
          </button>
          <button className={`btn ${styles.validateBtn}`} onClick={handleCheckout}>
            <CreditCardTwoTone style={{ fontSize: 22 }} />
            Go to Payment
          </button>
        </div>
      </div>
      {alertMessage && <Alert title="Alert" onClose={() => setAlertMessage("")} content={alertMessage} color="red" />}
    </div>
  );
}
