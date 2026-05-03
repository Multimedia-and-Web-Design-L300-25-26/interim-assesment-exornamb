import Crypto from "../models/Crypto.js";

// GET /api/crypto
export const getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find({}).lean();
    const formattedCryptos = cryptos.map(c => ({
      ...c,
      image_url: c.image // Map database 'image' to frontend 'image_url'
    }));
    return res.status(200).json(formattedCryptos);
  } catch (err) {
    console.error("Error fetching cryptos:", err);
    return res.status(500).json({ message: "Server error while fetching cryptocurrencies" });
  }
};

// GET /api/crypto/gainers
export const getTopGainers = async (req, res) => {
  try {
    // Sort by change24h descending (highest first)
    const cryptos = await Crypto.find({}).sort({ change24h: -1 });
    return res.status(200).json(cryptos);
  } catch (err) {
    console.error("Error fetching top gainers:", err);
    return res.status(500).json({ message: "Server error while fetching top gainers" });
  }
};

// GET /api/crypto/new
export const getNewListings = async (req, res) => {
  try {
    // Sort by createdAt descending (newest first)
    const cryptos = await Crypto.find({}).sort({ createdAt: -1 });
    return res.status(200).json(cryptos);
  } catch (err) {
    console.error("Error fetching new listings:", err);
    return res.status(500).json({ message: "Server error while fetching new listings" });
  }
};

// POST /api/crypto
export const createCrypto = async (req, res) => {
  try {
    // Check if the request body is an array (for bulk creation)
    if (Array.isArray(req.body)) {
      // Basic validation for all items
      for (const item of req.body) {
        if (!item.name || !item.symbol || item.price === undefined || !item.image || item.change24h === undefined) {
          return res.status(400).json({ message: "Please provide all required fields for each cryptocurrency." });
        }
      }

      // Use insertMany to insert the array of documents
      // { ordered: false } allows the operation to continue even if some cryptos fail (e.g. duplicate symbols)
      try {
        const cryptos = await Crypto.insertMany(req.body, { ordered: false });
        return res.status(201).json({ message: `${cryptos.length} cryptocurrencies created successfully`, cryptos });
      } catch (insertErr) {
        return res.status(400).json({ message: "Error during bulk insert. Some symbols might already exist.", details: insertErr.message });
      }
    }

    // Single item logic (if request body is just one object)
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || price === undefined || !image || change24h === undefined) {
      return res.status(400).json({ message: "Please provide all required fields: name, symbol, price, image, change24h" });
    }

    const existing = await Crypto.findOne({ symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: `Cryptocurrency with symbol ${symbol.toUpperCase()} already exists` });
    }

    const crypto = await Crypto.create({
      name,
      symbol,
      price,
      image,
      change24h,
    });

    return res.status(201).json({ message: "Cryptocurrency created successfully", crypto });
  } catch (err) {
    console.error("Error creating crypto:", err);
    return res.status(500).json({ message: "Server error while creating cryptocurrency" });
  }
};
