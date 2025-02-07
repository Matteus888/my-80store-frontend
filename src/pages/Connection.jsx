import styles from "../styles/Connection.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userReducer";

export default function Connection() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleRegisterSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(
          login({ firstname: data.user.firstname, lastname: data.user.lastname, publicId: data.user.publicId, role: data.user.role })
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleLoginSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(
          login({ firstname: data.user.firstname, lastname: data.user.lastname, publicId: data.user.publicId, role: data.user.role })
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className={styles.main}>
      <h2>Connection Page</h2>
      <div className={styles.forms}>
        <div className={styles.registerSection}>
          <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.registerForm}>
            <label htmlFor="firstname">Firstname</label>
            <input
              type="text"
              id="firstname"
              placeholder="Enter your firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label htmlFor="lastname">Lastname</label>
            <input
              type="text"
              id="lastname"
              placeholder="Enter your lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label htmlFor="emailRegister">Email</label>
            <input
              type="email"
              id="emailRegister"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="passwordRegister">Password</label>
            <input
              type="password"
              id="passwordRegister"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={handleRegisterSubmit}>
              Register
            </button>
          </form>
        </div>
        <div className={styles.loginSection}>
          <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.loginForm}>
            <label htmlFor="emailLogin">Email</label>
            <input type="email" id="emailLogin" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="passwordLogin">Password</label>
            <input
              type="password"
              id="passwordLogin"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={handleLoginSubmit}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
