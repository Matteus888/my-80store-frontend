import styles from "@styles/confirmationModal.module.css";
import PropTypes from "prop-types";

export default function ConfirmationModal({ title, content, btnTxt, onPressBtn, onCloseModal }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.title}>
          <span>{title}</span>
          <div className="btn closeBtn" onClick={onCloseModal}>
            X
          </div>
        </div>
        <div className={styles.content}>{content}</div>
        <div className={styles.btnContainer}>
          <button className={`btn ${styles.yesBtn}`} onClick={onPressBtn}>
            {btnTxt}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  btnTxt: PropTypes.string.isRequired,
  onPressBtn: PropTypes.func,
  onCloseModal: PropTypes.func,
};
