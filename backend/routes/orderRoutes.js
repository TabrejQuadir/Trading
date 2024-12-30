const express = require('express');
const { createOrder, getAllOrders, getOrderById, getUserOrders, getPriceAfterDuration, getOrdersBySubAdmin } = require('../controllers/orderController');

const router = express.Router();

// Route to create an order
router.post('/create', createOrder);


// Route to get a specific order by ID
router.get('/:orderId', getOrderById);

// Route to get all orders for a specific user
router.get('/user/:userId', getUserOrders);

// New route to get price after duration
router.get('/priceAfterDuration/:symbol/:duration', getPriceAfterDuration);

// Route to get orders by subadmin
router.get('/subadmin/:userId', getOrdersBySubAdmin);

// Route to get all orders
router.get('/superadmin/allOrders', getAllOrders);

module.exports = router;
