import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/userReducer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Connection from "./pages/Connection";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Purchases from "./pages/Purchases";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function App() {
  const dispatch = useDispatch();
  const expiresAt = useSelector((state) => state.user.user.expiresAt);

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
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/connect" element={<Connection />} />
        </Routes>
      </BrowserRouter>
    </Elements>
  );
}
