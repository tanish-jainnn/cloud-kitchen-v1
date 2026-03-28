import express from 'express';
import { getSummary, getDailyClose } from '../controllers/reportController.js';
import { getExpenses, createExpense, updateExpense, deleteExpense, getInventory, createInventoryItem, updateInventoryItem, getLowStock, getRefunds, createRefund, updateRefundStatus, getSettings, updateSettings } from '../controllers/miscControllers.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

// Reports
const reportRouter = express.Router();
reportRouter.use(protect);
reportRouter.get('/summary', getSummary);
reportRouter.get('/daily-close', getDailyClose);
export { reportRouter as default };

// Expenses - will be imported separately in server
export const expenseRouter = express.Router();
expenseRouter.use(protect);
expenseRouter.route('/').get(getExpenses).post(createExpense);
expenseRouter.route('/:id').put(updateExpense).delete(deleteExpense);

// Inventory
export const inventoryRouter = express.Router();
inventoryRouter.use(protect);
inventoryRouter.get('/low-stock', getLowStock);
inventoryRouter.route('/').get(getInventory).post(createInventoryItem);
inventoryRouter.route('/:id').put(updateInventoryItem);

// Refunds
export const refundRouter = express.Router();
refundRouter.use(protect);
refundRouter.route('/').get(getRefunds).post(createRefund);
refundRouter.patch('/:id/status', updateRefundStatus);

// Settings
export const settingsRouter = express.Router();
settingsRouter.use(protect);
settingsRouter.route('/').get(getSettings).put(updateSettings);

// Dashboard
export const dashboardRouter = express.Router();
dashboardRouter.use(protect);
dashboardRouter.get('/', getDashboard);
