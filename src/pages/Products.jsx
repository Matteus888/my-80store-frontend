import styles from "../styles/Products.module.css";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";

export default function Products() {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        if (res.ok) {
          const data = await res.json();
          setProductsList(data);
        }
      } catch (error) {
        console.error("Error during getting products:", error);
      }
    };
    fetchProducts();
  }, []);

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
    </div>
  );
}
