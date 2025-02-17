import styles from "../styles/ProductCard.module.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ imageUrls, name, brand, description, price, slug }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState({ left: false, right: false });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  const handleAddToCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, quantity: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
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
          <p className={styles.price}>Price: {price}€</p>
          <button className="btn" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
};
