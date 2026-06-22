const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [
  'http://localhost:3000',                  // Local React (Create React App)
  'http://localhost:5173',                  // Local React (Vite)
  'https://shadowsclubregistration.vercel.app' // Your live Vercel URL
];

const memberRoutes = require("./routes/memberRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

