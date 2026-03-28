import express from 'express';
import { getCustomers, createCustomer, updateCustomer, getCustomerOrders } from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.route('/').get(getCustomers).post(createCustomer);
router.route('/:id').put(updateCustomer);
router.get('/:id/orders', getCustomerOrders);
export default router;
