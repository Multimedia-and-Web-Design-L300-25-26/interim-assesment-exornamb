import mongoose from "mongoose";

const accountLimitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dailyBuyLimit: { type: Number, default: 1000 },
  dailyBuyUsed: { type: Number, default: 0 },
  dailySellLimit: { type: Number, default: 1000 },
  monthlyLimit: { type: Number, default: 10000 },
  lastResetDate: { type: Date, default: Date.now }
});

export default mongoose.model("AccountLimit", accountLimitSchema);
