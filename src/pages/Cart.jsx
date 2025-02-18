import { useEffect, useState } from "react";
import styles from "../styles/Cart.module.css";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import ConfirmationModal from "../components/ConfirmationModal";
import { DeleteTwoTone, DeleteForeverTwoTone } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartReducer";

export default function Cart() {
  const [productsList, setProductsList] = useState({ items: [] });
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const dispatch = useDispatch();

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
        dispatch(updateQuantity({ slug, quantity: newQuantity }));
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
      const data = await res.json();
      if (res.status === 200) {
        dispatch(removeFromCart(slug));
        setUpdateTrigger((prev) => !prev);
        setMessage(data.message);
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
        dispatch(clearCart());
        setConfirmationMessage("");
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
                  <button
                    className={`btn ${styles.quantityBtn}`}
                    onClick={() => handleUpdateQuantity(item.product.slug, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <p>{item.quantity}</p>
                  <button
                    className={`btn ${styles.quantityBtn}`}
                    onClick={() => handleUpdateQuantity(item.product.slug, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <div className={styles.deleteContainer}>
                  <button className={`btn ${styles.deleteBtn}`} onClick={() => handleRemoveItem(item.product.slug)}>
                    <DeleteTwoTone style={{ fontSize: 22, color: "red" }} />
                  </button>
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
        {!(productsList.items.length === 0) && (
          <div>
            <button className={`btn ${styles.emptyBtn}`} onClick={() => setConfirmationMessage("Are you sure to empty your cart?")}>
              <DeleteForeverTwoTone style={{ color: "red", fontSize: 22 }} />
              Empty cart
            </button>
          </div>
        )}
      </div>
      {message && <Alert title="Info" onClose={() => setMessage("")} content={message} color="var(--dark-blue)" autoClose />}
      {confirmationMessage && (
        <ConfirmationModal
          title="Confirmation"
          onCloseModal={() => setConfirmationMessage("")}
          content={confirmationMessage}
          btnTxt="Yes"
          onPressBtn={handleEmptyCart}
        />
      )}
    </div>
  );
}
