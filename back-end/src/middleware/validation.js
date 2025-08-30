// backend/middleware/validation.js
import { body, param } from "express-validator";

// Auth validations
export const registerValidation = [
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const loginValidation = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

// Example: validate userId param
export const userIdValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];
