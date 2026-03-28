import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, default: 0 },
  quantity: { type: Number, required: true, min: 1 },
  variant: String,
  notes: String,
  isCustom: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  platform: { type: String, enum: ['zomato', 'swiggy', 'direct'], required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: String,
  customerPhone: String,
  items: [orderItemSchema],
  subtotal: { type: Number, default: 0 },
  discountType: { type: String, enum: ['amount', 'percent', 'none'], default: 'none' },
  discountValue: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: String,
  couponDiscount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 5 },
  taxAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cod', 'online', 'split'], default: 'cod' },
  paymentStatus: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  partialAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'delivered', 'cancelled'],
    default: 'pending',
  },
  priority: { type: Boolean, default: false },
  tags: [String],
  orderNote: String,
  orderDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const now = new Date();
    const prefix = `CK${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
