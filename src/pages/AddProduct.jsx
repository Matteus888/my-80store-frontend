import styles from "../styles/AddProduct.module.css";
import Alert from "../components/Alert";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DeleteForever } from "@mui/icons-material";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState([]);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const user = useSelector((state) => state.user.value);

  const nameRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const stockRef = useRef();
  const categoryRef = useRef(null);
  const imageRef = useRef();

  const categories = ["audio", "retro-gaming", "films-and-tv-series", "toys-and-goodies", "fashion", "electronics", "food-and-sweets"];

  useEffect(() => {
    if (!user.role || user.role !== "admin") {
      navigate("/");
    }
  }, [user?.role, navigate]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setCategory((prevCategory) => {
      if (checked) {
        return [...prevCategory, value];
      } else {
        return prevCategory.filter((cat) => cat !== value);
      }
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const removeImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages.length ? updatedImages : [""]);
  };

  const handleAddProduct = async () => {
    if (name.trim() === "") {
      setErrorMessage("Please enter the product name");
      nameRef.current.focus();
      return;
    } else if (description.trim() === "") {
      setErrorMessage("Please enter the product description");
      descriptionRef.current.focus();
      return;
    } else if (price === 0) {
      setErrorMessage("Please enter the product price");
      priceRef.current.focus();
      return;
    } else if (category.length === 0) {
      setErrorMessage("Please enter at least one category");
      categoryRef.current.focus();
      return;
    } else if (stock === 0) {
      setErrorMessage("Please enter the product stock");
      stockRef.current.focus();
      return;
    } else if (images.every((img) => img.trim() === "")) {
      setErrorMessage("Please enter at least one image URL");
      imageRef.current.focus();
      return;
    } else {
      setErrorMessage("");

      try {
        const res = await fetch("http://localhost:3000/products/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, description, price, category, stock, imageUrls: images.filter((img) => img.trim() !== "") }),
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
        }
      } catch (error) {
        console.error("Error saving new product:", error);
      }
    }
  };

  return (
    <div className={styles.main}>
      <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.form}>
        <div className={styles.left}>
          <div className={styles.inputContainer}>
            <label htmlFor="name" className={styles.label}>
              Product Name
            </label>
            <input
              className={styles.input}
              ref={nameRef}
              type="text"
              id="name"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              className={styles.input}
              cols={33}
              rows={4}
              ref={descriptionRef}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
              Description
            </textarea>
          </div>
          <div className={styles.numSection}>
            <div className={styles.inputContainer}>
              <label htmlFor="price" className={styles.label}>
                Price
              </label>
              <input
                className={`${styles.input} ${styles.numInput}`}
                ref={priceRef}
                type="number"
                id="price"
                placeholder="Price in €"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className={`${styles.inputContainer} ${styles.stockContainer}`}>
              <label htmlFor="stock" className={styles.label}>
                Stock
              </label>
              <input
                className={`${styles.input} ${styles.numInput}`}
                ref={stockRef}
                type="number"
                id="stock"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="category" className={styles.label}>
              Categorie(s)
            </label>
            <div id="category" ref={categoryRef} className={styles.categories}>
              {categories.map((cat) => (
                <label key={cat} className={styles.category}>
                  <input
                    className={styles.categoryCheckbox}
                    type="checkbox"
                    value={cat}
                    checked={category.includes(cat)}
                    onChange={handleCheckboxChange}
                  />
                  {cat.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.inputContainer}>
            <label htmlFor="image" className={styles.label}>
              Image(s) URL
            </label>
            {images.map((img, index) => (
              <div key={index} className={styles.imageInputContainer}>
                {img && <img src={img} alt={`Preview ${index}`} className={styles.imagePreview} />}
                <div className={styles.imageInputDiv}>
                  <input
                    className={`${styles.input} ${styles.imageInput}`}
                    ref={imageRef}
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                  <div className={`${styles.button} ${styles.deleteBtn}`}>
                    <DeleteForever onClick={() => removeImageField(index)} style={{ color: "red", fontSize: "18px" }} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addImageField} className={`${styles.button} ${styles.addPicBtn}`}>
              + Add a picture
            </button>
          </div>
        </div>
      </form>
      <button type="submit" onClick={handleAddProduct} className={`${styles.button} ${styles.addProductBtn}`}>
        Add Product
      </button>
      <div className={styles.errorAlert}>
        {errorMessage ? (
          <Alert title="Alert" onClose={() => setErrorMessage("")} content={errorMessage} />
        ) : (
          <span style={{ visibility: "hidden" }}>Invisible</span>
        )}
      </div>
    </div>
  );
}
