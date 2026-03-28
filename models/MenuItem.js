import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: String,
  price: Number,
  costPrice: { type: Number, default: 0 },
});

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  sellingPrice: { type: Number, required: true },
  costPrice: { type: Number, default: 0 },
  description: String,
  isActive: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: true },
  variants: [variantSchema],
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
