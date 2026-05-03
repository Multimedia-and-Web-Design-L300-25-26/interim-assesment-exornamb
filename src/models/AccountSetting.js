import mongoose from "mongoose";

const accountSettingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tier: { type: String, enum: ['standard', 'pro', 'institutional'], default: 'standard' },
  kycLevel: { type: Number, default: 0 },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  twoFaEnabled: { type: Boolean, default: false },
  twoFaMethod: { type: String, enum: ['app', 'sms', 'none'], default: 'none' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("AccountSetting", accountSettingSchema);
