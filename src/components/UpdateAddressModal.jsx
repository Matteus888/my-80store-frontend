import styles from "../styles/updateAddressModal.module.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function UpdateAddressModal({ title, onCloseModal, btnTxt, onPressBtn, address }) {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (address) {
      setStreet(address.street || "");
      setCity(address.city || "");
      setPostalCode(address.postalCode || "");
      setCountry(address.country || "");
    }
  }, [address]);

  const handleConfirm = () => {
    onPressBtn({ street, city, postalCode, country });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.title}>
          <span>{title}</span>
          <div className="btn closeBtn" onClick={onCloseModal}>
            X
          </div>
        </div>
        <div className={styles.content}>
          <p>Street:</p>
          <input className={styles.input} type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
          <p>City:</p>
          <input className={styles.input} type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          <p>Postal Code:</p>
          <input className={styles.input} type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          <p>Country:</p>
          <input className={styles.input} type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div className={styles.btnContainer}>
          <button className={`btn ${styles.confirmBtn}`} onClick={handleConfirm}>
            {btnTxt}
          </button>
        </div>
      </div>
    </div>
  );
}

UpdateAddressModal.propTypes = {
  title: PropTypes.string.isRequired,
  btnTxt: PropTypes.string.isRequired,
  onPressBtn: PropTypes.func,
  onCloseModal: PropTypes.func,
  address: PropTypes.object,
};
