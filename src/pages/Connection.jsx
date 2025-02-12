import styles from "../styles/Connection.module.css";
import Alert from "../components/Alert";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/userReducer";

export default function Connection() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [emailLog, setEmailLog] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLog, setPasswordLog] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageLog, setErrorMessageLog] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const emailLogRef = useRef(null);
  const passwordLogRef = useRef(null);

  const handleRegisterSubmit = async () => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (firstname.trim() === "") {
      setErrorMessage("Please enter your firstname");
      firstnameRef.current.focus();
      return;
    } else if (lastname.trim() === "") {
      setErrorMessage("Please enter your lastname");
      lastnameRef.current.focus();
      return;
    } else if (email.trim() === "") {
      setErrorMessage("Please enter your email");
      emailRef.current.focus();
      return;
    } else if (!regex.test(email)) {
      setErrorMessage("Invalid email address");
      emailRef.current.focus();
      return;
    } else if (password.trim() === "") {
      setErrorMessage("Please enter a password");
      passwordRef.current.focus();
      return;
    } else {
      setErrorMessage("");

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
          setEmail("");
          setPassword("");
          setFirstname("");
          setLastname("");
          navigate("/");
        } else {
          setErrorMessage("This user already exists");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setErrorMessage("Unable to connect to the server. Please try again later.");
      }
    }
  };

  const handleLoginSubmit = async () => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (emailLog.trim() === "") {
      setErrorMessageLog("Please enter your email");
      emailLogRef.current.focus();
      return;
    } else if (!regex.test(emailLog)) {
      setErrorMessageLog("Invalid email address");
      emailLogRef.current.focus();
      return;
    } else if (passwordLog.trim() === "") {
      setErrorMessageLog("Please enter your password");
      passwordLogRef.current.focus();
      return;
    } else {
      setErrorMessageLog("");

      try {
        const res = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ emailLog, passwordLog }),
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(
            login({ firstname: data.user.firstname, lastname: data.user.lastname, publicId: data.user.publicId, role: data.user.role })
          );
          setEmailLog("");
          setPasswordLog("");
          if (data.user.role === "admin") {
            navigate("/addproduct");
          } else {
            navigate("/products");
          }
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessageLog("Unable to connect to the server. Please try again later.");
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.forms}>
        <div className={styles.registerSection}>
          <h2>Create count</h2>
          <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.registerForm}>
            <label className={styles.label} htmlFor="firstname">
              Firstname
            </label>
            <input
              className={styles.input}
              ref={firstnameRef}
              type="text"
              id="firstname"
              placeholder="Enter your firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label className={styles.label} htmlFor="lastname">
              Lastname
            </label>
            <input
              className={styles.input}
              ref={lastnameRef}
              type="text"
              id="lastname"
              placeholder="Enter your lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label className={styles.label} htmlFor="emailRegister">
              Email
            </label>
            <input
              className={styles.input}
              ref={emailRef}
              type="email"
              id="emailRegister"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className={styles.label} htmlFor="passwordRegister">
              Password
            </label>
            <input
              className={styles.input}
              ref={passwordRef}
              type="password"
              id="passwordRegister"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <button className={styles.button} type="submit" onClick={handleRegisterSubmit}>
            Register
          </button>
          <p className={styles.errorAlert} role="alert">
            {errorMessage ? (
              <Alert title="Alert" onClose={() => setErrorMessage("")} content={errorMessage} />
            ) : (
              <span style={{ visibility: "hidden" }}>Invisible</span>
            )}
          </p>
        </div>
        <div className={styles.loginSection}>
          <h2>Connect</h2>
          <form action="submit" onSubmit={async (e) => e.preventDefault()} className={styles.loginForm}>
            <label className={styles.label} htmlFor="emailLogin">
              Email
            </label>
            <input
              className={styles.input}
              ref={emailLogRef}
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
              ref={passwordLogRef}
              type="password"
              id="passwordLogin"
              placeholder="Enter your password"
              value={passwordLog}
              onChange={(e) => setPasswordLog(e.target.value)}
            />
          </form>
          <button className={styles.button} type="submit" onClick={handleLoginSubmit}>
            Login
          </button>
          <div className={styles.errorAlert}>
            {errorMessageLog ? (
              <Alert title="Alert" onClose={() => setErrorMessageLog("")} content={errorMessageLog} />
            ) : (
              <span style={{ visibility: "hidden" }}>Invisible</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
