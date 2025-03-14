import styles from "@styles/paymentCancel.module.css";
import { useNavigate } from "react-router-dom";
import { CreditCardTwoTone } from "@mui/icons-material";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.title}>Payment Canceled</p>
        <p>Your payment was canceled. Please try again.</p>
        <button className={`btn ${styles.validateBtn}`} onClick={() => navigate("/order")}>
          <CreditCardTwoTone style={{ fontSize: 22 }} />
          Try again
        </button>
      </div>
    </div>
  );
}
