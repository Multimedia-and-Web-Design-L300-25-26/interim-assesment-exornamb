import express from "express";
import { getAllCryptos, getTopGainers, getNewListings, createCrypto } from "../controllers/cryptoController.js";

const router = express.Router();

/**
 * @swagger
 * /api/crypto:
 *   get:
 *     summary: Retrieve a list of all cryptocurrencies
 *     description: Retrieve a list of all cryptocurrencies from the database.
 *     tags: [Crypto]
 *     responses:
 *       200:
 *         description: A list of cryptocurrencies.
 */
router.get("/", getAllCryptos);

/**
 * @swagger
 * /api/crypto/gainers:
 *   get:
 *     summary: Retrieve top gainers
 *     description: Retrieve cryptocurrencies sorted by highest 24h change.
 *     tags: [Crypto]
 *     responses:
 *       200:
 *         description: A list of top gaining cryptocurrencies.
 */
router.get("/gainers", getTopGainers);

/**
 * @swagger
 * /api/crypto/new:
 *   get:
 *     summary: Retrieve new listings
 *     description: Retrieve the most recently added cryptocurrencies.
 *     tags: [Crypto]
 *     responses:
 *       200:
 *         description: A list of newly listed cryptocurrencies.
 */
router.get("/new", getNewListings);

/**
 * @swagger
 * /api/crypto:
 *   post:
 *     summary: Create a new cryptocurrency
 *     description: Add a new cryptocurrency to the database. Supports single object or array for bulk insert.
 *     tags: [Crypto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               change24h:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successfully created.
 */
router.post("/", createCrypto);

export default router;
