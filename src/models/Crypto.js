import mongoose from "mongoose";

const cryptoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true, uppercase: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    change24h: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Crypto = mongoose.model("Crypto", cryptoSchema);
export default Crypto;
