import styles from "@styles/navbar.module.css";
import Alert from "../components/Alert";
import ConfirmationModal from "./ConfirmationModal";
import ProductMiniCard from "./ProductMiniCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, loginAndFetchCart } from "../store/userReducer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SentimentSatisfiedAltTwoTone,
  ShopTwoTwoTone,
  SettingsTwoTone,
  ShoppingCartTwoTone,
  LogoutTwoTone,
} from "@mui/icons-material";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [emailLog, setEmailLog] = useState("");
  const [passwordLog, setPasswordLog] = useState("");
  const [errorMessageLog, setErrorMessageLog] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const { cart } = user;

  const handleLoginSubmit = async () => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (emailLog.trim() === "") {
      setErrorMessageLog("Please enter your email");
      return;
    } else if (!regex.test(emailLog)) {
      setErrorMessageLog("Invalid email address");
      return;
    } else if (passwordLog.trim() === "") {
      setErrorMessageLog("Please enter your password");
      return;
    } else {
      setErrorMessageLog("");

      try {
        const res = await fetch("https://my-80store-backend.vercel.app/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ emailLog, passwordLog }),
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(
            loginAndFetchCart({
              firstname: data.user.firstname,
              lastname: data.user.lastname,
              publicId: data.user.publicId,
              role: data.user.role,
            }),
          );
          setEmailLog("");
          setPasswordLog("");
          navigate(data.user.role === "admin" ? "/addProduct" : "/");
        } else {
          setErrorMessageLog("Invalid credentials");
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessageLog("Unable to connect to the server. Please try again later.");
      }
    }
  };

  const handleLogout = async () => {
    setIsModalOpen(false);
    try {
      await fetch("https://my-80store-backend.vercel.app/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(logout());
      localStorage.clear(); // Force la suppression du cache Redux Persist
      sessionStorage.clear();
      setIsLoginMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  const handleClickLogout = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
    setIsLogged(user.publicId !== null);
  }, [user]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navSection}>
        <Link to="/" className={`btn ${styles.link} ${location.pathname === "/" ? styles.activeLink : ""}`}>
          Home
        </Link>
        <Link
          to="/products"
          className={`btn ${styles.link} ${location.pathname === "/products" ? styles.activeLink : ""}`}
        >
          {!isAdmin ? <>Products</> : <>Update Products</>}
        </Link>
        {isAdmin && (
          <>
            <Link
              to="/addproduct"
              className={`btn ${styles.link} ${location.pathname === "/addproduct" ? styles.activeLink : ""}`}
            >
              Add Product
            </Link>
          </>
        )}
      </div>

      <div className={styles.iconSection}>
        {/* Bouton panier */}
        {isLogged && !isAdmin && (
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
                {cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <ProductMiniCard
                      key={item.product.slug}
                      name={item.product.name}
                      imageUrl={item.product.imageUrls[0]}
                      quantity={item.quantity}
                      price={item.product.price}
                    />
                  ))
                ) : (
                  <p className={styles.emptyCartTxt}>Cart is empty</p>
                )}
                {cart.totalPrice !== 0 && <p className={styles.totalPrice}>Total: {cart.totalPrice}€</p>}
                <Link to="/cart" className={`btn ${styles.dropdownBtn}`}>
                  <ShoppingCartTwoTone style={{ fontSize: 18 }} />
                  Got to my cart
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Bouton Login/Profile */}
        {!isLogged ? (
          <div
            className={styles.profileContainer}
            onMouseEnter={() => setIsLoginMenuOpen(true)}
            onMouseLeave={() => setIsLoginMenuOpen(false)}
          >
            <Link
              to="/connect"
              className={`btn ${styles.link} ${location.pathname === "/connect" ? styles.activeLink : ""} ${styles.iconContainer}`}
            >
              <SentimentSatisfiedAltTwoTone style={{ fontSize: 18 }} />
              <p className={styles.iconText}>Login</p>
            </Link>
            {isLoginMenuOpen && (
              <div className={styles.dropdownMenu}>
                <p className={styles.dropdownTxt}>Connect</p>
                <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.loginForm}>
                  <label className={styles.label} htmlFor="emailLogin">
                    Email
                  </label>
                  <input
                    className={styles.input}
                    type="email"
                    id="emailLogin"
                    placeholder="Enter your email"
                    value={emailLog}
                    onChange={(e) => setEmailLog(e.target.value)}
                  />
                  <label className={styles.label} htmlFor="passwordLogin">
                    Password
                  </label>
                  <input
                    className={styles.input}
                    type="password"
                    id="passwordLogin"
                    placeholder="Enter your password"
                    value={passwordLog}
                    onChange={(e) => setPasswordLog(e.target.value)}
                  />
                </form>
                <button className={`btn ${styles.loginBtn}`} type="submit" onClick={handleLoginSubmit}>
                  Login
                </button>
                <div className={styles.lineContainer}>
                  <div className={styles.line}></div>
                  <p className={styles.lineTxt}>OR</p>
                  <div className={styles.line}></div>
                </div>
                <Link to="/connect" className={`btn ${styles.registerBtn}`} onClick={() => setIsLoginMenuOpen(false)}>
                  Register
                </Link>
                {errorMessageLog && (
                  <Alert title="Alert" onClose={() => setErrorMessageLog("")} content={errorMessageLog} color="red" />
                )}
              </div>
            )}
          </div>
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
                  My profile
                </Link>
                <Link to="/purchases" className={`btn ${styles.dropdownBtn}`}>
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
