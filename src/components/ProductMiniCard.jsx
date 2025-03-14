import styles from "@styles/productMiniCard.module.css";
import PropTypes from "prop-types";

export default function ProductMiniCard({ name, imageUrl, quantity, price }) {
  return (
    <div className={styles.main}>
      <div className={styles.item}>
        <div className={styles.imgContainer}>
          <img className={styles.img} src={imageUrl} alt={name} />
        </div>
        <p className={styles.name}>
          {name.length < 18 ? name : name.slice(0, 18) + "..."} <span className={styles.quantity}>(x{quantity})</span>
        </p>
      </div>
      <p className={styles.price}>{price}€</p>
    </div>
  );
}

ProductMiniCard.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
};
