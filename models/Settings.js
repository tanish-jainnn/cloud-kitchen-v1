import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  businessName: { type: String, default: 'My Cloud Kitchen' },
  logo: String,
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  taxRate: { type: Number, default: 5 },
  taxLabel: { type: String, default: 'GST' },
  address: String,
  phone: String,
  email: String,
  invoiceNote: { type: String, default: 'Thank you for your order!' },
  upiId: String,
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
