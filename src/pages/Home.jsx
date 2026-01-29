import styles from "@styles/home.module.css";
import HomeCard from "../components/HomeCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://my-80store-backend.vercel.app/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      const productsData = {};
      for (const category of categories) {
        try {
          const res = await fetch(`https://my-80store-backend.vercel.app/api/products?category=${category.slug}`);
          const data = await res.json();
          productsData[category.slug] = data.products;
        } catch (error) {
          console.error(`Error fetching products for ${category.name}:`, error);
        }
      }
      setProductsByCategory(productsData);
    };
    if (categories.length) fetchProductsByCategory();
  }, [categories]);

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {categories.map((category) => (
          <HomeCard key={category.slug} category={category.name} products={productsByCategory[category.slug] || []} />
        ))}
      </div>
    </div>
  );
}
