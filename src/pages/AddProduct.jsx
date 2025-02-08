import styles from "../styles/AddProduct.module.css";
import { useState, useRef } from "react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState([]);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();
  const stockRef = useRef();
  const imageRef = useRef();

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
    } else if (image.trim() === "") {
      setErrorMessage("Please enter a product url");
      imageRef.current.focus();
      return;
    } else {
      setErrorMessage("");

      try {
        const res = await fetch("http://localhost:3000/products/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, description, price, category, stock, imageUrl: image }),
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

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedCategories = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push(options[i].value);
      }
    }
    setCategory(selectedCategories);
  };

  return (
    <div className={styles.main}>
      <h2>AddProduct Page</h2>
      <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.form}>
        <label htmlFor="name">Product Name</label>
        <input ref={nameRef} type="text" id="name" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="description">Description</label>
        <input
          ref={descriptionRef}
          type="text"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="price">Price</label>
        <input ref={priceRef} type="number" id="price" placeholder="Price in €" value={price} onChange={(e) => setPrice(e.target.value)} />
        <label htmlFor="category">Category</label>
        <select ref={categoryRef} name="category" id="category" value={category} onChange={handleCategoryChange} multiple>
          <option value="audio">Audio</option>
          <option value="retro-gaming">Retro Gaming</option>
          <option value="films-and-tv-series">Films & TV Séries</option>
          <option value="toys-and-goodies">Toys & Goodies</option>
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
          <option value="food-and-sweets">Food & Sweets</option>
        </select>
        <label htmlFor="stock">Stock</label>
        <input ref={stockRef} type="number" id="stock" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <label htmlFor="image">Image URL</label>
        <input ref={imageRef} type="text" id="image" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <button type="submit" onClick={handleAddProduct}>
          Add Product
        </button>
        <p className={styles.errorText} role="alert">
          {errorMessage ? errorMessage : <span style={{ visibility: "hidden" }}>Invisible</span>}
        </p>
      </form>
    </div>
  );
}
