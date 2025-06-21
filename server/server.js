const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const User = require("./models/User");

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for profile photo
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/loginApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB error:", err));

// Test endpoint
app.get("/api/test", (req, res) => {
  res.send("✅ Backend is reachable");
});

// Register
// app.post("/register", upload.single("photo"), async (req, res) => {
//   const { name, email, password, mobile } = req.body;
//   const photo = req.file?.filename || "default.jpg";

//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, mobile, photo });

//     await newUser.save();
//     res.json({ message: "User registered" });
//   } catch (err) {
//     res.status(500).json({ message: "Error registering user", error: err.message });
//   }
// });

app.post("/register", upload.single("photo"), async (req, res) => {
  try {
    console.log("➡️ Received Register Data:", req.body);
    console.log("📷 Received File:", req.file);

    const { name, email, password, mobile } = req.body;
    const photo = req.file?.filename || 'default.png';

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, mobile, photo });

    await newUser.save();
    res.json({ message: "User registered" });

  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});


// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// Reset Password
app.post("/reset-password", async (req, res) => {
  const { name, email, mobile, newPassword } = req.body;

  try {
    const user = await User.findOne({ name, email, mobile });
    if (!user) return res.status(404).send("User not found");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();
    res.send("Password updated");
  } catch (err) {
    res.status(500).send("Error updating password");
  }
});

// Start server
app.listen(5000, '0.0.0.0', () => {
  console.log("✅ Server running at http://0.0.0.0:5000");
});
