import styles from "../styles/products.module.css";
import CategoryBar from "../components/CategoryBar";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterBtn, setFilterBtn] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:3000/products?page=${currentPage}&limit=10`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }
        if (selectedSort) {
          url += `&sort=${selectedSort}`;
        }
        url += `&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProductsList(data.products);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Error during getting products:", error);
      }
    };
    fetchProducts();
  }, [currentPage, selectedCategory, selectedSort, filterBtn, priceRange]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleFilterBtn = () => {
    setFilterBtn(!filterBtn);
    if (filterBtn) {
      setSelectedSort(null);
      setPriceRange([0, 500]);
    }
  };

  const handleSelectedSort = (sort) => {
    setSelectedSort(sort);
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  const products = productsList.map((product) => (
    <ProductCard
      key={product.slug}
      imageUrls={product.imageUrls}
      name={product.name}
      brand={product.brand}
      description={product.description || "No description available"}
      price={product.price}
      slug={product.slug}
    />
  ));

  return (
    <div className={styles.main}>
      <CategoryBar
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onFilterBtn={handleFilterBtn}
        filterBtn={filterBtn}
      />
      {filterBtn && <FilterBar onSelectedSort={handleSelectedSort} onPriceChange={handlePriceChange} priceRange={priceRange} />}
      <div className={styles.container}>{products}</div>
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.paginationBtn}>
          <ChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`${styles.paginationBtn} ${currentPage === i + 1 ? styles.activePage : ""}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.paginationBtn}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
