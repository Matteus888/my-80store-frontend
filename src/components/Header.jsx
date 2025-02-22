import styles from "../styles/header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <img src="/Designer2.jpeg" alt="header pic" className={styles.img} />
    </div>
  );
}
