import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT token.
 */
router.post("/login", loginUser);

// Protected routes
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get basic user profile info (Auth payload)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile info retrieved.
 */
router.get("/profile", authenticate, getUserProfile);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully.
 */
router.post("/logout", authenticate, (req, res) => {
  // TODO: add token to a denylist (Redis or DB) when stateful logout is needed
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
