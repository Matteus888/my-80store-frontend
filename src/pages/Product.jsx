import styles from "../styles/product.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../store/userReducer";
import ImageModal from "../components/ImageModal";
import Alert from "../components/Alert";
import { AddShoppingCartTwoTone } from "@mui/icons-material";

export default function Product() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { slug } = useParams();

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

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

  const handleAddToCart = async () => {
    if (user.publicId) {
      try {
        const res = await fetch("http://localhost:3000/carts/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ slug, quantity: 1 }),
        });
        const data = await res.json();
        if (res.status === 200) {
          setMessage(data.message);
          dispatch(updateCart({ items: data.cart.items, totalPrice: data.cart.totalPrice }));
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      setErrorMessage("You need to be connected to add product in cart.");
    }
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
          <div>
            <p className={styles.name}>{product.name}</p>
            <p>{product.brand}</p>
            <p className={styles.description}>Description:</p>
            <p>{product.description}</p>
          </div>
          <div className={styles.priceContainer}>
            <p>
              <span className={styles.price}>Price:</span> {product.price}€
            </p>
            <button className={`btn ${styles.addBtn}`} onClick={handleAddToCart}>
              Add to cart
              <AddShoppingCartTwoTone style={{ fontSize: 22 }} />
            </button>
          </div>
        </div>
      </div>
      {isImageModalOpen && (
        <ImageModal productName={product.name} imageUrl={product.imageUrls[currentIndex]} onCloseModal={handleCloseModal} />
      )}
      {message && <Alert title="Info" onClose={() => setMessage("")} content={message} color="var(--dark-blue)" autoClose />}
      {errorMessage && <Alert title="Alert" onClose={() => setErrorMessage("")} content={errorMessage} color="red" />}
    </div>
  );
}
