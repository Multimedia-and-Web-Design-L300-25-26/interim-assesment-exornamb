import express from "express";
import { validationResult } from "express-validator";
import authenticate from "../middleware/authenticate.js";
import User from "../models/User.js";
import { profileUpdateValidators } from "../validators/profileValidator.js";
import { maskPhone } from "../utils/mask.js";

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update up to allowed fields on the user profile (fullName, phone, avatarUrl, country, dateOfBirth).
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       422:
 *         description: Validation errors.
 */
router.patch("/profile", authenticate, profileUpdateValidators, async (req, res) => {
  try {
    // Step 1: Validation gate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }));
      return res.status(422).json({ errors: formattedErrors });
    }

    // Step 2: Build the update object dynamically
    const allowed = ['fullName', 'phone', 'avatarUrl', 'country', 'dateOfBirth'];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Step 3: Persist
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 4: Return EXACT JSON shape
    const responseBody = {
      message: "Profile updated successfully",
      updated: {}
    };

    if (updates.fullName !== undefined) {
      responseBody.updated.fullName = updatedUser.fullName;
    }
    if (updates.phone !== undefined) {
      responseBody.updated.phone = maskPhone(updatedUser.phone);
    }
    if (updates.avatarUrl !== undefined) {
      responseBody.updated.avatarUrl = updatedUser.avatarUrl;
    }
    if (updates.country !== undefined) {
      responseBody.updated.country = updatedUser.country;
    }
    if (updates.dateOfBirth !== undefined) {
      // Return unmasked for frontend to confirm, or masked?
      // Spec says "Success: country/DOB masked value updates" on frontend.
      // I'll return the value from updatedUser.
      responseBody.updated.dateOfBirth = updatedUser.dateOfBirth;
    }

    return res.status(200).json(responseBody);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
