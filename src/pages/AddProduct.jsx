import { useState } from "react";
import styles from "../styles/AddProduct.module.css";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState([]);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");

  const handleAddProduct = async () => {
    try {
      const res = await fetch("http://localhost:3000/products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description, price, category: [category], stock, imageUrl: image }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Error saving new product:", error);
    }
  };

  return (
    <div className={styles.main}>
      <h2>AddProduct Page</h2>
      <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.form}>
        <label htmlFor="name">Product Name</label>
        <input type="text" id="name" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="price">Price</label>
        <input type="number" id="price" placeholder="Price in €" value={price} onChange={(e) => setPrice(e.target.value)} />
        <label htmlFor="category">Category</label>
        <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="audio">Audio</option>
          <option value="retro-gaming">Retro Gaming</option>
          <option value="films-and-tv-series">Films & TV Séries</option>
          <option value="toys-and-goodies">Toys & Goodies</option>
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
          <option value="food-and-sweets">Food & Sweets</option>
        </select>
        <label htmlFor="stock">Stock</label>
        <input type="number" id="stock" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <label htmlFor="image">Image URL</label>
        <input type="text" id="image" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <button type="submit" onClick={handleAddProduct}>
          Add Product
        </button>
      </form>
    </div>
  );
}
