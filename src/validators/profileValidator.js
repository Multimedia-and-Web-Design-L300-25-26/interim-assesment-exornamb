import { body } from "express-validator";
import validator from "validator";

export const profileUpdateValidators = [
  body("fullName")
    .optional()
    .trim()
    .isString().withMessage("Full name must be between 2 and 80 characters")
    .isLength({ min: 2, max: 80 }).withMessage("Full name must be between 2 and 80 characters")
    .matches(/^[a-zA-Z\s\-']+$/).withMessage("Full name must be between 2 and 80 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^\+[1-9]\d{6,14}$/).withMessage("Phone must be a valid E.164 number e.g. +233550004821"),

  body("avatarUrl")
    .optional()
    .trim()
    .custom((value) => {
      if (value === "") return true;
      if (!validator.isURL(value)) {
        throw new Error("Avatar URL must be a valid URL");
      }
      return true;
    }),

  body("country")
    .optional()
    .trim()
    .matches(/^[A-Z]{2}$/).withMessage("Country must be a valid 2-letter ISO country code"),

  body("dateOfBirth")
    .optional()
    .trim()
    .custom((value) => {
      const dob = new Date(value);
      if (isNaN(dob.getTime())) {
        throw new Error("Date of birth must be a valid date");
      }
      
      const now = new Date();
      if (dob > now) {
        throw new Error("Date of birth cannot be in the future");
      }
      
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 18) {
        throw new Error("You must be at least 18 years old");
      }
      
      return true;
    })
];
