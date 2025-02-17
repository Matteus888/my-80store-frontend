import { useEffect, useState } from "react";
import styles from "../styles/Cart.module.css";
import { Link } from "react-router-dom";

export default function Cart() {
  const [productsList, setProductsList] = useState({ items: [] });
  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:3000/carts/", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProductsList(data.cart);
        }
      } catch (error) {
        console.error("Error getting cart:", error);
      }
    };
    fetchCart();
  }, [updateTrigger]);

  const handleUpdateQuantity = async (slug, newQuantity) => {
    try {
      const res = await fetch("http://localhost:3000/carts/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, quantity: newQuantity }),
      });
      if (res.ok) {
        setUpdateTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleRemoveItem = async (slug) => {
    try {
      const res = await fetch(`http://localhost:3000/carts/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        setUpdateTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleEmptyCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/carts/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        setUpdateTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error empty cart:", error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {productsList.items?.length > 0 ? (
          productsList.items.map((item, i) => (
            <div key={i} className={styles.itemContainer}>
              <Link to={`/product/${item.product.slug}`} className={styles.item}>
                <div className={styles.imgContainer}>
                  <img src={item.product.imageUrls[0]} alt={item.product.name} />
                </div>
                <div>
                  <p>{item.product.name}</p>
                  <p>{item.product.brand}</p>
                  <p>{item.product.price}€</p>
                </div>
              </Link>
              <div className={styles.quantitySection}>
                <div className={styles.quantityContainer}>
                  <button onClick={() => handleUpdateQuantity(item.product.slug, item.quantity - 1)} disabled={item.quantity <= 1}>
                    -
                  </button>
                  <p>{item.quantity}</p>
                  <button
                    onClick={() => handleUpdateQuantity(item.product.slug, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <div className={styles.deleteContainer}>
                  <button onClick={() => handleRemoveItem(item.product.slug)}>Delete</button>
                </div>
                <div className={styles.priceContainer}>
                  <p>Total item price: </p>
                  <p>{item.product.price * item.quantity}€</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Votre panier est vide</p>
        )}
        <div>
          <button onClick={handleEmptyCart}>Empty cart</button>
        </div>
      </div>
    </div>
  );
}
