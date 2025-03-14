import styles from "@styles/imageModal.module.css";
import PropTypes from "prop-types";

export default function ImageModal({ productName, imageUrl, onCloseModal }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.title}>
          <span>{productName}</span>
          <div className="btn closeBtn" onClick={onCloseModal}>
            X
          </div>
        </div>
        <div className={styles.imgContainer}>
          <img className={styles.img} src={imageUrl} alt="" />
        </div>
      </div>
    </div>
  );
}

ImageModal.propTypes = {
  productName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
