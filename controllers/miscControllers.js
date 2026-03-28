import Expense from '../models/Expense.js';
import Inventory from '../models/Inventory.js';
import Refund from '../models/Refund.js';
import Settings from '../models/Settings.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// ─── EXPENSES ───────────────────────────────────────────────
export const getExpenses = asyncHandler(async (req, res) => {
  const { from, to, category } = req.query;
  const query = {};
  if (category) query.category = category;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) { const e = new Date(to); e.setHours(23,59,59); query.date.$lte = e; }
  }
  const expenses = await Expense.find(query).sort({ date: -1 });
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  res.json({ expenses, total });
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create(req.body);
  res.status(201).json(expense);
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// ─── INVENTORY ──────────────────────────────────────────────
export const getInventory = asyncHandler(async (req, res) => {
  const items = await Inventory.find().sort({ name: 1 });
  res.json(items);
});

export const createInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json(item);
});

export const updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(
    req.params.id,
    { ...req.body, lastUpdated: new Date() },
    { new: true }
  );
  res.json(item);
});

export const getLowStock = asyncHandler(async (req, res) => {
  const items = await Inventory.find({ $expr: { $lte: ['$currentStock', '$minStock'] } });
  res.json(items);
});

// ─── REFUNDS ────────────────────────────────────────────────
export const getRefunds = asyncHandler(async (req, res) => {
  const refunds = await Refund.find().populate('order', 'orderNumber platform total').sort({ createdAt: -1 });
  res.json(refunds);
});

export const createRefund = asyncHandler(async (req, res) => {
  const refund = await Refund.create(req.body);
  res.status(201).json(refund);
});

export const updateRefundStatus = asyncHandler(async (req, res) => {
  const refund = await Refund.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(refund);
});

// ─── SETTINGS ───────────────────────────────────────────────
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
  }
  res.json(settings);
});
