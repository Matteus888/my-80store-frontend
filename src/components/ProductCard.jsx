import styles from "@styles/productCard.module.css";
import PropTypes from "prop-types";
import Alert from "./Alert";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AddShoppingCartTwoTone } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../store/userReducer";

export default function ProductCard({ imageUrls, name, brand, description, price, slug }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState({ left: false, right: false });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  const handleAddToCart = async () => {
    if (user.publicId) {
      try {
        const res = await fetch("https://my-80store-backend.vercel.app/api/carts/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ slug, quantity: 1 }),
        });
        const data = await res.json();
        if (res.status === 200) {
          setMessage(data.message);
          dispatch(updateCart({ items: data.cart.items, totalPrice: data.cart.totalPrice }));
        } else {
          setErrorMessage(data.message);
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      setErrorMessage("You need to be connected to add product in cart.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <div
          className={styles.leftSide}
          onClick={handlePrev}
          onMouseEnter={() => setIsHovered((prev) => ({ ...prev, left: true }))}
          onMouseLeave={() => setIsHovered((prev) => ({ ...prev, left: false }))}
        >
          {isHovered.left && <span className={styles.arrowLeft}>&lt;</span>}
        </div>
        <img className={styles.img} src={imageUrls[currentIndex]} alt={`${name} pic`} />
        <div
          className={styles.rightSide}
          onClick={handleNext}
          onMouseEnter={() => setIsHovered((prev) => ({ ...prev, right: true }))}
          onMouseLeave={() => setIsHovered((prev) => ({ ...prev, right: false }))}
        >
          {isHovered.right && <span className={styles.arrowRight}>&gt;</span>}
        </div>
      </div>
      <div className={styles.infos}>
        <Link to={`/product/${slug}`}>
          <p className={styles.name}>{name}</p>
          <p className={styles.brand}>{brand}</p>
          <p className={styles.description}>{description}</p>
        </Link>
        <div className={styles.addToCartContainer}>
          <p className={styles.price}>
            <span className={styles.priceSpan}>Price:</span> {price}€
          </p>
          {!isAdmin && (
            <button className={`btn ${styles.addBtn}`} onClick={handleAddToCart}>
              <AddShoppingCartTwoTone style={{ fontSize: 22 }} />
            </button>
          )}
        </div>
      </div>
      {message && (
        <Alert title="Info" onClose={() => setMessage("")} content={message} color="var(--dark-blue)" autoClose />
      )}
      {errorMessage && <Alert title="Alert" onClose={() => setErrorMessage("")} content={errorMessage} color="red" />}
    </div>
  );
}

ProductCard.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
};
