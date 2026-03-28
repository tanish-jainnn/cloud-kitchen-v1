import Order from '../models/Order.js';
import Expense from '../models/Expense.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const getSummary = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const query = { status: { $ne: 'cancelled' } };
  if (from || to) {
    query.orderDate = {};
    if (from) query.orderDate.$gte = new Date(from);
    if (to) { const e = new Date(to); e.setHours(23,59,59); query.orderDate.$lte = e; }
  }
  const expQuery = {};
  if (from) expQuery.date = { $gte: new Date(from) };
  if (to) { expQuery.date = expQuery.date || {}; const e = new Date(to); e.setHours(23,59,59); expQuery.date.$lte = e; }

  const [orders, expenses] = await Promise.all([
    Order.find(query),
    Expense.find(expQuery),
  ]);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const profit = orders.reduce((s, o) => s + o.profit, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = profit - totalExpenses;

  // Platform breakdown
  const platforms = {};
  orders.forEach(o => {
    if (!platforms[o.platform]) platforms[o.platform] = { orders: 0, revenue: 0 };
    platforms[o.platform].orders++;
    platforms[o.platform].revenue += o.total;
  });

  // Top items
  const itemMap = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      const key = item.name;
      if (!itemMap[key]) itemMap[key] = { name: key, quantity: 0, revenue: 0 };
      itemMap[key].quantity += item.quantity;
      itemMap[key].revenue += item.price * item.quantity;
    });
  });
  const topItems = Object.values(itemMap).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

  // Peak hours
  const hourMap = Array(24).fill(0);
  orders.forEach(o => { hourMap[new Date(o.orderDate).getHours()]++; });
  const peakHours = hourMap.map((count, hour) => ({ hour: `${hour}:00`, orders: count }));

  res.json({ revenue, profit, netProfit, totalExpenses, orderCount: orders.length, platforms, topItems, peakHours });
});

export const getDailyClose = asyncHandler(async (req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const orders = await Order.find({ orderDate: { $gte: today, $lt: tomorrow }, status: { $ne: 'cancelled' } });
  const expenses = await Expense.find({ date: { $gte: today, $lt: tomorrow } });
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const profit = orders.reduce((s, o) => s + o.profit, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  res.json({ date: today, orders: orders.length, revenue, profit, expenses: totalExpenses, netProfit: profit - totalExpenses });
});
