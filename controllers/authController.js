import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { body, validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET

export const registerUser = async (req, res) => {
  const {
    fullName,
    email,
    password,
    dateOfBirth,
    isStudent,
    phoneNumber,
    role,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = new User({
      fullName,
      email,
      password,
      dateOfBirth,
      isStudent,
      phoneNumber,
      role,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not Found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
