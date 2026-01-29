import styles from "@styles/purchases.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch("https://my-80store-backend.vercel.app/api/orders/paid", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch purchases");
        }

        const data = await res.json();
        setPurchases(data.orders);
      } catch (error) {
        console.error("Error getting purchases:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const handleReorder = async (orderId) => {
    try {
      const res = await fetch("https://my-80store-backend.vercel.app/api/carts/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        navigate("/cart");
      } else {
        console.error("Failed to reorder items.");
      }
    } catch (error) {
      console.error("Error during reorder:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.title}>My Purchases</p>
        {purchases.length === 0 ? (
          <p>You have no past orders.</p>
        ) : (
          <>
            {purchases.map((purchase) => (
              <div key={purchase._id} className={styles.purchase}>
                <p className={styles.purchaseId}>Order ID: {purchase._id}</p>
                <p className={styles.purchaseDate}>
                  Purchased on {format(new Date(purchase.updatedAt), "EEEE dd MMMM yyyy 'at' h:mm a")}
                </p>
                {purchase.items.map((item) => (
                  <div key={item.product._id} className={styles.item}>
                    <p>
                      {item.quantity} x {item.product.name} <span className={styles.brand}>{item.product.brand}</span>
                    </p>
                  </div>
                ))}
                <p className={styles.totalPrice}>
                  <span>Total:</span> {purchase.totalPrice}€
                </p>
                <button className={`btn ${styles.reorderBtn}`} onClick={() => handleReorder(purchase._id)}>
                  Reorder
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
