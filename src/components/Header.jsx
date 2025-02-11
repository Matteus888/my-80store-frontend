import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <img src="/header.png" alt="header pic" className={styles.img} />
    </div>
  );
}
