import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const getCustomers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }] }
    : {};
  const customers = await Customer.find(query).sort({ totalOrders: -1 });
  res.json(customers);
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(customer);
});

export const getCustomerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.params.id }).sort({ orderDate: -1 }).limit(20);
  res.json(orders);
});
