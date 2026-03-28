import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  email: String,
  address: String,
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  isFrequent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
