import styles from "../styles/ProductCard.module.css";
import PropTypes from "prop-types";

export default function ProductCard({ imagePath, name, description, price }) {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={imagePath} alt={`${name} pic`} />
      </div>
      <div className={styles.infos}>
        <p className={styles.name}>{name}</p>
        <p className={styles.description}>{description}</p>
        <p>Price: {price}€</p>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  imagePath: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number.isRequired,
};
