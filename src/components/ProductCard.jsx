import styles from "../styles/ProductCard.module.css";
import PropTypes from "prop-types";
import { useState } from "react";

export default function ProductCard({ imageUrls, name, brand, description, price }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const limitedDescription = description && description.length > 110 ? description.slice(0, 110) + "..." : description;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.container}>
      <button className={styles.btnPrev} onClick={handlePrev}>
        &lt;
      </button>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={imageUrls[currentIndex]} alt={`${name} pic`} />
      </div>
      <button className={styles.btnNext} onClick={handleNext}>
        &gt;
      </button>
      <div className={styles.infos}>
        <p className={styles.name}>{name}</p>
        <p className={styles.brand}>{brand}</p>
        <p className={styles.description}>{limitedDescription}</p>
        <p className={styles.price}>Price: {price}€</p>
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
};
