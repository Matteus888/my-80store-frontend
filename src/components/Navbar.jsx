import styles from "../styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/userReducer";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCartTwoTone, LoginTwoTone, LogoutTwoTone } from "@mui/icons-material";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(logout());
      navigate("/connect");
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
      <Link to="/" className={`${styles.link} ${location.pathname === "/" ? styles.activeLink : ""}`}>
        HOME
      </Link>
      <Link to="/products" className={`${styles.link} ${location.pathname === "/products" ? styles.activeLink : ""}`}>
        PRODUCTS
      </Link>
      {isAdmin && (
        <Link to="/addproduct" className={`${styles.link} ${location.pathname === "/addproduct" ? styles.activeLink : ""}`}>
          ADD PRODUCT
        </Link>
      )}
      <Link to="/about" className={`${styles.link} ${location.pathname === "/about" ? styles.activeLink : ""}`}>
        ABOUT
      </Link>
      <div>
        {!isLogged ? (
          <Link
            to="/connect"
            className={`${styles.link} ${location.pathname === "/connect" ? styles.activeLink : ""} ${styles.iconContainer}`}
          >
            <LoginTwoTone style={{ fontSize: 30 }} />
          </Link>
        ) : (
          <>
            {!isAdmin && (
              <Link
                to="/cart"
                className={`${styles.link} ${location.pathname === "/cart" ? styles.activeLink : ""} ${styles.iconContainer}`}
              >
                <ShoppingCartTwoTone style={{ fontSize: 30 }} />
              </Link>
            )}
            <Link
              to="/connect"
              className={`${styles.link} ${location.pathname === "/connect" ? styles.activeLink : ""} ${styles.iconContainer}`}
            >
              <LogoutTwoTone style={{ fontSize: 30, marginLeft: 15 }} onClick={handleLogout} />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
