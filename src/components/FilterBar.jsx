import styles from "@styles/filterBar.module.css";
import PropTypes from "prop-types";
import Slider from "react-slider";

export default function FilterBar({ onSelectedSort, onPriceChange, priceRange }) {
  const sorts = [
    ["name_asc", "A to Z"],
    ["name_desc", "Z to A"],
    ["price_asc", "Rising price"],
    ["price_desc", "Decreasing price"],
  ];

  const handleSortChange = (e) => {
    onSelectedSort(e.target.value);
  };

  const handlePriceChange = (values) => {
    onPriceChange(values);
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.order}>
        <legend className={styles.legend}>Order by:</legend>
        {sorts.map((sort) => (
          <div className={styles.option} key={sort[0]}>
            <input type="radio" id={sort[0]} className={styles.input} name="choice" value={sort[0]} onChange={handleSortChange} />
            <label className={styles.label} htmlFor={sort[0]}>
              {sort[1]}
            </label>
          </div>
        ))}
      </div>
      <div className={styles.price}>
        <legend className={styles.legend}>Price:</legend>
        <Slider
          className={styles.slider}
          min={0}
          max={500}
          value={priceRange}
          onChange={handlePriceChange}
          renderThumb={(props, state) => (
            <div {...props} className={styles.thumb} style={{ ...props.style }} key={state.index}>
              {state.valueNow}€
            </div>
          )}
          pearling
          minDistance={1}
        />
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  onSelectedSort: PropTypes.func,
  onPriceChange: PropTypes.func,
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  style: PropTypes.object,
};
