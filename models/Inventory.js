import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, default: 'kg' },
  currentStock: { type: Number, default: 0 },
  minStock: { type: Number, default: 1 },
  costPerUnit: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);
