import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .notEmpty()
      .withMessage("Email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("dateOfBirth").notEmpty().withMessage("Date of birth is required"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  ],
  registerUser
);

// Login route
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .notEmpty()
      .withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

export default router