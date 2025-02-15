import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/userReducer";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Connection from "./pages/Connection";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

export default function App() {
  const dispatch = useDispatch();
  const expiresAt = useSelector((state) => state.user.value.expiresAt);

  useEffect(() => {
    if (!expiresAt) return;

    const timeLeft = expiresAt - Date.now();
    if (timeLeft <= 0) {
      dispatch(logout());
    } else {
      const timeout = setTimeout(() => dispatch(logout()), timeLeft);
      return () => clearTimeout(timeout);
    }
  }, [expiresAt, dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/connect" element={<Connection />} />
      </Routes>
    </BrowserRouter>
  );
}
