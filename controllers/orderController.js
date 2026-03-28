import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Settings from '../models/Settings.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const calcBill = (items, discountType, discountValue, couponDiscount, taxRate) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const profit = items.reduce((s, i) => s + (i.price - (i.costPrice || 0)) * i.quantity, 0);
  let discountAmount = 0;
  if (discountType === 'percent') discountAmount = (subtotal * discountValue) / 100;
  else if (discountType === 'amount') discountAmount = discountValue;
  const afterDiscount = subtotal - discountAmount - (couponDiscount || 0);
  const taxAmount = (afterDiscount * taxRate) / 100;
  const total = afterDiscount + taxAmount;
  return { subtotal, discountAmount, taxAmount, total, profit };
};

// GET /api/orders
export const getOrders = asyncHandler(async (req, res) => {
  const { platform, status, from, to, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (platform) query.platform = platform;
  if (status) query.status = status;
  if (from || to) {
    query.orderDate = {};
    if (from) query.orderDate.$gte = new Date(from);
    if (to) { const end = new Date(to); end.setHours(23,59,59); query.orderDate.$lte = end; }
  }
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { customerName: { $regex: search, $options: 'i' } },
      { customerPhone: { $regex: search, $options: 'i' } },
    ];
  }
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('customer', 'name phone')
    .sort({ orderDate: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne() || { taxRate: 5 };
  const { items, discountType, discountValue, couponDiscount, taxRate } = req.body;
  const rate = taxRate ?? settings.taxRate;
  const bill = calcBill(items, discountType, discountValue || 0, couponDiscount || 0, rate);

  const order = await Order.create({ ...req.body, ...bill, taxRate: rate });

  // Update customer stats
  if (order.customer) {
    await Customer.findByIdAndUpdate(order.customer, {
      $inc: { totalOrders: 1, totalSpent: order.total },
    });
  }
  res.status(201).json(order);
});

// GET /api/orders/:id
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json(order);
});

// PUT /api/orders/:id
export const updateOrder = asyncHandler(async (req, res) => {
  const { items, discountType, discountValue, couponDiscount, taxRate } = req.body;
  let extra = {};
  if (items) {
    const settings = await Settings.findOne() || { taxRate: 5 };
    extra = calcBill(items, discountType, discountValue || 0, couponDiscount || 0, taxRate ?? settings.taxRate);
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { ...req.body, ...extra }, { new: true });
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json(order);
});

// PATCH /api/orders/:id/status
export const updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json(order);
});

// DELETE /api/orders/:id
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json({ message: 'Order deleted' });
});

// POST /api/orders/:id/duplicate
export const duplicateOrder = asyncHandler(async (req, res) => {
  const original = await Order.findById(req.params.id);
  if (!original) { res.status(404); throw new Error('Order not found'); }
  const { _id, orderNumber, createdAt, updatedAt, ...data } = original.toObject();
  const dup = await Order.create({ ...data, orderDate: new Date(), status: 'pending', paymentStatus: 'unpaid' });
  res.status(201).json(dup);
});
