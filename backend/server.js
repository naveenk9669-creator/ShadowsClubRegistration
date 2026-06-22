const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const memberRoutes = require("./routes/memberRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
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

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing!");
    }

    // Attempt connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("=== MongoDB connected successfully ===");

    // 2. ONLY start listening once the DB is connected
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ CRITICAL DATABASE ERROR:", error.message);
    process.exit(1); // Force the container to crash so Railway shows you the error log
  }
}

startServer();
