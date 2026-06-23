import { useState } from "react";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";


  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("User created successfully");
      setUsername("");
      setPassword("");
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>Create User</h2>

      <form onSubmit={handleCreateUser}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            required
          />
        </div>

        <button type="submit">Create User</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default CreateUser;