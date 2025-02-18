import { useEffect } from "react";
import styles from "../styles/Alert.module.css";
import PropTypes from "prop-types";

export default function Alert({ title, onClose, content, color, autoClose = false }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [onClose, autoClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.main} style={{ border: `3.5px solid ${color}` }}>
        <div className={styles.title} style={{ backgroundColor: `${color}` }}>
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
  onClose: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  autoClose: PropTypes.bool,
};
