import styles from "../styles/FilterBar.module.css";
import PropTypes from "prop-types";

export default function FilterSideBar({ onSelectedSort }) {
  const handleSortChange = (e) => {
    onSelectedSort(e.target.value);
  };
  return (
    <div className={styles.sideBar}>
      <div className={styles.order}>
        <legend>Order by:</legend>
        <div className={styles.option}>
          <input type="radio" id="name-asc" className={styles.input} name="choice" value="name_asc" onChange={handleSortChange} />
          <label className={styles.label} htmlFor="name-asc">
            A to Z
          </label>
        </div>
        <div className={styles.option}>
          <input type="radio" id="name-desc" className={styles.input} name="choice" value="name_desc" onChange={handleSortChange} />
          <label className={styles.label} htmlFor="name-desc">
            Z to A
          </label>
        </div>
        <div className={styles.option}>
          <input type="radio" id="price-asc" className={styles.input} name="choice" value="price_asc" onChange={handleSortChange} />
          <label className={styles.label} htmlFor="price-asc">
            Price up
          </label>
        </div>
        <div className={styles.option}>
          <input type="radio" id="price-desc" className={styles.input} name="choice" value="price_desc" onChange={handleSortChange} />
          <label className={styles.label} htmlFor="price-desc">
            Price down
          </label>
        </div>
      </div>
      <div className={styles.price}>
        <legend>Price:</legend>
      </div>
    </div>
  );
}

FilterSideBar.propTypes = {
  onSelectedSort: PropTypes.func,
};
