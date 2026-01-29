import styles from "@styles/product.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../store/userReducer";
import ImageModal from "../components/ImageModal";
import Alert from "../components/Alert";
import { AddShoppingCartTwoTone, ProductionQuantityLimitsTwoTone } from "@mui/icons-material";

export default function Product() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState(0);
  const [updatedStock, setUpdatedStock] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [updatedImages, setUpdatedImages] = useState([]);

  const { slug } = useParams();

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const isModified =
    updatedDescription !== product?.description ||
    updatedPrice !== product?.price ||
    updatedStock !== product?.stock ||
    JSON.stringify(updatedImages) !== JSON.stringify(product?.imageUrls);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://my-80store-backend.vercel.app/api/products/${slug}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
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

  useEffect(() => {
    if (product) {
      setUpdatedDescription(product.description);
      setUpdatedPrice(product.price);
      setUpdatedStock(product.stock);
      setUpdatedImages(product.imageUrls);
    }
  }, [product]);

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  const handleAddToCart = async () => {
    if (user.publicId) {
      try {
        const res = await fetch("https://my-80store-backend.vercel.app/api/carts/add", {
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

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setUpdatedImages([...updatedImages, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setUpdatedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        description: updatedDescription,
        price: updatedPrice,
        stock: updatedStock,
        imageUrls: updatedImages,
      };

      const res = await fetch(`https://my-80store-backend.vercel.app/api/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();

      if (res.status === 200) {
        setMessage(data.message);
        setProduct({ ...product, ...updatedProduct });
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("An error occurred while updating the product.");
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
            {updatedImages.map((image, index) => (
              <div key={index} className={styles.imageItem}>
                <img
                  key={index}
                  className={`${styles.thumbnail} ${currentIndex === index ? styles.active : ""}`}
                  src={image}
                  alt={`Thumbnail ${slug + index}`}
                  onClick={() => setCurrentIndex(index)}
                />
                {isAdmin && (
                  <button onClick={() => handleRemoveImage(index)} className={`btn ${styles.removeBtn}`}>
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className={styles.imgContainer}>
            <img
              className={styles.img}
              src={updatedImages[currentIndex]}
              alt={`${product.name} pic`}
              onClick={() => setIsImageModalOpen(true)}
            />
          </div>
        </div>
        <div className={styles.textSection}>
          {!isAdmin ? (
            <>
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
            </>
          ) : (
            <>
              <div>
                <p className={styles.name}>{product.name}</p>
                <p>{product.brand}</p>
                <p className={styles.description}>Description:</p>
                <textarea
                  rows={8}
                  cols={100}
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  className={styles.input}
                />
                <p className={styles.description}>New image URL:</p>
                <div className={styles.imageUpdate}>
                  <input
                    type="text"
                    placeholder="New image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className={styles.input}
                  />
                  {/* Aperçu de l'image */}
                  <button
                    onClick={handleAddImage}
                    disabled={!newImageUrl.trim()}
                    className={`btn ${styles.addBtn}`}
                    style={{ marginTop: "5px" }}
                  >
                    Add Image
                  </button>
                  {newImageUrl.trim() && (
                    <div className={styles.imagePreviewContainer}>
                      <img src={newImageUrl} alt="Preview" className={styles.imagePreview} />
                      <button onClick={() => setNewImageUrl("")} className={`btn ${styles.removeBtn}`}>
                        X
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.updatePrice}>
                  <p className={styles.price}>Price:</p>
                  <input
                    type="number"
                    value={updatedPrice}
                    onChange={(e) => setUpdatedPrice(parseFloat(e.target.value) || 0)}
                    className={`${styles.updatePriceInput} ${styles.input}`}
                  />
                  <p>€</p>
                </div>
                <div className={styles.updatePrice}>
                  <p className={styles.stock}>Stock:</p>
                  <input
                    type="number"
                    value={updatedStock}
                    onChange={(e) => setUpdatedStock(parseInt(e.target.value, 10) || 0)}
                    className={`${styles.updateStockInput} ${styles.input}`}
                  />
                  <p>item(s)</p>
                </div>
                <button className={`btn ${styles.addBtn}`} onClick={handleUpdateProduct} disabled={!isModified}>
                  Update product
                  <ProductionQuantityLimitsTwoTone style={{ fontSize: 22 }} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Agrandissement de l'image dans une modale */}
      {isImageModalOpen && (
        <ImageModal
          productName={product.name}
          imageUrl={product.imageUrls[currentIndex]}
          onCloseModal={handleCloseModal}
        />
      )}
      {message && (
        <Alert title="Info" onClose={() => setMessage("")} content={message} color="var(--dark-blue)" autoClose />
      )}
      {errorMessage && <Alert title="Alert" onClose={() => setErrorMessage("")} content={errorMessage} color="red" />}
    </div>
  );
}
