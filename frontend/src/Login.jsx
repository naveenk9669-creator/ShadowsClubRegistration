import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "./App.css";

function Login({ onLoginSuccess }) {
  const showCreateUser = true;
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const validateForm = () => {
    if (!username.trim()) {
      setMessage("Username is required");
      return false;
    }

    if (username.trim().length < 3) {
      setMessage("Username must be at least 3 characters");
      return false;
    }

    if (!password.trim()) {
      setMessage("Password is required");
      return false;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    const url =
      mode === "login"
        ? `${API}/api/auth/login`
        : `${API}/api/auth/register`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (mode === "login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        onLoginSuccess();
      } else {
        setMessage("User created successfully. Now login.");
        setMode("login");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setMessage("Backend not connected. Please check server.");
    }
  };

  return (
    <div className="login-page">
      <div className="brand">
        <h1>SHADOWS</h1>
        <h2>RECREATION CLUB</h2>
        <p>MEMBER MANAGEMENT</p>
      </div>

      <div className="login-card">
        <h3>{mode === "login" ? "Welcome Back" : "Create User"}</h3>

        <p className="subtitle">
          {mode === "login"
            ? "Sign in to SHADOWS RECREATION CLUB Admin"
            : "Create SHADOWS RECREATION CLUB Admin User"}
        </p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <div className="input-box">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setMessage("");
              }}
            />
          </div>

          <label>Password</label>
          <div className="input-box">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {message && <p className="message-text">{message}</p>}

          <button className="signin-btn" type="submit">
            {mode === "login" ? "Sign In" : "Create User"}
          </button>

          {showCreateUser && mode === "login" && (
            <>
              <div className="divider">
                <span></span>
                <p>OR</p>
                <span></span>
              </div>

              <button
                className="create-btn"
                type="button"
                onClick={() => {
                  setMode("create");
                  setUsername("");
                  setPassword("");
                  setMessage("");
                }}
              >
                Create User
              </button>
            </>
          )}

          {mode === "create" && (
            <button
              className="back-btn"
              type="button"
              onClick={() => {
                setMode("login");
                setUsername("");
                setPassword("");
                setMessage("");
              }}
            >
              Back to Login
            </button>
          )}
        </form>
      </div>

      <p className="footer-text">
        SHADOWS RECREATION CLUB Member Management
      </p>
    </div>
  );
}

export default Login;