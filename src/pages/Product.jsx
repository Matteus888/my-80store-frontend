import styles from "../styles/product.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ImageModal from "../components/ImageModal";

export default function Product() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

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
            <img
              className={styles.img}
              src={product.imageUrls[currentIndex]}
              alt={`${product.name} pic`}
              onClick={() => setIsImageModalOpen(true)}
            />
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
      {isImageModalOpen && (
        <ImageModal productName={product.name} imageUrl={product.imageUrls[currentIndex]} onCloseModal={handleCloseModal} />
      )}
    </div>
  );
}
