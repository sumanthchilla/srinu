
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Temporary storage
const users = [];

// Test backend
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Signup API
app.post("/api/auth/signup", async (req, res) => {
  try {
    console.log("Signup API called");

    const { name, email, password } = req.body;

    console.log("Received signup request for:", email);

    if (!name?.trim() || !email?.trim() || !password) {
      console.log("Signup failed: Missing fields");

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (user) => user.email === normalizedEmail
    );

    if (existingUser) {
      console.log("Signup failed: Email already registered");

      return res.status(409).json({
        success: false,
        message: "Email is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    };

    users.push(newUser);

    console.log("Signup successful:", normalizedEmail);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Unknown route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
