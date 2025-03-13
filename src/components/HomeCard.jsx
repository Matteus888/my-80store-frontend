import styles from "../styles/homeCard.module.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LoopTwoTone } from "@mui/icons-material";

export default function HomeCard({ category, products }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  if (!products || products.length === 0) {
    return (
      <div className={`${styles.card} ${styles.loading}`}>
        <LoopTwoTone style={{ fontSize: 50 }} />
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div className={styles.card}>
      <p className={styles.category}>{category}</p>
      <div className={styles.productSection}>
        <div className={styles.paginationContainer}>
          <button className={`btn ${styles.paginationBtn}`} onClick={handlePrev}>
            ◀
          </button>
        </div>
        <div className={styles.product}>
          <Link to={`/product/${currentProduct.slug}`}>
            <div className={styles.imgContainer}>
              <img className={styles.img} src={currentProduct.imageUrls[0]} alt={currentProduct.name} />
            </div>
          </Link>
          <div className={styles.productDescription}>
            <Link to={`/product/${currentProduct.slug}`}>
              <p className={styles.name}>{currentProduct.name}</p>
              <p className={styles.brand}>{currentProduct.brand}</p>
              <p className={styles.description}>{currentProduct.description}</p>
              <p className={styles.price}>{currentProduct.price}€</p>
            </Link>
          </div>
        </div>
        <div className={styles.paginationContainer}>
          <button className={`btn ${styles.paginationBtn}`} onClick={handleNext}>
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

HomeCard.propTypes = {
  category: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      brand: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};
