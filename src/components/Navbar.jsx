import styles from "../styles/Navbar.module.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/Connect">Connection</Link>
    </nav>
  );
}
