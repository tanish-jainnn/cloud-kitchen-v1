import Order from '../models/Order.js';
import Expense from '../models/Expense.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = new Date(today); weekStart.setDate(today.getDate() - 6);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayOrders, weekOrders, monthOrders, todayExpenses] = await Promise.all([
    Order.find({ orderDate: { $gte: today, $lt: tomorrow } }),
    Order.find({ orderDate: { $gte: weekStart } }),
    Order.find({ orderDate: { $gte: monthStart } }),
    Expense.find({ date: { $gte: today, $lt: tomorrow } }),
  ]);

  const active = (orders) => orders.filter(o => o.status !== 'cancelled');

  const sum = (orders, field) => active(orders).reduce((s, o) => s + (o[field] || 0), 0);

  // Platform breakdown for today
  const platforms = ['zomato', 'swiggy', 'direct'];
  const platformBreakdown = platforms.map(p => ({
    platform: p,
    orders: active(todayOrders).filter(o => o.platform === p).length,
    revenue: active(todayOrders).filter(o => o.platform === p).reduce((s, o) => s + o.total, 0),
  }));

  // Last 7 days chart
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const dEnd = new Date(d); dEnd.setDate(d.getDate() + 1);
    const dayOrders = weekOrders.filter(o => o.orderDate >= d && o.orderDate < dEnd);
    last7.push({
      date: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      revenue: active(dayOrders).reduce((s, o) => s + o.total, 0),
      orders: active(dayOrders).length,
    });
  }

  // Status counts
  const statusCounts = {
    pending: todayOrders.filter(o => o.status === 'pending').length,
    preparing: todayOrders.filter(o => o.status === 'preparing').length,
    delivered: todayOrders.filter(o => o.status === 'delivered').length,
    cancelled: todayOrders.filter(o => o.status === 'cancelled').length,
  };

  res.json({
    today: {
      revenue: sum(todayOrders, 'total'),
      profit: sum(todayOrders, 'profit'),
      orders: active(todayOrders).length,
      expenses: todayExpenses.reduce((s, e) => s + e.amount, 0),
    },
    week: {
      revenue: sum(weekOrders, 'total'),
      orders: active(weekOrders).length,
    },
    month: {
      revenue: sum(monthOrders, 'total'),
      orders: active(monthOrders).length,
    },
    platformBreakdown,
    last7,
    statusCounts,
    recentOrders: active(todayOrders).slice(0, 8).reverse(),
  });
});
