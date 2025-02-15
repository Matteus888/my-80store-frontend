import styles from "../styles/Product.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Product() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { slug } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${slug}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product infos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // const imageThumbnails = product.imageUrls?.map((image, index) => (
  //     <img
  //       key={index}
  //       className={`${styles.thumbnail} ${currentIndex === index ? styles.active : ""}`}
  //       src={image}
  //       alt={`Thumbnail ${slug + index}`}
  //       onClick={() => setCurrentIndex(index)}
  //     />
  // ));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.imgSection}>
          <div className={styles.thumbnailContainer}>
            {product.imageUrls?.map((image, index) => (
              <img
                key={index}
                className={`${styles.thumbnail} ${currentIndex === index ? styles.active : ""}`}
                src={image}
                alt={`Thumbnail ${slug + index}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <div className={styles.imgContainer}>
            <img className={styles.img} src={product.imageUrls[currentIndex]} alt={`${product.name} pic`} />
          </div>
        </div>
        <div className={styles.textSection}>
          <h1>{product.name}</h1>
          <p>{product.brand}</p>
          <p>{product.description}</p>
          <p>Price: {product.price}€</p>
          {/* <p>Category: {product.category}</p> */}
        </div>
      </div>
    </div>
  );
}
