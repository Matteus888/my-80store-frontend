import styles from "@styles/addProduct.module.css";
import Alert from "../components/Alert";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DeleteForever } from "@mui/icons-material";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState([]);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const nameRef = useRef();
  const brandRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const stockRef = useRef();
  const categoryRef = useRef(null);
  const imageRef = useRef();
  const lastFocusedInput = useRef(null);

  const categories = ["audio", "retro-gaming", "films-and-tv-series", "toys-and-goodies", "fashion", "electronics"];

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
      lastFocusedInput.current = nameRef.current;
      setErrorMessage("Please enter the product name");
      return;
    } else if (brand.trim() === "") {
      lastFocusedInput.current = brandRef.current;
      setErrorMessage("Please enter the product brand");
      return;
    } else if (description.trim() === "") {
      lastFocusedInput.current = descriptionRef.current;
      setErrorMessage("Please enter the product description");
      return;
    } else if (price === 0) {
      lastFocusedInput.current = priceRef.current;
      setErrorMessage("Please enter the product price");
      return;
    } else if (category.length === 0) {
      lastFocusedInput.current = categoryRef.current;
      setErrorMessage("Please enter at least one category");
      return;
    } else if (stock === 0) {
      lastFocusedInput.current = stockRef.current;
      setErrorMessage("Please enter the product stock");
      return;
    } else if (images.every((img) => img.trim() === "")) {
      lastFocusedInput.current = imageRef.current;
      setErrorMessage("Please enter at least one image URL");
      return;
    } else {
      setErrorMessage("");

      try {
        const res = await fetch("https://my-80store-backend.vercel.app/api/products/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name,
            brand,
            description,
            price,
            category,
            stock,
            imageUrls: images.filter((img) => img.trim() !== ""),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setName("");
          setBrand("");
          setDescription("");
          setPrice(0);
          setStock(0);
          setCategory([]);
          setImages([""]);
          console.log(data);
        }
      } catch (error) {
        console.error("Error saving new product:", error);
        lastFocusedInput.current = nameRef.current;
        setErrorMessage("Unable to connect to the server. Please try again later.");
      }
    }
  };

  const handleCloseError = () => {
    setErrorMessage("");
    if (lastFocusedInput.current) {
      lastFocusedInput.current.focus();
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
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
              <label htmlFor="brand" className={styles.label}>
                Brand
              </label>
              <input
                className={styles.input}
                ref={brandRef}
                type="text"
                id="brand"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
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
                    <div className={`btn ${styles.button} ${styles.deleteBtn}`}>
                      <DeleteForever
                        onClick={() => removeImageField(index)}
                        style={{ color: "red", fontSize: "18px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addImageField} className={`btn ${styles.button} ${styles.addPicBtn}`}>
                + Add a picture
              </button>
            </div>
          </div>
        </form>
        <button type="submit" onClick={handleAddProduct} className={`btn ${styles.button} ${styles.addProductBtn}`}>
          Add Product
        </button>
        {errorMessage && <Alert title="Alert" onClose={handleCloseError} content={errorMessage} color="red" />}
      </div>
    </div>
  );
}
