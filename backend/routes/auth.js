const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const makeToken = (user) => jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || password.length < 8) {
      return res.status(400).json({ message: "Enter your name, a valid email, and a password of at least 8 characters." });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not create your account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch {
    res.status(500).json({ message: "Could not sign in right now." });
  }
});
module.exports = router;
