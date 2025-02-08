import styles from "../styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userReducer";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setTimeout(() => {
        dispatch(logout());
      }, 500);
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  useEffect(() => {
    if (user.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    if (user.publicId === null) {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  }, [user]);

  return (
    <nav className={styles.navbar}>
      <Link to="/">HOME</Link>
      <Link to="/products">PRODUCTS</Link>
      {isAdmin && <Link to="/addproduct">ADD PRODUCT</Link>}
      <Link to="/about">ABOUT</Link>
      {!isLogged && <Link to="/connect">CONNECTION</Link>}
      {isLogged && <p onClick={handleLogout}>LOGOUT</p>}
    </nav>
  );
}
