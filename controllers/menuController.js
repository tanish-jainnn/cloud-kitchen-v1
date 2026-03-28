import MenuItem from '../models/MenuItem.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const getMenuItems = asyncHandler(async (req, res) => {
  const { category, active } = req.query;
  const query = {};
  if (category) query.category = category;
  if (active !== undefined) query.isActive = active === 'true';
  const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
  res.json(items);
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) { res.status(404); throw new Error('Item not found'); }
  res.json(item);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

export const toggleMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  item.isActive = !item.isActive;
  await item.save();
  res.json(item);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await MenuItem.distinct('category');
  res.json(categories);
});
