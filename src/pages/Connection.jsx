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

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(login({ firstname: data.user.firstname, lastname: data.user.lastname, publicId: data.user.publicId }));
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className={styles.main}>
      <h2>Connection Page</h2>
      <div>
        <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.inputContainer}>
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
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" onClick={handleSubmit}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
