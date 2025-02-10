import styles from "../styles/CategoryBar.module.css";
import PropTypes from "prop-types";
import { TuneTwoTone } from "@mui/icons-material";

export default function CategoryBar({ selectedCategory, onCategoryClick, onFilterBtn }) {
  const categories = ["audio", "retro-gaming", "films-and-tv-series", "toys-and-goodies", "fashion", "electronics", "food-and-sweets"];

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
        className={`${styles.categoryBtn} ${selectedCategory === null ? styles.activeCategory : ""}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryClick(category)}
          className={`${styles.categoryBtn} ${selectedCategory === category ? styles.activeCategory : ""}`}
        >
          {formatCategoryName(category)}
        </button>
      ))}
      <div className={styles.filterBtn} onClick={() => onFilterBtn()}>
        <TuneTwoTone style={{ fontSize: 20 }} />
        <p>Filter</p>
      </div>
    </div>
  );
}

CategoryBar.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryClick: PropTypes.func.isRequired,
  onFilterBtn: PropTypes.func.isRequired,
};
