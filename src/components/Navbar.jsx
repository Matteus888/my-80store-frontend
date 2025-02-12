import styles from "../styles/Navbar.module.css";
import ConfirmationModal from "./ConfirmationModal";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userReducer";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCartTwoTone, LoginTwoTone, LogoutTwoTone } from "@mui/icons-material";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setIsModalOpen(false);
    try {
      await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(logout());
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  const handleClickLogout = () => {
    setIsModalOpen(!isModalOpen);
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
      <div className={styles.navSection}>
        <Link to="/" className={`${styles.link} ${location.pathname === "/" ? styles.activeLink : ""}`}>
          Home
        </Link>
        <Link to="/products" className={`${styles.link} ${location.pathname === "/products" ? styles.activeLink : ""}`}>
          Products
        </Link>
        {isAdmin && (
          <Link to="/addproduct" className={`${styles.link} ${location.pathname === "/addproduct" ? styles.activeLink : ""}`}>
            Add Product
          </Link>
        )}
        <Link to="/about" className={`${styles.link} ${location.pathname === "/about" ? styles.activeLink : ""}`}>
          About
        </Link>
      </div>
      <div className={styles.iconSection}>
        {!isLogged ? (
          <Link
            to="/connect"
            className={`${styles.link} ${location.pathname === "/connect" ? styles.activeLink : ""} ${styles.iconContainer}`}
          >
            <LoginTwoTone style={{ fontSize: 18 }} />
            <p className={styles.iconText}>Login</p>
          </Link>
        ) : (
          <>
            {!isAdmin && (
              <Link
                to="/cart"
                className={`${styles.link} ${location.pathname === "/cart" ? styles.activeLink : ""} ${styles.iconContainer}`}
              >
                <ShoppingCartTwoTone style={{ fontSize: 18 }} />
                <p className={styles.iconText}>Cart</p>
              </Link>
            )}
            <div
              className={`${styles.link} ${location.pathname === "/connect" ? styles.activeLink : ""} ${styles.iconContainer}`}
              onClick={handleClickLogout}
            >
              <LogoutTwoTone style={{ fontSize: 18 }} />
              <p className={styles.iconText}>Logout</p>
            </div>
          </>
        )}
      </div>
      {isModalOpen && (
        <ConfirmationModal
          title="Confirmation"
          content="Are you sure you want to disconnect? "
          btnTxt="Yes"
          onPressBtn={handleLogout}
          onCloseModal={handleClickLogout}
        />
      )}
    </nav>
  );
}
