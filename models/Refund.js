import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  orderNumber: String,
  amount: { type: Number, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'processed', 'rejected'], default: 'pending' },
  note: String,
}, { timestamps: true });

export default mongoose.model('Refund', refundSchema);
