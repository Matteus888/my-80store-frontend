import styles from "../styles/Products.module.css";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/products?page=${currentPage}&limit=9`);
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
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const products = productsList.map((product) => (
    <ProductCard
      key={product.slug}
      imagePath={product.imageUrl}
      name={product.name}
      description={product.description || "No description available"}
      price={product.price}
    />
  ));

  return (
    <div className={styles.main}>
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
