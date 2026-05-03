import express from "express";
import authenticate from "../middleware/authenticate.js";
import User from "../models/User.js";
import AccountSetting from "../models/AccountSetting.js";
import AccountLimit from "../models/AccountLimit.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

import { maskPhone, maskDob } from "../utils/mask.js";

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get detailed user profile and portfolio
 *     description: Retrieve user details, account settings, limits, portfolio stats, and recent activity.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full profile payload returned.
 *       404:
 *         description: User not found.
 */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    
    const [user, account, limit, recentActivity, totalTrades] = await Promise.all([
      User.findById(userId).lean(),
      AccountSetting.findOne({ userId }).lean(),
      AccountLimit.findOne({ userId }).lean(),
      Transaction.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      Transaction.countDocuments({ userId })
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: maskPhone(user.phone),
        country: user.country,
        dateOfBirth: maskDob(user.dateOfBirth),
        dateOfBirthRaw: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : null,
        avatarUrl: user.avatarUrl || null,
        memberSince: user.createdAt ? new Date(user.createdAt).toISOString() : null
      },
      account: account ? {
        tier: account.tier,
        kycLevel: account.kycLevel,
        emailVerified: account.emailVerified,
        phoneVerified: account.phoneVerified,
        twoFaEnabled: account.twoFaEnabled,
        twoFaMethod: account.twoFaMethod
      } : null,
      limits: limit ? {
        dailyBuyLimit: limit.dailyBuyLimit,
        dailyBuyUsed: limit.dailyBuyUsed,
        dailySellLimit: limit.dailySellLimit,
        monthlyLimit: limit.monthlyLimit
      } : null,
      portfolio: {
        totalValueUsd: 0, // TODO: compute from holdings × live price feed
        dayChangeUsd: 0, // TODO: compute from holdings × live price feed
        dayChangePct: 0, // TODO: compute from holdings × live price feed
        totalTrades: totalTrades
      },
      recentActivity: recentActivity.map(txn => ({
        id: txn._id.toString(),
        type: txn.type,
        asset: txn.asset,
        amount: txn.amount,
        usdValue: txn.usdValue,
        status: txn.status,
        timestamp: txn.createdAt ? new Date(txn.createdAt).toISOString() : null
      }))
    };

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
