import styles from "../styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    if (user.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user.role]);

  return (
    <nav className={styles.navbar}>
      <Link to="/">HOME</Link>
      <Link to="/products">PRODUCTS</Link>
      {isAdmin && <Link to="/addproduct">ADD PRODUCT</Link>}
      <Link to="/about">ABOUT</Link>
      <Link to="/connect">CONNECTION</Link>
    </nav>
  );
}
