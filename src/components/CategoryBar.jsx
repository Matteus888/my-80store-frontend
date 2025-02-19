import styles from "../styles/categoryBar.module.css";
import PropTypes from "prop-types";
import { TuneTwoTone } from "@mui/icons-material";

export default function CategoryBar({ selectedCategory, onCategoryClick, onFilterBtn, filterBtn }) {
  const categories = ["audio", "retro-gaming", "films-and-tv-series", "toys-and-goodies", "fashion", "electronics"];

  const formatCategoryName = (category) => {
    return category
      .replace(/-/g, " ")
      .replace(/ and /g, " & ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className={styles.categoryBar}>
      <button
        onClick={() => onCategoryClick(null)}
        className={`btn ${styles.categoryBtn} ${selectedCategory === null ? styles.activeCategory : ""}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryClick(category)}
          className={`btn ${styles.categoryBtn} ${selectedCategory === category ? styles.activeCategory : ""}`}
        >
          {formatCategoryName(category)}
        </button>
      ))}
      <div
        className={`btn ${styles.categoryBtn} ${styles.filterButton} ${filterBtn ? styles.activeFilter : ""}`}
        onClick={() => onFilterBtn()}
      >
        <TuneTwoTone style={{ fontSize: 16, marginRight: 5 }} />
        {!filterBtn ? <p>Filters</p> : <p>Reset</p>}
      </div>
    </div>
  );
}

CategoryBar.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryClick: PropTypes.func.isRequired,
  onFilterBtn: PropTypes.func.isRequired,
  filterBtn: PropTypes.bool.isRequired,
};
