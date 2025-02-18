import styles from "../styles/Navbar.module.css";
import ConfirmationModal from "./ConfirmationModal";
import ProductMiniCard from "./ProductMiniCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userReducer";
import { Link, useLocation } from "react-router-dom";
import { SentimentSatisfiedAltTwoTone, ShopTwoTwoTone, SettingsTwoTone, ShoppingCartTwoTone, LogoutTwoTone } from "@mui/icons-material";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);

  const location = useLocation();

  const user = useSelector((state) => state.user.value);
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
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
    setIsAdmin(user.role === "admin");
    setIsLogged(user.publicId !== null);
  }, [user]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navSection}>
        <Link to="/" className={`btn ${styles.link} ${location.pathname === "/" ? styles.activeLink : ""}`}>
          Home
        </Link>
        <Link to="/products" className={`btn ${styles.link} ${location.pathname === "/products" ? styles.activeLink : ""}`}>
          Products
        </Link>
        {isAdmin && (
          <Link to="/addproduct" className={`btn ${styles.link} ${location.pathname === "/addproduct" ? styles.activeLink : ""}`}>
            Add Product
          </Link>
        )}
        <Link to="/about" className={`btn ${styles.link} ${location.pathname === "/about" ? styles.activeLink : ""}`}>
          About
        </Link>
      </div>
      <div className={styles.iconSection}>
        {user.firstname && (
          <div
            className={styles.cartContainer}
            onMouseEnter={() => setIsCartDropdownOpen(true)}
            onMouseLeave={() => setIsCartDropdownOpen(false)}
          >
            <Link
              to="/cart"
              className={`btn ${styles.link} ${location.pathname === "/cart" ? styles.activeLink : ""} ${styles.iconContainer}`}
            >
              <ShoppingCartTwoTone style={{ fontSize: 18 }} />
              <p className={styles.iconText}>Cart</p>
            </Link>
            {isCartDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <p className={styles.dropdownTxt}>{user.firstname}&apos;s cart</p>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <ProductMiniCard
                      key={item.slug}
                      name={item.name}
                      imageUrl={item.imageUrls}
                      quantity={item.quantity}
                      price={item.price}
                    />
                  ))
                ) : (
                  <p>Cart is empty</p>
                )}
                {cartTotalPrice !== 0 && <p className={styles.totalPrice}>Total: {cartTotalPrice}€</p>}
                <Link to="/cart" className={`btn ${styles.dropdownBtn}`}>
                  <ShoppingCartTwoTone style={{ fontSize: 18 }} />
                  Got to my cart
                </Link>
              </div>
            )}
          </div>
        )}
        {!isLogged ? (
          <Link
            to="/connect"
            className={`btn ${styles.link} ${location.pathname === "/connect" ? styles.activeLink : ""} ${styles.iconContainer}`}
          >
            <SentimentSatisfiedAltTwoTone style={{ fontSize: 18 }} />
            <p className={styles.iconText}>Login</p>
          </Link>
        ) : (
          <div
            className={styles.profileContainer}
            onMouseEnter={() => setIsProfileMenuOpen(true)}
            onMouseLeave={() => setIsProfileMenuOpen(false)}
          >
            <Link
              to="/profile"
              className={`btn ${styles.link} ${location.pathname === "/profile" ? styles.activeLink : ""} ${styles.iconContainer}`}
            >
              <SentimentSatisfiedAltTwoTone style={{ fontSize: 18 }} />
              <p className={styles.iconText}>Profile</p>
            </Link>
            {isProfileMenuOpen && (
              <div className={styles.dropdownMenu}>
                <p className={styles.dropdownTxt}>Welcome {user.firstname}</p>
                <Link to="/profile" className={`btn ${styles.dropdownBtn}`}>
                  <SettingsTwoTone style={{ fontSize: 18 }} />
                  My account
                </Link>
                <Link to="/purchase" className={`btn ${styles.dropdownBtn}`}>
                  <ShopTwoTwoTone style={{ fontSize: 18 }} />
                  My purchases
                </Link>
                <button className={`btn ${styles.dropdownBtn}`} onClick={handleClickLogout}>
                  <LogoutTwoTone style={{ fontSize: 18 }} />
                  Disconnect
                </button>
              </div>
            )}
          </div>
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
