import styles from "../styles/Alert.module.css";
import PropTypes from "prop-types";

export default function Alert({ title, onClose, content }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.main}>
        <div className={styles.title}>
          <span>{title}</span>
          <div className="btn closeBtn" onClick={onClose}>
            X
          </div>
        </div>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
}

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  content: PropTypes.string.isRequired,
};
