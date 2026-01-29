import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@styles/cart.module.css";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import ConfirmationModal from "../components/ConfirmationModal";
import { DeleteTwoTone, DeleteForeverTwoTone, ShoppingCartCheckoutTwoTone } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateCart, clearCart } from "../store/userReducer";

export default function Cart() {
  const [productsList, setProductsList] = useState({ items: [] });
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("https://my-80store-backend.vercel.app/api/carts/", {
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
    if (user.publicId) {
      fetchCart();
    } else {
      navigate("/");
    }
  }, [updateTrigger, user.publicId, navigate]);

  const handleUpdateQuantity = async (slug, newQuantity) => {
    try {
      const res = await fetch("https://my-80store-backend.vercel.app/api/carts/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, quantity: newQuantity }),
      });
      if (res.ok) {
        const updatedCart = await res.json();
        dispatch(updateCart(updatedCart.cart));
        setUpdateTrigger((prev) => !prev);
      }
      if (res.status === 404) {
        const data = await res.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleRemoveItem = async (slug) => {
    try {
      const res = await fetch(`https://my-80store-backend.vercel.app/api/carts/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        if (!data.cart || data.cart.items.length === 0) {
          dispatch(clearCart());
        } else {
          dispatch(updateCart(data.cart));
        }
        setUpdateTrigger((prev) => !prev);
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleEmptyCart = async () => {
    try {
      const res = await fetch("https://my-80store-backend.vercel.app/api/carts/", {
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
        <p className={styles.title}>My Cart</p>
        {productsList.items?.length > 0 ? (
          productsList.items.map((item, i) => (
            <div key={i} className={styles.itemContainer}>
              <Link to={`/product/${item.product.slug}`} className={styles.item}>
                <div className={styles.imgContainer}>
                  <img className={styles.img} src={item.product.imageUrls[0]} alt={item.product.name} />
                </div>
                <div className={styles.textContainer}>
                  <div>
                    <p className={styles.name}>{item.product.name}</p>
                    <p className={styles.brand}>{item.product.brand}</p>
                  </div>
                  <div>
                    <p className={styles.price}>
                      <span className={styles.priceSpan}>Price:</span>
                      {item.product.price}€
                    </p>
                  </div>
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
                  <p className={styles.quantityText}>{item.quantity}</p>
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
                    <DeleteTwoTone style={{ fontSize: 18, color: "red" }} />
                  </button>
                </div>
                <div className={styles.priceContainer}>
                  <p className={styles.price}>
                    <span className={styles.priceSpan}>Total price:</span>
                    {item.product.price * item.quantity}€
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Votre panier est vide</p>
        )}
        {!(productsList.items.length === 0) && (
          <div className={styles.totalContainer}>
            <p className={styles.price}>
              <span className={styles.priceSpan}>Total cart:</span>
              {productsList.totalPrice}€
            </p>
            <div className={styles.btnContainer}>
              <button className={`btn ${styles.checkoutBtn}`} onClick={() => navigate("/order")}>
                <ShoppingCartCheckoutTwoTone style={{ fontSize: 22 }} />
                Got to order
              </button>
              <button
                className={`btn ${styles.emptyBtn}`}
                onClick={() => setConfirmationMessage("Are you sure to empty your cart?")}
              >
                <DeleteForeverTwoTone style={{ color: "red", fontSize: 18 }} />
                Empty cart
              </button>
            </div>
          </div>
        )}
      </div>
      {message && (
        <Alert title="Info" onClose={() => setMessage("")} content={message} color="var(--dark-blue)" autoClose />
      )}
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
